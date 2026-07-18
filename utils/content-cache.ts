export interface RawDoc {
  id: string;
  data: Record<string, any>;
}

// Populated at splash/startup time by prefetchCriticalContent() and
// prefetchBackgroundContent(), and read synchronously by the matching hooks
// so re-visiting a screen never re-hits Firestore over the network. Each
// hook falls back to its own network query when the relevant cache entry
// hasn't been populated yet (e.g. background fetch still in flight).
export const contentCache: {
  menu: RawDoc[] | null;
  spaServices: RawDoc[] | null;
  restaurantPhotos: RawDoc[] | null;
  gallery: RawDoc[] | null;
  events: RawDoc[] | null;
  coupons: RawDoc[] | null;
} = {
  menu: null,
  spaServices: null,
  restaurantPhotos: null,
  gallery: null,
  events: null,
  coupons: null,
};
