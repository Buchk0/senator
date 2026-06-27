import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { router, usePathname } from 'expo-router';
import { BrandColors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';

const NAV_DARK = '#1a2035';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

type TabSpec = {
  key: string;
  icon: IconName;
  i18nKey: string;
  route: string;
  matchPrefix: string;
};

const TABS: TabSpec[] = [
  { key: 'home',    icon: 'home',         i18nKey: 'nav.home',    route: '/(tabs)',                     matchPrefix: '/' },
  { key: 'hotel',   icon: 'apartment',    i18nKey: 'nav.hotel',   route: '/(tabs)/hotel',               matchPrefix: '/hotel' },
  { key: 'senator', icon: 'restaurant',   i18nKey: 'nav.senator', route: '/(tabs)/restaurants/senator', matchPrefix: '/restaurants/senator' },
  { key: 'balkon',  icon: 'lunch-dining', i18nKey: 'nav.balkon',  route: '/(tabs)/restaurants/balkon',  matchPrefix: '/restaurants/balkon' },
  { key: 'profile', icon: 'person',       i18nKey: 'nav.profile', route: '/(tabs)/profile',             matchPrefix: '/profile' },
];

function getActiveKey(pathname: string): string {
  if (pathname.startsWith('/restaurants/senator')) return 'senator';
  if (pathname.startsWith('/restaurants/balkon')) return 'balkon';
  if (pathname.startsWith('/hotel')) return 'hotel';
  if (pathname.startsWith('/profile')) return 'profile';
  if (pathname === '/' || pathname === '') return 'home';
  return '';
}

export function CustomTabBar(_: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
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
              <MaterialIcons
                name={tab.icon}
                size={22}
                color={isFocused ? BrandColors.white : BrandColors.black}
              />
              <Text style={[styles.label, isFocused && styles.labelActive]} numberOfLines={1}>
                {t(tab.i18nKey as any)}
              </Text>
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
    paddingHorizontal: 8,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 3,
    width: '100%',
  },
  pillActive: {
    backgroundColor: NAV_DARK,
  },
  label: {
    fontSize: 9,
    fontWeight: '500',
    color: BrandColors.black,
  },
  labelActive: {
    color: BrandColors.white,
    fontWeight: '600',
  },
});
