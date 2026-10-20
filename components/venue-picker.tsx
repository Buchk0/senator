import { View, Text, Image, Pressable, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { BlurView } from 'expo-blur';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BrandColors } from '@/constants/theme';
import { BackButton } from '@/components/navigation/back-button';

export type Venue = 'senator' | 'balkon' | 'hotel';

const VENUE_ICONS: Record<Venue, number> = {
  senator: require('@/assets/images/home/icon-senator.svg'),
  balkon: require('@/assets/images/home/icon-balkon.svg'),
  hotel: require('@/assets/images/home/icon-hotel.svg'),
};

export function isVenue(value: unknown): value is Venue {
  return value === 'senator' || value === 'balkon' || value === 'hotel';
}

const VENUE_DARK_BG = '#1e2340';

export interface VenuePickerProps {
  title: string;
  subtitle: string;
  venues: Venue[];
  onSelect: (venue: Venue) => void;
}

/** Full-screen venue list shown before the promotions / photo report content. */
export function VenuePicker({ title, subtitle, venues, onSelect }: VenuePickerProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <ImageBackground
      source={require('@/assets/images/home/background.jpg')}
      style={styles.root}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={[styles.logoWrap, { top: insets.top + 12 }]}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.list}>
          {venues.map((venue) => (
            <Pressable
              key={venue}
              onPress={() => onSelect(venue)}
              style={({ pressed }) => [styles.item, (pressed || venue === 'balkon') && styles.itemDark]}
            >
              {({ pressed }) => (
                <>
                  {/* Balkon is always on its dark-blue brand background */}
                  {!pressed && venue !== 'balkon' && (
                    <BlurView
                      intensity={60}
                      tint="dark"
                      // Without this Android only draws a flat tint, no real blur
                      experimentalBlurMethod="dimezisBlurView"
                      style={StyleSheet.absoluteFillObject}
                    />
                  )}
                  <ExpoImage source={VENUE_ICONS[venue]} style={styles.icon} contentFit="contain" />
                  <Text style={styles.label} numberOfLines={1}>
                    {t(`venues.${venue}` as any)}
                  </Text>
                  <View style={styles.chevron}>
                    <MaterialIcons name="chevron-right" size={18} color={BrandColors.white} />
                  </View>
                </>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BackButton tint="dark" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  logoWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  logo: {
    width: 64,
    height: 36,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  title: {
    color: BrandColors.white,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 6,
  },
  list: {
    marginTop: 40,
    paddingHorizontal: 8,
    gap: 14,
  },
  item: {
    height: 58,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: BrandColors.gold,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 10,
    gap: 12,
  },
  itemDark: {
    backgroundColor: VENUE_DARK_BG,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    flex: 1,
    color: BrandColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  chevron: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
