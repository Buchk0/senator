import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { db } from '@/constants/firebase';
import { contentCache } from '@/utils/content-cache';

export type SpaServiceItem = {
  id: string;
  name: string;
  duration: string;
  price: string;
  imageUrl: string;
};

function toSpaServiceItem(id: string, data: Record<string, any>, lang: 'en' | 'ru' | 'kz'): SpaServiceItem {
  return {
    id,
    name: data.name?.[lang] || data.name?.en || '',
    duration: data.duration ?? '',
    price: data.price ?? '',
    imageUrl: data.imageUrl ?? '',
  };
}

export function useSpaServices() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === 'kz' ? 'kz' : i18n.language === 'ru' ? 'ru' : 'en') as 'en' | 'ru' | 'kz';

  const cached = contentCache.spaServices;
  const [services, setServices] = useState<SpaServiceItem[]>(
    cached ? cached.map((d) => toSpaServiceItem(d.id, d.data, lang)) : []
  );
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    // Splash already preloaded every active spa service — map from that
    // cache instead of re-querying Firestore on every mount.
    if (contentCache.spaServices) {
      setServices(contentCache.spaServices.map((d) => toSpaServiceItem(d.id, d.data, lang)));
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    getDocs(query(collection(db, 'spa_services'), where('active', '==', true)))
      .then((snap) => {
        if (cancelled) return;
        setServices(snap.docs.map((d) => toSpaServiceItem(d.id, d.data(), lang)));
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { services, loading };
}
