import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/constants/firebase';
import { EventItem } from '@/components/home/events-carousel';
import { useTranslation } from 'react-i18next';
import { contentCache } from '@/utils/content-cache';

function toEventItem(id: string, data: Record<string, any>, lang: 'en' | 'ru' | 'kz'): EventItem {
  return {
    id,
    imageUrl: data.imageUrl ?? '',
    // ?? only falls through on null/undefined — admin only requires
    // the EN field, so an untranslated RU/KZ title is '' (not
    // nullish) and would render blank without the `||` fallback.
    title: data.title?.[lang] || data.title?.en || '',
    subtitle: data.date ?? '',
  };
}

export function useEvents() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === 'kz' ? 'kz' : i18n.language === 'ru' ? 'ru' : 'en') as 'en' | 'ru' | 'kz';

  const cached = contentCache.events;
  const [events, setEvents] = useState<EventItem[]>(
    cached ? cached.map((d) => toEventItem(d.id, d.data, lang)) : []
  );
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    // Already fetched in the background at app startup — map from that
    // cache instead of re-querying Firestore on every mount.
    if (contentCache.events) {
      setEvents(contentCache.events.map((d) => toEventItem(d.id, d.data, lang)));
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    getDocs(query(collection(db, 'events'), where('active', '==', true)))
      .then((snap) => {
        if (cancelled) return;
        setEvents(snap.docs.map((d) => toEventItem(d.id, d.data(), lang)));
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { events, loading };
}
