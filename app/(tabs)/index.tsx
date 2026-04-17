import { ScrollView, View, StyleSheet, ImageBackground, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

import { Header } from '@/components/home/header';
import { HeroText } from '@/components/home/hero-text';
import { ActionButtons } from '@/components/home/action-buttons';
import { QuickAccess, QuickAccessItem } from '@/components/home/quick-access';
import { VenueCards, VenueCardItem } from '@/components/home/venue-cards';
import { CouponCarousel } from '@/components/home/coupon-carousel';
import { EventsCarousel } from '@/components/home/events-carousel';
import { useEvents } from '@/hooks/use-events';
import { useHomeCoupons } from '@/hooks/use-home-coupons';
import { useLanguage } from '@/hooks/use-language';
import { BrandColors } from '@/constants/theme';


export default function HomeScreen() {
  const { t } = useTranslation();
  const { activeLanguage, changeLanguage } = useLanguage();
  const { events } = useEvents();
  const { senatorCoupons, balkonCoupons } = useHomeCoupons();

  const quickAccessItems: QuickAccessItem[] = [
    { id: 'hotel', iconName: 'bed', label: t('home.quick_hotel'), onPress: () => router.push('/(tabs)/hotel') },
    { id: 'senator', iconName: 'restaurant', label: t('home.quick_senator'), onPress: () => router.push('/(tabs)/restaurants/senator') },
    { id: 'balkon', iconName: 'lunch-dining', label: t('home.quick_balkon'), onPress: () => router.push('/(tabs)/restaurants/balkon') },
    { id: 'spa', iconName: 'spa', label: t('home.quick_spa'), onPress: () => router.push('/(tabs)/spa') },
    { id: 'conference', iconName: 'present-to-all', label: t('home.quick_conference'), onPress: () => router.push('/(tabs)/conference') },
    { id: 'vip', iconName: 'handshake', label: t('home.quick_vip'), onPress: () => router.push('/(tabs)/vip') },
  ];

  const venueItems: VenueCardItem[] = [
    {
      id: 'hotel',
      image: require('@/assets/images/deluxe/deluxe-double/1.jpg'),
      imageStyle: { top: -30 },
      iconName: 'grid-view',
      title: t('home.cards_hotel'),
      reserveLabel: t('home.cards_reserve'),
      onPress: () => router.push('/(tabs)/hotel'),
    },
    {
      id: 'senator',
      image: require('@/assets/images/senator-bc.jpg'),
      iconName: 'restaurant',
      title: t('home.cards_senator'),
      reserveLabel: t('home.cards_reserve'),
      onPress: () => router.push('/(tabs)/restaurants/senator'),
    },
    {
      id: 'balkon',
      image: require('@/assets/images/grill-bc.jpg'),
      iconName: 'restaurant',
      title: t('home.cards_balkon'),
      reserveLabel: t('home.cards_reserve'),
      onPress: () => router.push('/(tabs)/restaurants/balkon'),
    },
  ];

  return (
    <View style={styles.background}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Dark hero section with restaurant image */}
        <ImageBackground
          source={require('@/assets/images/restaurants-bc.png')}
          style={styles.hero}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />
          <Header
            activeLanguage={activeLanguage}
            onLanguageChange={changeLanguage}
          />
          <HeroText
            title={t('home.hero_title')}
            subtitle={t('home.hero_subtitle')}
          />
          <ActionButtons
            primary={{ label: t('home.btn_contact'), onPress: () => Linking.openURL('tel:+7777777777') }}
            secondary={{ label: t('home.btn_directions'), onPress: () => Linking.openURL('https://maps.app.goo.gl/kRDshYUDDvmSryyX6?g_st=ic') }}
          />
          <QuickAccess items={quickAccessItems} />
        </ImageBackground>

        {/* White content below */}
        <VenueCards items={venueItems} />
        {senatorCoupons.length > 0 && (
          <CouponCarousel
            sectionTitle={t('home.coupons_senator_title')}
            items={senatorCoupons}
          />
        )}
        {balkonCoupons.length > 0 && (
          <CouponCarousel
            sectionTitle={t('home.coupons_balkon_title')}
            items={balkonCoupons}
            topSpacing={30}
            cardBottomPadding={16}
          />
        )}
        <EventsCarousel
          sectionTitle={t('home.events_title')}
          items={events}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: BrandColors.white,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {},
  hero: {
    width: '100%',
    paddingBottom: 80,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
});
