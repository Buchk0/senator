import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/constants/firebase';
import { EventItem } from '@/components/home/events-carousel';
import { useTranslation } from 'react-i18next';

export function useEvents() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === 'kz' ? 'kz' : i18n.language === 'ru' ? 'ru' : 'en') as 'en' | 'ru' | 'kz';

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    getDocs(query(collection(db, 'events'), where('active', '==', true)))
      .then((snap) => {
        if (cancelled) return;
        const items: EventItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            imageUrl: data.imageUrl ?? '',
            // ?? only falls through on null/undefined — admin only requires
            // the EN field, so an untranslated RU/KZ title is '' (not
            // nullish) and would render blank without the `||` fallback.
            title: data.title?.[lang] || data.title?.en || '',
            subtitle: data.date ?? '',
          };
        });
        setEvents(items);
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
