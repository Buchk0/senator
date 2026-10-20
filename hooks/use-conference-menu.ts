import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { db } from '@/constants/firebase';
import { contentCache } from '@/utils/content-cache';

export type ConferenceMenuType = 'coffee_break' | 'business_lunch';

export interface ConferenceMenuItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  /** One dish per line */
  items: string[];
  /** Coffee break only: drinks shown in the right column */
  drinks: string[];
}

type Lang = 'en' | 'ru' | 'kz';

function localized(field: Record<string, string> | undefined, lang: Lang): string {
  // Admin only requires the RU field — an untranslated EN/KZ entry is ''
  // (not nullish), so fall back to RU explicitly instead of showing blank.
  return field?.[lang] || field?.ru || field?.en || '';
}

function toLines(text: string): string[] {
  return text.split('\n').map((line) => line.trim()).filter(Boolean);
}

function toMenuItem(id: string, data: Record<string, any>, lang: Lang): ConferenceMenuItem {
  return {
    id,
    title: localized(data.title, lang),
    price: data.price ?? '',
    imageUrl: data.imageUrl ?? '',
    items: toLines(localized(data.items, lang)),
    drinks: toLines(localized(data.drinks, lang)),
  };
}

export function useConferenceMenu(type: ConferenceMenuType) {
  const { i18n } = useTranslation();
  const lang = (i18n.language === 'kz' ? 'kz' : i18n.language === 'ru' ? 'ru' : 'en') as Lang;

  const [menus, setMenus] = useState<ConferenceMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Already fetched in the background at app startup — read from that
    // cache instead of re-querying Firestore on every mount.
    if (contentCache.conferenceMenus) {
      setMenus(
        contentCache.conferenceMenus
          .filter((d) => d.data.type === type)
          .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
          .map((d) => toMenuItem(d.id, d.data, lang))
      );
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    getDocs(
      query(
        collection(db, 'conferenceMenus'),
        where('type', '==', type),
        where('active', '==', true),
        orderBy('order', 'asc')
      )
    )
      .then((snap) => {
        if (cancelled) return;
        setMenus(snap.docs.map((d) => toMenuItem(d.id, d.data(), lang)));
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [type, lang]);

  return { menus, loading };
}
