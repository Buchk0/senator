import { EventItem } from '@/components/home/events-carousel';

/**
 * Single source of truth for event cards.
 * Update here → updates automatically on every screen that shows these cards.
 */
export const HOTEL_EVENTS: [EventItem, EventItem] = [
  {
    id: 'e1',
    imageUrl: require('@/assets/images/fire.jpg'),
    subtitle: 'Тематический вечер в ресторане Senator',
    title: "Chef's special",
  },
  {
    id: 'e2',
    imageUrl: require('@/assets/images/fire.jpg'),
    subtitle: 'Живая музыка в Ресторане Balkon',
    title: 'Jazz evening',
  },
];
