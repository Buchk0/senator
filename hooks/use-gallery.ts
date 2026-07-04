import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db, auth } from '@/constants/firebase';

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
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    getDocs(
      query(
        collection(db, 'gallery'),
        where('active', '==', true),
        orderBy('order', 'asc')
      )
    )
      .then((snap) => {
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
      .finally(() => setLoading(false));
  }, []);

  return { photos, loading };
}
