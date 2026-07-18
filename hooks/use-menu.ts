import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/constants/firebase';
import { contentCache } from '@/utils/content-cache';

export type MenuRestaurant = 'Senator' | 'Balkon';

export interface MenuPage {
  id: string;
  restaurant: MenuRestaurant;
  imageUrl: string;
  order: number;
  active: boolean;
}

function toMenuPage(id: string, data: Record<string, any>): MenuPage {
  return {
    id,
    restaurant: data.restaurant,
    imageUrl: data.imageUrl,
    order: data.order ?? 0,
    active: data.active,
  };
}

export function useMenu(restaurant: MenuRestaurant) {
  const cached = contentCache.menu;
  const initialPages = cached
    ? cached
        .filter((d) => d.data.restaurant === restaurant)
        .map((d) => toMenuPage(d.id, d.data))
        .sort((a, b) => a.order - b.order)
    : [];

  const [pages, setPages] = useState<MenuPage[]>(initialPages);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    // Splash already preloaded every active menu page — filter from that
    // cache instead of re-querying Firestore on every mount.
    if (contentCache.menu) {
      const items = contentCache.menu
        .filter((d) => d.data.restaurant === restaurant)
        .map((d) => toMenuPage(d.id, d.data))
        .sort((a, b) => a.order - b.order);
      setPages(items);
      setLoading(false);
      return;
    }

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
        setPages(snap.docs.map((d) => toMenuPage(d.id, d.data())));
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
