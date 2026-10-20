import { View, Text, Image, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BrandColors } from '@/constants/theme';
import { BackButton } from '@/components/navigation/back-button';
import { isVenue } from '@/components/venue-picker';
import { PromoBanners } from '@/components/restaurants/promo-banners';
import { HotelPromotions } from '@/components/hotel/hotel-promotions';

export default function VenuePromotionsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { venue: venueParam } = useLocalSearchParams<{ venue: string }>();
  const venue = isVenue(venueParam) ? venueParam : 'senator';

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={require('@/assets/images/senator-bc.jpg')}
          style={[styles.hero, { paddingTop: insets.top + 140 }]}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />
          <View style={[styles.logoWrap, { top: insets.top + 12 }]}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.heroTitle}>{t('promotions.title_full')}</Text>
          <Text style={styles.heroSub}>{t('promotions.subtitle')}</Text>
        </ImageBackground>

        <View style={styles.body}>
          {venue === 'hotel' ? (
            <View style={styles.hotelWrap}>
              <HotelPromotions />
            </View>
          ) : (
            <PromoBanners restaurant={venue} />
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <BackButton tint="dark" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.white,
  },
  hero: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  logoWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 36,
  },
  heroTitle: {
    color: BrandColors.white,
    fontSize: 28,
    fontWeight: '700',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 4,
  },
  body: {
    paddingTop: 10,
  },
  hotelWrap: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
