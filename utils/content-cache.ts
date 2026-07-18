export interface RawDoc {
  id: string;
  data: Record<string, any>;
}

// Populated once at splash time by prefetchCriticalContent() and read
// synchronously by useMenu/useSpaServices so switching between screens
// (e.g. Senator <-> Balkon) never re-hits Firestore over the network.
export const contentCache: {
  menu: RawDoc[] | null;
  spaServices: RawDoc[] | null;
} = {
  menu: null,
  spaServices: null,
};
