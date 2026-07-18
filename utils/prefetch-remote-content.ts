import { Image } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/constants/firebase';
import { contentCache, RawDoc } from '@/utils/content-cache';

async function fetchActiveDocs(collectionName: string): Promise<RawDoc[]> {
  const snap = await getDocs(query(collection(db, collectionName), where('active', '==', true))).catch(() => null);
  if (!snap) return [];
  return snap.docs.map((d) => ({ id: d.id, data: d.data() }));
}

async function collectImageUrls(collectionNames: readonly string[]): Promise<Set<string>> {
  const docLists = await Promise.all(collectionNames.map(fetchActiveDocs));

  const urls = new Set<string>();
  docLists.forEach((docs) => {
    docs.forEach(({ data }) => {
      const url = data.imageUrl;
      if (typeof url === 'string' && url) urls.add(url);
    });
  });
  return urls;
}

// Menu and spa service photos are small in number but shown immediately on
// screens users open right after launch — download and await all of them
// before the splash screen releases, so those two sections never show a
// loading placeholder at all. The fetched docs are also cached so
// useMenu/useSpaServices can read them synchronously instead of re-querying
// Firestore every time those screens mount (e.g. switching Senator/Balkon).
export async function prefetchCriticalContent(): Promise<void> {
  const [menuDocs, spaDocs] = await Promise.all([
    fetchActiveDocs('menu'),
    fetchActiveDocs('spa_services'),
  ]);
  contentCache.menu = menuDocs;
  contentCache.spaServices = spaDocs;

  const urls = new Set<string>();
  [...menuDocs, ...spaDocs].forEach(({ data }) => {
    if (typeof data.imageUrl === 'string' && data.imageUrl) urls.add(data.imageUrl);
  });
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
