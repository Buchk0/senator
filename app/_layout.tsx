import '@/i18n';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import AuthProvider, { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Asset } from 'expo-asset';
import { BrandColors } from '@/constants/theme';
import { prefetchCriticalContent, prefetchBackgroundContent } from '@/utils/prefetch-remote-content';

// ─── All local images to preload ─────────────────────────────────────────────

const LOCAL_IMAGES = [
  // Core
  require('@/assets/images/restaurants-bc.jpg'),
  require('@/assets/images/logo.png'),
  require('@/assets/images/fire.jpg'),

  // Home screen and navbar — visible the moment the splash closes
  require('@/assets/images/home/background.jpg'),
  require('@/assets/images/home/icon-hotel.svg'),
  require('@/assets/images/home/icon-senator.svg'),
  require('@/assets/images/home/icon-balkon.svg'),
  require('@/assets/images/home/icon-spa.svg'),
  require('@/assets/images/home/icon-conference.svg'),
  require('@/assets/images/home/icon-vip.svg'),
  require('@/assets/images/home/icon-calendar.svg'),
  require('@/assets/images/home/icon-photos.svg'),
  require('@/assets/images/navbar/nav-home-black.svg'),
  require('@/assets/images/navbar/nav-home-white.svg'),
  require('@/assets/images/navbar/nav-hotel-black.svg'),
  require('@/assets/images/navbar/nav-hotel-white.svg'),
  require('@/assets/images/navbar/nav-senator-black.svg'),
  require('@/assets/images/navbar/nav-senator-white.svg'),
  require('@/assets/images/navbar/nav-balkon-black.svg'),
  require('@/assets/images/navbar/nav-balkon-white.svg'),
  require('@/assets/images/navbar/nav-profile-black.svg'),
  require('@/assets/images/navbar/nav-profile-white.svg'),

  // Promo banners (built-in fallbacks) and hotel promotion
  require('@/assets/images/restaurants/promo-birthday.png'),
  require('@/assets/images/restaurants/promo-breakfast.png'),
  require('@/assets/images/restaurants/balkon/promo-cocktail.png'),
  require('@/assets/images/restaurants/balkon/promo-happy-hours.png'),
  require('@/assets/images/restaurants/balkon/promo-birthday.png'),
  require('@/assets/images/hotel/promo-romance.png'),

  // Senator restaurant
  require('@/assets/images/senator-bc.jpg'),
  require('@/assets/images/senator-photo-1.jpg'),
  require('@/assets/images/senator-photo-2.jpg'),
  require('@/assets/images/senator-photo-3.jpg'),
  require('@/assets/images/senator-photo-4.jpg'),
  require('@/assets/images/senator-photo-5.jpeg'),
  require('@/assets/images/senator-int-1.jpg'),
  require('@/assets/images/senator-int-2.jpg'),
  require('@/assets/images/senator-int-3.jpg'),

  // Balkon restaurant
  require('@/assets/images/grill-bc.jpg'),
  require('@/assets/images/grill-photo-1.jpg'),
  require('@/assets/images/grill-photo-2.jpg'),
  require('@/assets/images/grill-photo-3.jpg'),
  require('@/assets/images/grill-photo-4.jpg'),
  require('@/assets/images/grill-photo-5.jpg'),

  // Menus
  require('@/assets/images/menu/senator/1.png'),
  require('@/assets/images/menu/senator/2.png'),
  require('@/assets/images/menu/senator/3.png'),
  require('@/assets/images/menu/senator/4.png'),
  require('@/assets/images/menu/senator/5.png'),
  require('@/assets/images/menu/senator/6.png'),
  require('@/assets/images/menu/senator/7.png'),
  require('@/assets/images/menu/senator/8.png'),
  require('@/assets/images/menu/balkon/1.png'),
  require('@/assets/images/menu/balkon/2.png'),
  require('@/assets/images/menu/balkon/3.png'),
  require('@/assets/images/menu/balkon/4.png'),
  require('@/assets/images/menu/balkon/5.png'),
  require('@/assets/images/menu/balkon/6.png'),

  // Conference
  require('@/assets/images/conference/conference-bc.jpg'),
  require('@/assets/images/conference/conference-photo-1.jpg'),
  require('@/assets/images/conference/conference-photo-2.jpg'),

  // VIP
  require('@/assets/images/vip/vip-bc.jpg'),
  require('@/assets/images/vip/vip-photo-1.jpg'),
  require('@/assets/images/vip/vip-photo-2.jpg'),
  require('@/assets/images/vip/vip-photo-3.jpg'),

  // Spa
  require('@/assets/images/spa/spa-hero.jpg'),
  require('@/assets/images/spa/card-img.jpg'),
  require('@/assets/images/spa/spa-treatment-2.jpg'),
  require('@/assets/images/spa/spa-photo-1.jpg'),
  require('@/assets/images/spa/spa-photo-2.jpg'),
  require('@/assets/images/spa/spa-photo-3.jpg'),
  require('@/assets/images/spa/spa-photo-4.jpg'),
  require('@/assets/images/spa/spa-photo-5.jpg'),
  require('@/assets/images/spa/spa-photo-6.jpg'),

  // Standard rooms
  require('@/assets/images/standart/standart-single/1.jpg'),
  require('@/assets/images/standart/standart-single/2.jpg'),
  require('@/assets/images/standart/standart-single/3.jpg'),
  require('@/assets/images/standart/standart-double/1.jpg'),
  require('@/assets/images/standart/standart-double/2.jpg'),
  require('@/assets/images/standart/standart-double/3.jpg'),
  require('@/assets/images/standart/standart-double/4.jpg'),
  require('@/assets/images/standart/standart-twin-one/1.jpg'),
  require('@/assets/images/standart/standart-twin-one/2.jpg'),
  require('@/assets/images/standart/standart-twin-one/3.jpg'),
  require('@/assets/images/standart/standart-twin-one/4.jpg'),
  require('@/assets/images/standart/standart-twin-two/1.jpg'),
  require('@/assets/images/standart/standart-twin-two/2.jpg'),
  require('@/assets/images/standart/standart-twin-two/3.jpg'),
  require('@/assets/images/standart/standart-twin-two/4.jpg'),

  // Deluxe rooms
  require('@/assets/images/deluxe/deluxe-single/1.jpg'),
  require('@/assets/images/deluxe/deluxe-single/2.jpg'),
  require('@/assets/images/deluxe/deluxe-single/3.jpg'),
  require('@/assets/images/deluxe/deluxe-double/1.jpg'),
  require('@/assets/images/deluxe/deluxe-double/2.jpg'),
  require('@/assets/images/deluxe/deluxe-double/3.jpg'),
  require('@/assets/images/deluxe/deluxe-double/4.jpg'),
  require('@/assets/images/deluxe/deluxe-twin-one/1.jpg'),
  require('@/assets/images/deluxe/deluxe-twin-one/2.jpg'),
  require('@/assets/images/deluxe/deluxe-twin-one/3.jpg'),
  require('@/assets/images/deluxe/deluxe-twin-one/4.jpg'),
  require('@/assets/images/deluxe/deluxe-twin-two/1.jpg'),
  require('@/assets/images/deluxe/deluxe-twin-two/2.jpg'),
  require('@/assets/images/deluxe/deluxe-twin-two/3.jpg'),
  require('@/assets/images/deluxe/deluxe-twin-two/4.jpg'),
  require('@/assets/images/deluxe/premium-deluxe/1.jpg'),
  require('@/assets/images/deluxe/premium-deluxe/2.jpg'),
  require('@/assets/images/deluxe/premium-deluxe/3.jpg'),
  require('@/assets/images/deluxe/premium-deluxe/4.jpg'),

  // Suite rooms
  require('@/assets/images/suite/executive/1.jpg'),
  require('@/assets/images/suite/executive/2.jpg'),
  require('@/assets/images/suite/executive/3.jpg'),
  require('@/assets/images/suite/executive/4.jpg'),
  require('@/assets/images/suite/presidential/1.jpg'),
  require('@/assets/images/suite/presidential/2.jpg'),
  require('@/assets/images/suite/presidential/3.jpg'),
  require('@/assets/images/suite/presidential/4.jpg'),
];

