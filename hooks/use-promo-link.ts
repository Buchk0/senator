import { router } from 'expo-router';
import { useContactActions } from '@/hooks/use-contact-actions';
import type { PromoLink } from '@/hooks/use-promo-banners';

/** Turns a banner's admin-chosen link into a press handler (undefined = not tappable). */
export function usePromoLink() {
  const { showContactAlert } = useContactActions();

  return (link: PromoLink, title: string): (() => void) | undefined => {
    switch (link) {
      case 'hotel':
        return () => router.push('/(tabs)/hotel');
      case 'senator':
        return () => router.push('/(tabs)/restaurants/senator');
      case 'balkon':
        return () => router.push('/(tabs)/restaurants/balkon');
      case 'contact':
        return () => showContactAlert(title);
      default:
        return undefined;
    }
  };
}
