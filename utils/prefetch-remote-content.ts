import { Image } from 'expo-image';
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

// Inactive docs included: a venue with banners that are all switched off
// must show none, not fall back to the built-in ones (see usePromoBanners).
async function fetchAllDocs(collectionName: string): Promise<RawDoc[] | null> {
  try {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((d) => ({ id: d.id, data: d.data() }));
  } catch {
    return null;
  }
}

function imageUrls(docs: RawDoc[] | null): string[] {
  return (docs ?? [])
    .filter(({ data }) => data.active !== false)
    .map(({ data }) => data.imageUrl)
    .filter((url): url is string => typeof url === 'string' && url.length > 0);
}

// Into expo-image's cache — the same one every remote <Image> in the app
// reads from (react-native's Image.prefetch fills a different cache, so the
// screens re-downloaded everything on first open). memory-disk: instant this
// session, and still on disk on the next launch. One URL per call, because
// expo-image resolves a multi-URL prefetch as soon as any single one fails.
function prefetchImages(urls: string[]): Promise<unknown> {
  return Promise.allSettled([...new Set(urls)].map((url) => Image.prefetch(url, 'memory-disk')));
}

// Stage 1, while the splash is up: what the first screens show right away.
// Menu and spa photos open straight from the home screen, and the promo
// banners sit on the Promotions screens and restaurant Events tabs. The docs
// are cached too, so their hooks read synchronously instead of re-querying
// Firestore every time a screen mounts.
export async function prefetchCriticalContent(): Promise<void> {
  const [menuDocs, spaDocs, bannerDocs] = await Promise.all([
    fetchActiveDocs('menu'),
    fetchActiveDocs('spa_services'),
    fetchAllDocs('promoBanners'),
  ]);
  if (menuDocs) contentCache.menu = menuDocs;
  if (spaDocs) contentCache.spaServices = spaDocs;
  if (bannerDocs) contentCache.promoBanners = bannerDocs;

  await prefetchImages([...imageUrls(menuDocs), ...imageUrls(spaDocs), ...imageUrls(bannerDocs)]);
}

// Stage 2, after the splash: everything else keeps loading in the background.
// All docs are fetched at once (small), then images go one group at a time in
// the order guests usually open screens, so the likeliest ones are ready first
// instead of everything competing for the network at once.
export async function prefetchBackgroundContent(): Promise<void> {
  const [restaurantPhotosDocs, conferenceDocs, galleryDocs, eventsDocs, couponsDocs, promotionsDocs] =
    await Promise.all([
      fetchActiveDocs('restaurantPhotos'),
      fetchActiveDocs('conferenceMenus'),
      fetchActiveDocs('gallery'),
      fetchActiveDocs('events'),
      fetchActiveDocs('coupons'),
      fetchActiveDocs('promotions'),
    ]);
  if (restaurantPhotosDocs) contentCache.restaurantPhotos = restaurantPhotosDocs;
  if (conferenceDocs) contentCache.conferenceMenus = conferenceDocs;
  if (galleryDocs) contentCache.gallery = galleryDocs;
  if (eventsDocs) contentCache.events = eventsDocs;
  if (couponsDocs) contentCache.coupons = couponsDocs;
  if (promotionsDocs) contentCache.promotions = promotionsDocs;

  const groups = [
    imageUrls(restaurantPhotosDocs),
    imageUrls(conferenceDocs),
    imageUrls(galleryDocs),
    [...imageUrls(eventsDocs), ...imageUrls(couponsDocs), ...imageUrls(promotionsDocs)],
  ];
  for (const urls of groups) {
    await prefetchImages(urls);
  }
}
