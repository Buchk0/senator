import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
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
    let cancelled = false;

    // Wait for auth to be ready before querying — on cold start the session
    // is restored asynchronously, so auth.currentUser may still be null when
    // this effect first runs.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }

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
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [restaurant]);

  return { photos, loading };
}
