import { Image } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/constants/firebase';

const COLLECTIONS_WITH_IMAGES = [
  'restaurantPhotos',
  'menu',
  'gallery',
  'spa_services',
  'events',
  'coupons',
] as const;

// Fetches every active Firestore-backed collection's imageUrl and starts
// downloading them into the RN image cache right away, so screens like
// Senator/Balkon photos, menu, gallery no longer show a load-in-place spinner
// the first time the user opens them after login.
export async function prefetchRemoteContent(): Promise<void> {
  const snapshots = await Promise.all(
    COLLECTIONS_WITH_IMAGES.map((name) =>
      getDocs(query(collection(db, name), where('active', '==', true))).catch(() => null)
    )
  );

  const urls = new Set<string>();
  snapshots.forEach((snap) => {
    if (!snap) return;
    snap.docs.forEach((d) => {
      const url = d.data().imageUrl;
      if (typeof url === 'string' && url) urls.add(url);
    });
  });

  urls.forEach((url) => {
    Image.prefetch(url).catch(() => {});
  });
}
