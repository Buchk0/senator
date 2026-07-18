import { Image } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/constants/firebase';

async function collectImageUrls(collectionNames: readonly string[]): Promise<Set<string>> {
  const snapshots = await Promise.all(
    collectionNames.map((name) =>
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
  return urls;
}

// Menu and spa service photos are small in number but shown immediately on
// screens users open right after launch — download and await all of them
// before the splash screen releases, so those two sections never show a
// loading placeholder at all.
export async function prefetchCriticalContent(): Promise<void> {
  const urls = await collectImageUrls(['menu', 'spa_services']);
  await Promise.allSettled([...urls].map((url) => Image.prefetch(url)));
}

// Everything else (restaurantPhotos, gallery, events, coupons) is public or
// becomes readable after login — start downloading in the background without
// blocking the UI; screens show a fade-in placeholder until each one lands.
export async function prefetchBackgroundContent(): Promise<void> {
  const urls = await collectImageUrls(['restaurantPhotos', 'gallery', 'events', 'coupons']);
  urls.forEach((url) => {
    Image.prefetch(url).catch(() => {});
  });
}
