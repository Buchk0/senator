import { Image } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/constants/firebase';
import { contentCache, RawDoc } from '@/utils/content-cache';

async function fetchActiveDocs(collectionName: string): Promise<RawDoc[] | null> {
  try {
    const snap = await getDocs(query(collection(db, collectionName), where('active', '==', true)));
    return snap.docs.map((d) => ({ id: d.id, data: d.data() }));
  } catch {
    // e.g. coupons before login — leave the cache empty so the hook falls
    // back to its own query once it's actually allowed to read.
    return null;
  }
}

function prefetchImages(docLists: (RawDoc[] | null)[]): Promise<unknown> {
  const urls = new Set<string>();
  docLists.forEach((docs) => {
    docs?.forEach(({ data }) => {
      if (typeof data.imageUrl === 'string' && data.imageUrl) urls.add(data.imageUrl);
    });
  });
  return Promise.allSettled([...urls].map((url) => Image.prefetch(url)));
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
  if (menuDocs) contentCache.menu = menuDocs;
  if (spaDocs) contentCache.spaServices = spaDocs;

  await prefetchImages([menuDocs, spaDocs]);
}

// Everything else (restaurantPhotos, gallery, events, coupons) is public or
// becomes readable after login — download in the background without
// blocking the UI, and cache the docs too so re-visiting those screens
// reads from memory instead of re-querying Firestore each time.
export async function prefetchBackgroundContent(): Promise<void> {
  const [restaurantPhotosDocs, galleryDocs, eventsDocs, couponsDocs] = await Promise.all([
    fetchActiveDocs('restaurantPhotos'),
    fetchActiveDocs('gallery'),
    fetchActiveDocs('events'),
    fetchActiveDocs('coupons'),
  ]);
  if (restaurantPhotosDocs) contentCache.restaurantPhotos = restaurantPhotosDocs;
  if (galleryDocs) contentCache.gallery = galleryDocs;
  if (eventsDocs) contentCache.events = eventsDocs;
  if (couponsDocs) contentCache.coupons = couponsDocs;

  prefetchImages([restaurantPhotosDocs, galleryDocs, eventsDocs, couponsDocs]).catch(() => {});
}
