import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { db, auth } from '@/constants/firebase';
import { Coupon } from '@/constants/coupons-data';
import { CouponItem } from '@/components/home/coupon-carousel';

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

function toCouponItem(
  coupon: Coupon,
  index: number,
  photos: any[],
  lang: 'en' | 'ru' | 'kz',
  validUntilLabel: string,
  onPress: () => void,
): CouponItem {
  return {
    id: coupon.id,
    imageUrl: coupon.imageUrl ? { uri: coupon.imageUrl } : photos[index % photos.length],
    categoryLabel: coupon.restaurant === 'All' ? 'Senator & Balkon' : coupon.restaurant,
    validUntil: validUntilLabel,
    // Admin only requires the EN field — an untranslated RU/KZ entry is ''
    // (not nullish), so fall back to EN explicitly instead of showing blank.
    title: coupon.title[lang] || coupon.title.en,
    description: coupon.description[lang] || coupon.description.en,
    onPress,
  };
}

export function useHomeCoupons() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const lang = (i18n.language === 'kz' ? 'kz' : i18n.language === 'ru' ? 'ru' : 'en') as 'en' | 'ru' | 'kz';

  const [senatorCoupons, setSenatorCoupons] = useState<CouponItem[]>([]);
  const [balkonCoupons, setBalkonCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }

      setLoading(true);
      getDocs(query(collection(db, 'coupons'), where('active', '==', true)))
        .then((snap) => {
          if (cancelled) return;
          const all = snap.docs
            .map((d) => ({ id: d.id, ...d.data() } as Coupon))
            .filter((c) => !c.oneTime);

          const senator = all.filter((c) => c.restaurant === 'Senator' || c.restaurant === 'All');
          const balkon  = all.filter((c) => c.restaurant === 'Balkon');

          setSenatorCoupons(
            senator.map((c, i) =>
              toCouponItem(c, i, SENATOR_PHOTOS, lang, t(`coupons.expires_${c.type}`), () =>
                router.push('/(tabs)/restaurants/senator')
              )
            )
          );

          setBalkonCoupons(
            balkon.map((c, i) =>
              toCouponItem(c, i, BALKON_PHOTOS, lang, t(`coupons.expires_${c.type}`), () =>
                router.push('/(tabs)/restaurants/balkon')
              )
            )
          );
        })
        .catch(console.error)
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [lang]);

  return { senatorCoupons, balkonCoupons, loading };
}
