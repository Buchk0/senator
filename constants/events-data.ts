import { EventItem } from '@/components/home/events-carousel';

/**
 * Single source of truth for event cards.
 * Update here → updates automatically on every screen that shows these cards.
 */
export const HOTEL_EVENTS: [EventItem, EventItem] = [
  {
    id: 'e1',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    subtitle: 'Тематический вечер в ресторане Senator',
    title: "Chef's special",
  },
  {
    id: 'e2',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    subtitle: 'Живая музыка в Ресторане Balkon',
    title: 'Jazz evening',
  },
];
