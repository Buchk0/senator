import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { BrandColors } from '@/constants/theme';

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

export interface PromoBannersProps {
  restaurant: 'senator' | 'balkon';
}

export function PromoBanners({ restaurant }: PromoBannersProps) {
  const { t } = useTranslation();
  const isBalkon = restaurant === 'balkon';
  const keyPrefix = isBalkon ? 'restaurants.balkon_promos' : 'restaurants.promos';

  return (
    <View style={styles.list}>
      {PROMOS[restaurant].map((promo) => {
        const title = <Text style={styles.title}>{t(`${keyPrefix}.${promo.id}_title` as any)}</Text>;
        const description = promo.hasDescription ? (
          <Text style={styles.description}>{t(`${keyPrefix}.${promo.id}_desc` as any)}</Text>
        ) : null;
        const badgeText = <Text style={styles.badgeText}>{t(`${keyPrefix}.${promo.id}_badge` as any)}</Text>;

        return (
          <View key={promo.id} style={[styles.card, !isBalkon && styles.cardBordered]}>
            <Image source={promo.image} style={StyleSheet.absoluteFill} contentFit="cover" />
            {promo.tint && <View style={[styles.tint, { backgroundColor: promo.tint }]} />}

            {isBalkon ? (
              <>
                <View style={[styles.content, styles.contentBalkon]}>
                  {title}
                  {description}
                </View>
                <View style={styles.cornerBadge}>{badgeText}</View>
              </>
            ) : (
              <View style={styles.content}>
                {title}
                <View style={styles.badge}>{badgeText}</View>
                {description}
              </View>
            )}
          </View>
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
