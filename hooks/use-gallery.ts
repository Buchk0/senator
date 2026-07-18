import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/constants/firebase';

export interface GalleryPhoto {
  id: string;
  imageUrl: string;
  order: number;
  active: boolean;
}

export function useGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    getDocs(
      query(
        collection(db, 'gallery'),
        where('active', '==', true),
        orderBy('order', 'asc')
      )
    )
      .then((snap) => {
        if (cancelled) return;
        const items: GalleryPhoto[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            imageUrl: data.imageUrl,
            order: data.order ?? 0,
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
  }, []);

  return { photos, loading };
}
