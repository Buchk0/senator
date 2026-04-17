import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '@/constants/firebase';
import { EventItem } from '@/components/home/events-carousel';
import { useTranslation } from 'react-i18next';

export function useEvents() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === 'kz' ? 'kz' : i18n.language === 'ru' ? 'ru' : 'en') as 'en' | 'ru' | 'kz';

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    getDocs(query(collection(db, 'events'), where('active', '==', true)))
      .then((snap) => {
        const items: EventItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            imageUrl: data.imageUrl ?? '',
            title: data.title?.[lang] ?? data.title?.en ?? '',
            subtitle: data.date ?? '',
          };
        });
        setEvents(items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [lang]);

  return { events, loading };
}
