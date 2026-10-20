import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { BrandColors } from '@/constants/theme';
import { usePromoBanners } from '@/hooks/use-promo-banners';
import { usePromoLink } from '@/hooks/use-promo-link';

interface Promo {
  id: string;
  image: number;
  /** Tint over the photo so white text stays legible; omit for dark photos */
  tint?: string;
  hasDescription: boolean;
}

const SENATOR_TINT = 'rgba(96, 80, 70, 0.38)';
const BALKON_TINT = 'rgba(105, 100, 100, 0.5)';
const BALKON_BADGE = '#6b1d22';

const PROMOS: Record<'senator' | 'balkon', Promo[]> = {
  senator: [
    { id: 'birthday', image: require('@/assets/images/restaurants/promo-birthday.png'), tint: SENATOR_TINT, hasDescription: true },
    { id: 'breakfast', image: require('@/assets/images/restaurants/promo-breakfast.png'), tint: SENATOR_TINT, hasDescription: true },
  ],
  balkon: [
    { id: 'cocktail', image: require('@/assets/images/restaurants/balkon/promo-cocktail.png'), tint: BALKON_TINT, hasDescription: false },
    { id: 'happy_hours', image: require('@/assets/images/restaurants/balkon/promo-happy-hours.png'), hasDescription: true },
    { id: 'birthday', image: require('@/assets/images/restaurants/balkon/promo-birthday.png'), tint: BALKON_TINT, hasDescription: true },
  ],
};

/** What a banner card renders, whether it came from Firestore or is built in */
interface BannerItem {
  id: string;
  image: ImageSource | number;
  title: string;
  badge: string;
  description: string;
  tint?: string;
  onPress?: () => void;
}

export interface PromoBannersProps {
  restaurant: 'senator' | 'balkon';
}

export function PromoBanners({ restaurant }: PromoBannersProps) {
  const { t } = useTranslation();
  const { banners, loading } = usePromoBanners(restaurant);
  const linkHandler = usePromoLink();
  const isBalkon = restaurant === 'balkon';
  const keyPrefix = isBalkon ? 'restaurants.balkon_promos' : 'restaurants.promos';
  const tint = isBalkon ? BALKON_TINT : SENATOR_TINT;

  // Avoid flashing the built-in banners while the admin's ones are loading
  if (loading) return null;

  // Banners from the admin panel; the built-in set only until the venue has any
  const items: BannerItem[] = banners
    ? banners.map((b) => ({
        id: b.id,
        image: { uri: b.imageUrl },
        title: b.title,
        badge: b.badge,
        description: b.description,
        tint: b.darken ? tint : undefined,
        onPress: linkHandler(b.link, b.title),
      }))
    : PROMOS[restaurant].map((promo) => ({
        id: promo.id,
        image: promo.image,
        title: t(`${keyPrefix}.${promo.id}_title` as any),
        badge: t(`${keyPrefix}.${promo.id}_badge` as any),
        description: promo.hasDescription ? t(`${keyPrefix}.${promo.id}_desc` as any) : '',
        tint: promo.tint,
      }));

  return (
    <View style={styles.list}>
      {items.map((item) => {
        const title = <Text style={styles.title}>{item.title}</Text>;
        const description = item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null;
        const badge = item.badge ? <Text style={styles.badgeText}>{item.badge}</Text> : null;

        return (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            disabled={!item.onPress}
            style={({ pressed }) => [styles.card, !isBalkon && styles.cardBordered, pressed && styles.cardPressed]}
          >
            <Image source={item.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} cachePolicy="memory-disk" />
            {item.tint && <View style={[styles.tint, { backgroundColor: item.tint }]} />}

            {isBalkon ? (
              <>
                <View style={[styles.content, styles.contentBalkon]}>
                  {title}
                  {description}
                </View>
                {badge && <View style={styles.cornerBadge}>{badge}</View>}
              </>
            ) : (
              <View style={styles.content}>
                {title}
                {badge && <View style={styles.badge}>{badge}</View>}
                {description}
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },
  card: {
    aspectRatio: 359 / 125,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardBordered: {
    borderWidth: 1,
    borderColor: BrandColors.gold,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingHorizontal: 14,
    alignItems: 'flex-start',
  },
  contentBalkon: {
    // leave room for the badge pinned to the bottom-left corner
    paddingBottom: 22,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.white,
    lineHeight: 26,
  },
  badge: {
    backgroundColor: BrandColors.gold,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 8,
    marginBottom: 3,
  },
  cornerBadge: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: BALKON_BADGE,
    borderTopRightRadius: 12,
    paddingLeft: 14,
    paddingRight: 16,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: BrandColors.white,
  },
  description: {
    fontSize: 9,
    fontWeight: '400',
    color: BrandColors.white,
    marginTop: 2,
  },
});
