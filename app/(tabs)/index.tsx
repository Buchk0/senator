import { ScrollView, View, StyleSheet, ImageBackground, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

import { Header } from '@/components/home/header';
import { HeroText } from '@/components/home/hero-text';
import { ActionButtons } from '@/components/home/action-buttons';
import { QuickAccess, QuickAccessItem } from '@/components/home/quick-access';
import { useLanguage } from '@/hooks/use-language';
import { useContactActions } from '@/hooks/use-contact-actions';
import { BrandColors } from '@/constants/theme';


export default function HomeScreen() {
  const { t } = useTranslation();
  const { activeLanguage, changeLanguage } = useLanguage();
  const { showContactAlert } = useContactActions();

  const quickAccessItems: QuickAccessItem[] = [
    { id: 'hotel', iconSource: require('@/assets/images/home/icon-hotel.svg'), label: t('home.quick_hotel'), onPress: () => router.push('/(tabs)/hotel') },
    { id: 'senator', iconSource: require('@/assets/images/home/icon-senator.svg'), label: t('home.quick_senator'), onPress: () => router.push('/(tabs)/restaurants/senator') },
    { id: 'balkon', iconSource: require('@/assets/images/home/icon-balkon.svg'), label: t('home.quick_balkon'), onPress: () => router.push('/(tabs)/restaurants/balkon') },
    { id: 'spa', iconSource: require('@/assets/images/home/icon-spa.svg'), label: t('home.quick_spa'), onPress: () => router.push('/(tabs)/spa') },
    { id: 'conference', iconSource: require('@/assets/images/home/icon-conference.svg'), label: t('home.quick_conference'), onPress: () => router.push('/(tabs)/conference') },
    { id: 'vip', iconSource: require('@/assets/images/home/icon-vip.svg'), label: t('home.quick_vip'), onPress: () => router.push('/(tabs)/vip') },
  ];

  const wideItems: QuickAccessItem[] = [
    { id: 'promotions', iconSource: require('@/assets/images/home/icon-calendar.svg'), label: t('home.quick_promotions_events'), onPress: () => router.push('/promotions') },
    { id: 'photos', iconSource: require('@/assets/images/home/icon-photos.svg'), label: t('home.quick_photos'), onPress: () => router.push('/photos') },
  ];

  return (
    <View style={styles.background}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require('@/assets/images/home/background.jpg')}
          style={styles.hero}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />
          <Header
            activeLanguage={activeLanguage}
            onLanguageChange={changeLanguage}
            largeLogo
          />
          <HeroText
            title={t('home.hero_title')}
            subtitle={t('home.hero_subtitle')}
          />
          <ActionButtons
            primary={{ label: t('home.btn_contact'), onPress: () => showContactAlert(t('home.btn_contact')) }}
            secondary={{ label: t('home.btn_directions'), onPress: () => Linking.openURL('https://maps.app.goo.gl/kRDshYUDDvmSryyX6?g_st=ic') }}
          />
          <QuickAccess items={quickAccessItems} wideItems={wideItems} />
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
  contentContainer: {
    flexGrow: 1,
  },
  hero: {
    flexGrow: 1,
    width: '100%',
    paddingBottom: 80,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
});
