import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db, auth } from '@/constants/firebase';

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
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    getDocs(
      query(
        collection(db, 'restaurantPhotos'),
        where('restaurant', '==', restaurant),
        where('active', '==', true),
        orderBy('createdAt', 'desc')
      )
    )
      .then((snap) => {
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
      .finally(() => setLoading(false));
  }, [restaurant]);

  return { photos, loading };
}
