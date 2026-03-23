import '@/i18n';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Image } from 'react-native';
import 'react-native-reanimated';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import AuthProvider, { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Asset } from 'expo-asset';

const LOCAL_IMAGES = [
  require('@/assets/images/restaurants-bc.png'),
  require('@/assets/images/logo.png'),
  require('@/assets/images/senator-bc.jpg'),
  require('@/assets/images/grill-bc.jpg'),
  require('@/assets/images/senator-photo-1.jpg'),
  require('@/assets/images/senator-photo-2.jpg'),
  require('@/assets/images/senator-photo-3.jpg'),
  require('@/assets/images/grill-photo-1.jpg'),
  require('@/assets/images/grill-photo-2.jpg'),
  require('@/assets/images/grill-photo-3.jpg'),
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
];

const REMOTE_IMAGES = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
];

function InitialLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const colorScheme = useColorScheme();

  useEffect(() => {
    Asset.loadAsync(LOCAL_IMAGES);
    REMOTE_IMAGES.forEach((url) => Image.prefetch(url));
  }, []);

  useEffect(() => {
    if (loading) return;
    //   router.replace('/(tabs)');
     const inAuth = segments[0] === 'auth';
     if (!user && !inAuth) {
       router.replace('/auth/login');
     } else if (user && inAuth) {
       router.replace('/(tabs)');
     }
  }, [user, loading, segments]);

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
