import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
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
    if (!auth.currentUser) return;
    getDocs(query(collection(db, 'spa_services'), where('active', '==', true)))
      .then((snap) => {
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
      .finally(() => setLoading(false));
  }, [lang]);

  return { services, loading };
}