// ─── Splash / loading screen ──────────────────────────────────────────────────

function LoadingScreen() {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={splash.root}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={splash.logo}
        resizeMode="contain"
      />
      <Animated.View style={[splash.ring, { transform: [{ rotate }] }]} />
    </View>
  );
}

// ─── Main layout ─────────────────────────────────────────────────────────────

function InitialLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const colorScheme = useColorScheme();
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    async function preload() {
      await Promise.all([
        Asset.loadAsync(LOCAL_IMAGES),
        // Menu, spa and promo banner photos are shown right after launch —
        // hold the splash until they're cached so they never pop in late.
        prefetchCriticalContent().catch(console.error),
      ]);
      setAssetsLoaded(true);
    }
    preload();
  }, []);

  // Everything else (restaurant photos, conference menus, gallery, events,
  // coupons) keeps loading in the background once the splash is gone, so it
  // doesn't compete with the splash's own downloads. Coupons require login;
  // that collection's fetch simply no-ops (catches its own permission error)
  // until the user signs in, at which point this effect re-runs (user
  // changed) and picks it up.
  useEffect(() => {
    if (!assetsLoaded) return;
    prefetchBackgroundContent().catch(console.error);
  }, [user, assetsLoaded]);

  useEffect(() => {
    if (!assetsLoaded || loading) return;
    const inAuth = segments[0] === 'auth';
    if (user && inAuth) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, assetsLoaded]);

  if (!assetsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <InitialLayout />
      </I18nextProvider>
    </AuthProvider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const splash = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1a2035',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  logo: {
    width: 120,
    height: 68,
  },
  ring: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: BrandColors.gold,
    borderRightColor: BrandColors.gold,
  },
});
