import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image, ImageSource } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { BrandColors } from '@/constants/theme';
import { usePromoBanners } from '@/hooks/use-promo-banners';
import { usePromoLink } from '@/hooks/use-promo-link';

interface HotelPromoCardProps {
  image: ImageSource | number;
  badge: string;
  period: string;
  title: string;
  description: string;
  onPress?: () => void;
}

function HotelPromoCard({ image, badge, period, title, description, onPress }: HotelPromoCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress} disabled={!onPress}>
      <View style={styles.imageWrap}>
        <Image source={image} style={StyleSheet.absoluteFillObject} contentFit="cover" transition={200} cachePolicy="memory-disk" />
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : (
          <View />
        )}
        {!!period && <Text style={styles.period}>{period}</Text>}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.footer}>
        <Text style={styles.description}>{description}</Text>
        {onPress && (
          <TouchableOpacity style={styles.chevron} activeOpacity={0.7} onPress={onPress}>
            <MaterialIcons name="chevron-right" size={22} color={BrandColors.black} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function HotelPromotions() {
  const { t } = useTranslation();
  const { banners, loading } = usePromoBanners('hotel');
  const linkHandler = usePromoLink();

  // Avoid flashing the built-in card while the admin's ones are loading
  if (loading) return null;

  // Built-in card only until hotel banners exist in the admin panel
  if (!banners) {
    return (
      <HotelPromoCard
        image={require('@/assets/images/hotel/promo-romance.png')}
        badge={t('hotel.promo_romance.badge')}
        period={t('hotel.promo_romance.period')}
        title={t('hotel.promo_romance.title')}
        description={t('hotel.promo_romance.description')}
        onPress={() => router.push('/(tabs)/restaurants/senator')}
      />
    );
  }

  return (
    <View style={styles.list}>
      {banners.map((b) => (
        <HotelPromoCard
          key={b.id}
          image={{ uri: b.imageUrl }}
          badge={b.badge}
          period={b.period}
          title={b.title}
          description={b.description}
          onPress={linkHandler(b.link, b.title)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 20,
  },
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: 12,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  imageWrap: {
    height: 136,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3e4cf',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: BrandColors.black,
  },
  period: {
    fontSize: 10,
    fontWeight: '500',
    color: BrandColors.white,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 4,
  },
  title: {
    marginTop: 16,
    paddingHorizontal: 6,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '600',
    color: BrandColors.gold,
    textTransform: 'uppercase',
  },
  footer: {
    marginTop: 10,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  description: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(0,0,0,0.75)',
  },
  chevron: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: BrandColors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
