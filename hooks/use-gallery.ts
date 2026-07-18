import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/constants/firebase';
import { contentCache } from '@/utils/content-cache';

export interface GalleryPhoto {
  id: string;
  imageUrl: string;
  order: number;
  active: boolean;
}

function toGalleryPhoto(id: string, data: Record<string, any>): GalleryPhoto {
  return {
    id,
    imageUrl: data.imageUrl,
    order: data.order ?? 0,
    active: data.active,
  };
}

export function useGallery() {
  const cached = contentCache.gallery;
  const initialPhotos = cached
    ? cached.map((d) => toGalleryPhoto(d.id, d.data)).sort((a, b) => a.order - b.order)
    : [];

  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    // Already fetched in the background at app startup — read from that
    // cache instead of re-querying Firestore on every mount.
    if (contentCache.gallery) {
      setPhotos(
        contentCache.gallery.map((d) => toGalleryPhoto(d.id, d.data)).sort((a, b) => a.order - b.order)
      );
      setLoading(false);
      return;
    }

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
        setPhotos(snap.docs.map((d) => toGalleryPhoto(d.id, d.data())));
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
