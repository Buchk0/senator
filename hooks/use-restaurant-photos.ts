import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/constants/firebase';
import { contentCache } from '@/utils/content-cache';

export type PhotoRestaurant = 'Senator' | 'Balkon';

export interface RestaurantPhoto {
  id: string;
  restaurant: PhotoRestaurant;
  imageUrl: string;
  active: boolean;
  createdAt?: { seconds: number; nanoseconds: number };
}

function toPhoto(id: string, data: Record<string, any>): RestaurantPhoto {
  return {
    id,
    restaurant: data.restaurant,
    imageUrl: data.imageUrl,
    active: data.active,
    createdAt: data.createdAt,
  };
}

function sortByCreatedAtDesc(a: RestaurantPhoto, b: RestaurantPhoto): number {
  return (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0);
}

export function useRestaurantPhotos(restaurant: PhotoRestaurant) {
  const cached = contentCache.restaurantPhotos;
  const initialPhotos = cached
    ? cached
        .filter((d) => d.data.restaurant === restaurant)
        .map((d) => toPhoto(d.id, d.data))
        .sort(sortByCreatedAtDesc)
    : [];

  const [photos, setPhotos] = useState<RestaurantPhoto[]>(initialPhotos);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    // Already fetched in the background at app startup — filter from that
    // cache instead of re-querying Firestore on every mount.
    if (contentCache.restaurantPhotos) {
      const items = contentCache.restaurantPhotos
        .filter((d) => d.data.restaurant === restaurant)
        .map((d) => toPhoto(d.id, d.data))
        .sort(sortByCreatedAtDesc);
      setPhotos(items);
      setLoading(false);
      return;
    }

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
        setPhotos(snap.docs.map((d) => toPhoto(d.id, d.data())));
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
