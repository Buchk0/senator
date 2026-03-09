import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BrandColors } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const RESTAURANTS = [
  {
    key: 'senator',
    label: 'Senator',
    icon: 'restaurant' as const,
    dark: false,
    route: '/restaurants/senator',
  },
  {
    key: 'balkon',
    label: 'Gastro Grill Balkon',
    icon: 'outdoor-grill' as const,
    dark: true,
    route: '/restaurants/balkon',
  },
];

export default function RestaurantsTab() {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require('@/assets/images/restaurants-bc.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      {/* Logo */}
      <View style={[styles.logoWrap, { top: insets.top + 16 }]}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Text + buttons */}
      <View style={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <Text style={styles.title}>Выберите ресторан</Text>
        <Text style={styles.subtitle}>Меню, события, контакты</Text>

        <View style={styles.buttons}>
          {RESTAURANTS.map((r) => (
            <TouchableOpacity
              key={r.key}
              activeOpacity={0.85}
              onPress={() => router.push(r.route as any)}
              style={styles.btnOuter}
            >
              {r.dark ? (
                <View style={[styles.btn, styles.btnDark]}>
                  <MaterialIcons name={r.icon} size={26} color={BrandColors.white} />
                  <Text style={[styles.btnText, styles.btnTextDark]}>{r.label}</Text>
                  <View style={styles.chevronCircle}>
                    <MaterialIcons name="chevron-right" size={22} color={BrandColors.white} />
                  </View>
                </View>
              ) : (
                <View style={styles.btn}>
                  <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                  <MaterialIcons name={r.icon} size={26} color={BrandColors.white} />
                  <Text style={styles.btnText}>{r.label}</Text>
                  <View style={[styles.chevronCircle, styles.chevronCircleLight]}>
                    <MaterialIcons name="chevron-right" size={22} color={BrandColors.white} />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.52)',
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
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 140,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: BrandColors.white,
    marginBottom: 6,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 48,
    letterSpacing: 0.3,
  },
  buttons: {
    gap: 14,
  },
  btnOuter: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  btn: {
    height: 60,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: BrandColors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    overflow: 'hidden',
    gap: 12,
  },
  btnDark: {
    backgroundColor: '#1a2035',
    borderColor: BrandColors.gold,
  },
  btnText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.white,
  },
  btnTextDark: {
    color: BrandColors.white,
  },
  chevronCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: BrandColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronCircleLight: {
    borderColor: BrandColors.white,
  },
});
