import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db, auth } from '@/constants/firebase';

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
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    getDocs(
      query(
        collection(db, 'menu'),
        where('restaurant', '==', restaurant),
        where('active', '==', true),
        orderBy('order', 'asc')
      )
    )
      .then((snap) => {
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
      .finally(() => setLoading(false));
  }, [restaurant]);

  return { pages, loading };
}
