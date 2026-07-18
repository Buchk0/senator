import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/constants/firebase';

export type MenuRestaurant = 'Senator' | 'Balkon';

export interface MenuPage {
  id: string;
  restaurant: MenuRestaurant;
  imageUrl: string;
  order: number;
  active: boolean;
}

export function useMenu(restaurant: MenuRestaurant) {
  const [pages, setPages] = useState<MenuPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    getDocs(
      query(
        collection(db, 'menu'),
        where('restaurant', '==', restaurant),
        where('active', '==', true),
        orderBy('order', 'asc')
      )
    )
      .then((snap) => {
        if (cancelled) return;
        const items: MenuPage[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            restaurant: data.restaurant,
            imageUrl: data.imageUrl,
            order: data.order ?? 0,
            active: data.active,
          };
        });
        setPages(items);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [restaurant]);

  return { pages, loading };
}
