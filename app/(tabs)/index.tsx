import { ScrollView, View, StyleSheet, ImageBackground, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

import { Header } from '@/components/home/header';
import { HeroText } from '@/components/home/hero-text';
import { ActionButtons } from '@/components/home/action-buttons';
import { QuickAccess, QuickAccessItem } from '@/components/home/quick-access';
import { useLanguage } from '@/hooks/use-language';
import { BrandColors } from '@/constants/theme';


export default function HomeScreen() {
  const { t } = useTranslation();
  const { activeLanguage, changeLanguage } = useLanguage();

  const quickAccessItems: QuickAccessItem[] = [
    { id: 'hotel', iconName: 'bed', label: t('home.quick_hotel'), onPress: () => router.push('/(tabs)/hotel') },
    { id: 'senator', iconName: 'restaurant', label: t('home.quick_senator'), onPress: () => router.push('/(tabs)/restaurants/senator') },
    { id: 'balkon', iconName: 'lunch-dining', label: t('home.quick_balkon'), onPress: () => router.push('/(tabs)/restaurants/balkon') },
    { id: 'spa', iconName: 'spa', label: t('home.quick_spa'), onPress: () => router.push('/(tabs)/spa') },
    { id: 'conference', iconName: 'present-to-all', label: t('home.quick_conference'), onPress: () => router.push('/(tabs)/conference') },
    { id: 'vip', iconName: 'handshake', label: t('home.quick_vip'), onPress: () => router.push('/(tabs)/vip') },
    { id: 'promotions', iconName: 'local-offer', label: t('home.quick_promotions'), onPress: () => router.push('/promotions') },
    { id: 'events', iconName: 'event', label: t('home.quick_events'), onPress: () => router.push('/events') },
    { id: 'photos', iconName: 'photo-library', label: t('home.quick_photos'), onPress: () => router.push('/photos') },
  ];

  return (
    <View style={styles.background}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
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
