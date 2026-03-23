import { ScrollView, View, StyleSheet, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

import { Header } from '@/components/home/header';
import { HeroText } from '@/components/home/hero-text';
import { ActionButtons } from '@/components/home/action-buttons';
import { QuickAccess, QuickAccessItem } from '@/components/home/quick-access';
import { VenueCards, VenueCardItem } from '@/components/home/venue-cards';
import { CouponCarousel, CouponItem } from '@/components/home/coupon-carousel';
import { EventsCarousel } from '@/components/home/events-carousel';
import { HOTEL_EVENTS } from '@/constants/events-data';
import { useLanguage } from '@/hooks/use-language';
import { BrandColors } from '@/constants/theme';


export default function HomeScreen() {
  const { t } = useTranslation();
  const { activeLanguage, changeLanguage } = useLanguage();

  const quickAccessItems: QuickAccessItem[] = [
    { id: 'hotel', iconName: 'bed', label: t('home.quick_hotel'), onPress: () => router.push('/(tabs)/hotel') },
    { id: 'senator', iconName: 'restaurant', label: t('home.quick_senator'), onPress: () => router.push('/(tabs)/restaurants/senator') },
    { id: 'balkon', iconName: 'lunch-dining', label: t('home.quick_balkon'), onPress: () => router.push('/(tabs)/restaurants/balkon') },
    { id: 'spa', iconName: 'spa', label: t('home.quick_spa'), onPress: () => {} },
    { id: 'conference', iconName: 'present-to-all', label: t('home.quick_conference'), onPress: () => {} },
    { id: 'vip', iconName: 'handshake', label: t('home.quick_vip'), onPress: () => {} },
  ];

  const venueItems: VenueCardItem[] = [
    {
      id: 'hotel',
      imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      iconName: 'grid-view',
      title: t('home.cards_hotel'),
      reserveLabel: t('home.cards_reserve'),
      onPress: () => router.push('/(tabs)/hotel'),
    },
    {
      id: 'senator',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      iconName: 'restaurant',
      title: t('home.cards_senator'),
      reserveLabel: t('home.cards_reserve'),
      onPress: () => router.push('/(tabs)/restaurants/senator'),
    },
    {
      id: 'balkon',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      iconName: 'restaurant',
      title: t('home.cards_balkon'),
      reserveLabel: t('home.cards_reserve'),
      onPress: () => router.push('/(tabs)/restaurants/balkon'),
    },
  ];

  const senatorCoupons: CouponItem[] = [
    {
      id: 's1',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      categoryLabel: 'Ресторан',
      validUntil: 'до 28 фев',
      title: '-15% на бизнес-ланч',
      description: 'Действует по будням с 12:00 до 15:00. Купон доступен в разделе «Купоны»',
    },
    {
      id: 's2',
      imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      categoryLabel: 'Ресторан',
      validUntil: 'до 14 мар',
      title: '-20% на романтический ужин',
      description: 'Ужин на двоих при свечах с бокалом вина в подарок',
    },
    {
      id: 's3',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      categoryLabel: 'Ресторан',
      validUntil: 'до 31 мар',
      title: '-10% на завтрак',
      description: 'Скидка на завтрак с 8:00 до 11:00 для гостей отеля',
    },
    {
      id: 's4',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      categoryLabel: 'Ресторан',
      validUntil: 'до 31 дек',
      title: '-25% в день рождения',
      description: 'Специальная скидка в ваш особый день',
    },
  ];

  const balkonCoupons: CouponItem[] = [
    {
      id: 'b1',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      categoryLabel: 'Ресторан',
      validUntil: 'до 5.04',
      title: '-15% на ужин в ресторане',
      description: 'Действует по будня после 18:00. Купон доступен в разделе «Купоны»',
    },
    {
      id: 'b2',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      categoryLabel: 'Ресторан',
      validUntil: 'до 31 мар',
      title: '-30% Happy Hour',
      description: 'Скидка на все напитки с 17:00 до 19:00 каждый день',
    },
    {
      id: 'b3',
      imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800',
      categoryLabel: 'Ресторан',
      validUntil: 'до 30 апр',
      title: '-15% воскресный бранч',
      description: 'Бранч с живой музыкой каждое воскресенье с 11:00',
    },
    {
      id: 'b4',
      imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
      categoryLabel: 'Ресторан',
      validUntil: 'до 31 дек',
      title: '-20% для компании',
      description: 'Скидка при заказе столика для группы от 10 человек',
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
            primary={{ label: t('home.btn_contact'), onPress: () => {} }}
            secondary={{ label: t('home.btn_directions'), onPress: () => {} }}
          />
          <QuickAccess items={quickAccessItems} />
        </ImageBackground>

        {/* White content below */}
        <VenueCards items={venueItems} />
        <CouponCarousel
          sectionTitle={t('home.coupons_senator_title')}
          items={senatorCoupons}
        />
        <CouponCarousel
          sectionTitle={t('home.coupons_balkon_title')}
          items={balkonCoupons}
          topSpacing={30}
          cardBottomPadding={16}
        />
        <EventsCarousel
          sectionTitle={t('home.events_title')}
          items={HOTEL_EVENTS}
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
