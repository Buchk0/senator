import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { db } from '@/constants/firebase';
import { contentCache, RawDoc } from '@/utils/content-cache';

export type PromoVenue = 'hotel' | 'senator' | 'balkon';
export type PromoLink = 'none' | 'hotel' | 'senator' | 'balkon' | 'contact';

type Localized = { en?: string; ru?: string; kz?: string };

export interface PromoBanner {
  id: string;
  imageUrl: string;
  title: string;
  badge: string;
  description: string;
  period: string;
  link: PromoLink;
  darken: boolean;
}

/**
 * Banners managed in the admin panel (promoBanners collection) for one venue,
 * active only, in the admin's order.
 *
 * `banners` is null when the venue has no banners in Firestore at all (or it
 * couldn't be reached) — callers then show the built-in banners. A venue
 * whose banners all exist but are switched off gets an empty list instead,
 * so turning everything off in the admin really hides them.
 */
export function usePromoBanners(venue: PromoVenue) {
  const { i18n } = useTranslation();
  const lang = (i18n.language === 'kz' ? 'kz' : i18n.language === 'ru' ? 'ru' : 'en') as 'en' | 'ru' | 'kz';
  const [docs, setDocs] = useState<RawDoc[] | null>(contentCache.promoBanners);
  const [loading, setLoading] = useState(!contentCache.promoBanners);

  useEffect(() => {
    // Already fetched at app startup — read from that cache instead of
    // re-querying Firestore on every mount.
    if (contentCache.promoBanners) {
      setDocs(contentCache.promoBanners);
      setLoading(false);
      return;
    }

    let cancelled = false;
    getDocs(collection(db, 'promoBanners'))
      .then((snap) => {
        const fetched = snap.docs.map((d) => ({ id: d.id, data: d.data() }));
        contentCache.promoBanners = fetched;
        if (!cancelled) setDocs(fetched);
      })
      // Unreachable or not readable (e.g. offline, or the promoBanners rules
      // not deployed yet): stay quiet — callers show the built-in banners.
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const pick = (field?: Localized) => field?.[lang] || field?.en || field?.ru || '';

  const venueDocs = docs?.filter((d) => d.data.venue === venue) ?? [];
  const banners: PromoBanner[] | null = venueDocs.length === 0
    ? null
    : venueDocs
        .filter((d) => d.data.active)
        .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
        .map(({ id, data }) => ({
          id,
          imageUrl: data.imageUrl ?? '',
          title: pick(data.title),
          badge: pick(data.badge),
          description: pick(data.description),
          period: pick(data.period),
          link: data.link ?? 'none',
          darken: data.darken ?? true,
        }));

  return { banners, loading };
}
