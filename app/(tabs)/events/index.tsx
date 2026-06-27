import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BrandColors } from '@/constants/theme';
import { EventsCarousel } from '@/components/home/events-carousel';
import { useEvents } from '@/hooks/use-events';
import { BackButton } from '@/components/navigation/back-button';

export default function EventsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { events } = useEvents();

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={require('@/assets/images/grill-bc.jpg')}
          style={styles.hero}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />
          <View style={[styles.logoWrap, { top: insets.top + 16 }]}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{t('events.title')}</Text>
            <Text style={styles.heroSub}>{t('events.subtitle')}</Text>
          </View>
        </ImageBackground>

        {events.length > 0 ? (
          <EventsCarousel items={events} />
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>{t('events.empty')}</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <BackButton tint="dark" />
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
    paddingBottom: 28,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  logoWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo: {
    width: 72,
    height: 40,
  },
  heroContent: {
    paddingHorizontal: 24,
    paddingTop: 120,
    alignItems: 'center',
  },
  heroTitle: {
    color: BrandColors.white,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyWrap: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(0,0,0,0.45)',
    fontSize: 15,
  },
});
