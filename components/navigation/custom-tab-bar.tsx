import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router, usePathname } from 'expo-router';
import { BrandColors } from '@/constants/theme';

const NAV_DARK = '#1a2035';

type TabSpec = {
  key: string;
  icon: number;
  iconActive: number;
  label: string;
  subLabel?: string;
  route: string;
  matchPrefix: string;
};

const TABS: TabSpec[] = [
  { key: 'home',    icon: require('@/assets/images/navbar/nav-home-black.svg'),    iconActive: require('@/assets/images/navbar/nav-home-white.svg'),    label: 'Home',           route: '/(tabs)',                     matchPrefix: '/' },
  { key: 'hotel',   icon: require('@/assets/images/navbar/nav-hotel-black.svg'),   iconActive: require('@/assets/images/navbar/nav-hotel-white.svg'),   label: 'Hotel',          route: '/(tabs)/hotel',               matchPrefix: '/hotel' },
  { key: 'senator', icon: require('@/assets/images/navbar/nav-senator-black.svg'), iconActive: require('@/assets/images/navbar/nav-senator-white.svg'), label: 'Restaurants', subLabel: 'SENATOR', route: '/(tabs)/restaurants/senator', matchPrefix: '/restaurants/senator' },
  { key: 'balkon',  icon: require('@/assets/images/navbar/nav-balkon-black.svg'),  iconActive: require('@/assets/images/navbar/nav-balkon-white.svg'),  label: 'Restaurants', subLabel: 'BALKON',  route: '/(tabs)/restaurants/balkon',  matchPrefix: '/restaurants/balkon' },
  { key: 'profile', icon: require('@/assets/images/navbar/nav-profile-black.svg'), iconActive: require('@/assets/images/navbar/nav-profile-white.svg'), label: 'Profile',       route: '/(tabs)/profile',             matchPrefix: '/profile' },
];

function getActiveKey(pathname: string): string {
  if (pathname.startsWith('/restaurants/senator')) return 'senator';
  if (pathname.startsWith('/restaurants/balkon')) return 'balkon';
  if (pathname.startsWith('/hotel')) return 'hotel';
  if (pathname.startsWith('/profile')) return 'profile';
  if (pathname === '/' || pathname === '') return 'home';
  // Screens opened from the home quick-access buttons keep Home highlighted.
  if (pathname.startsWith('/promotions') || pathname.startsWith('/events') || pathname.startsWith('/photos')) return 'home';
  return '';
}

export function CustomTabBar(_: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const activeKey = getActiveKey(pathname);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      {TABS.map((tab) => {
        const isFocused = activeKey === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => router.push(tab.route as any)}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <View style={[styles.pill, isFocused && styles.pillActive]}>
              <Image
                source={isFocused ? tab.iconActive : tab.icon}
                style={styles.icon}
                contentFit="contain"
              />
              <View>
                <Text style={[styles.label, isFocused && styles.labelActive]} numberOfLines={1}>
                  {tab.label}
                </Text>
                {tab.subLabel && (
                  <Text style={[styles.label, isFocused && styles.labelActive]} numberOfLines={1}>
                    {tab.subLabel}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: BrandColors.white,
    paddingTop: 16,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  pill: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 12,
    overflow: 'hidden',
    gap: 4,
    width: '100%',
  },
  pillActive: {
    backgroundColor: NAV_DARK,
  },
  icon: {
    width: 22,
    height: 22,
  },
  label: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: BrandColors.black,
  },
  labelActive: {
    color: BrandColors.white,
  },
});
