import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { db, auth } from '@/constants/firebase';

export type SpaServiceItem = {
  id: string;
  name: string;
  duration: string;
  price: string;
  imageUrl: string;
};

export function useSpaServices() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === 'kz' ? 'kz' : i18n.language === 'ru' ? 'ru' : 'en') as 'en' | 'ru' | 'kz';

  const [services, setServices] = useState<SpaServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }

      setLoading(true);
      getDocs(query(collection(db, 'spa_services'), where('active', '==', true)))
        .then((snap) => {
          if (cancelled) return;
          const items: SpaServiceItem[] = snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              name: data.name?.[lang] ?? data.name?.en ?? '',
              duration: data.duration ?? '',
              price: data.price ?? '',
              imageUrl: data.imageUrl ?? '',
            };
          });
          setServices(items);
        })
        .catch(console.error)
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [lang]);

  return { services, loading };
}
