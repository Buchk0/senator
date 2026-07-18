import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { db } from '@/constants/firebase';
import { CouponItem } from '@/components/home/coupon-carousel';
import { contentCache, RawDoc } from '@/utils/content-cache';

export type Promotion = {
  id: string;
  type: 'seasonal' | 'always';
  emoji: string;
  restaurant: 'All' | 'Senator' | 'Balkon';
  active: boolean;
  imageUrl?: string;
  title: { en: string; ru: string; kz: string };
  description: { en: string; ru: string; kz: string };
};

const SENATOR_PHOTOS = [
  require('@/assets/images/senator-photo-1.jpg'),
  require('@/assets/images/senator-photo-2.jpg'),
  require('@/assets/images/senator-photo-3.jpg'),
  require('@/assets/images/senator-photo-4.jpg'),
];

const BALKON_PHOTOS = [
  require('@/assets/images/grill-photo-1.jpg'),
  require('@/assets/images/grill-photo-2.jpg'),
  require('@/assets/images/grill-photo-3.jpg'),
  require('@/assets/images/grill-photo-4.jpg'),
];

function toPromotions(docs: RawDoc[]): Promotion[] {
  return docs.map((d) => ({ id: d.id, ...d.data } as Promotion));
}

function toCouponItem(
  promotion: Promotion,
  index: number,
  photos: any[],
  lang: 'en' | 'ru' | 'kz',
  validUntilLabel: string,
  onPress: () => void,
): CouponItem {
  return {
    id: promotion.id,
    imageUrl: promotion.imageUrl ? { uri: promotion.imageUrl } : photos[index % photos.length],
    categoryLabel: promotion.restaurant === 'All' ? 'Senator & Balkon' : promotion.restaurant,
    validUntil: validUntilLabel,
    title: promotion.title[lang] || promotion.title.en,
    description: promotion.description[lang] || promotion.description.en,
    onPress,
  };
}

// Public content — readable without login (unlike the interactive coupons
// screen), so this hook never gates on auth.
export function usePromotions() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const lang = (i18n.language === 'kz' ? 'kz' : i18n.language === 'ru' ? 'ru' : 'en') as 'en' | 'ru' | 'kz';

  const [senatorPromotions, setSenatorPromotions] = useState<CouponItem[]>([]);
  const [balkonPromotions, setBalkonPromotions] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const applyPromotions = (all: Promotion[]) => {
      const senator = all.filter((p) => p.restaurant === 'Senator' || p.restaurant === 'All');
      const balkon  = all.filter((p) => p.restaurant === 'Balkon');

      setSenatorPromotions(
        senator.map((p, i) =>
          toCouponItem(p, i, SENATOR_PHOTOS, lang, t(`coupons.expires_${p.type}`), () =>
            router.push('/(tabs)/restaurants/senator')
          )
        )
      );

      setBalkonPromotions(
        balkon.map((p, i) =>
          toCouponItem(p, i, BALKON_PHOTOS, lang, t(`coupons.expires_${p.type}`), () =>
            router.push('/(tabs)/restaurants/balkon')
          )
        )
      );
    };

    // Already fetched in the background at app startup — read from that
    // cache instead of re-querying Firestore on every mount.
    if (contentCache.promotions) {
      applyPromotions(toPromotions(contentCache.promotions));
      setLoading(false);
      return;
    }

    setLoading(true);
    getDocs(query(collection(db, 'promotions'), where('active', '==', true)))
      .then((snap) => {
        if (cancelled) return;
        applyPromotions(toPromotions(snap.docs.map((d) => ({ id: d.id, data: d.data() }))));
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { senatorPromotions, balkonPromotions, loading };
}
