import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/constants/firebase';

export type PhotoRestaurant = 'Senator' | 'Balkon';

export interface RestaurantPhoto {
  id: string;
  restaurant: PhotoRestaurant;
  imageUrl: string;
  active: boolean;
}

export function useRestaurantPhotos(restaurant: PhotoRestaurant) {
  const [photos, setPhotos] = useState<RestaurantPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    getDocs(
      query(
        collection(db, 'restaurantPhotos'),
        where('restaurant', '==', restaurant),
        where('active', '==', true),
        orderBy('createdAt', 'desc')
      )
    )
      .then((snap) => {
        if (cancelled) return;
        const items: RestaurantPhoto[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            restaurant: data.restaurant,
            imageUrl: data.imageUrl,
            active: data.active,
          };
        });
        setPhotos(items);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [restaurant]);

  return { photos, loading };
}
