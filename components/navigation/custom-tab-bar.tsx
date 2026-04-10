import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { BrandColors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';

const NAV_DARK = '#1a2035';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

const TAB_ICONS: Record<string, IconName> = {
  index:       'home',
  hotel:       'apartment',
  restaurants: 'restaurant',
  coupons:     'confirmation-number',
  profile:     'person',
};

const TAB_I18N_KEYS: Record<string, string> = {
  index:       'nav.home',
  hotel:       'nav.hotel',
  restaurants: 'nav.restaurants',
  coupons:     'nav.coupons',
  profile:     'nav.profile',
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { paddingBottom: 24 }]}>
      {state.routes.map((route, index) => {
        const icon = TAB_ICONS[route.name];
        const i18nKey = TAB_I18N_KEYS[route.name];
        if (!icon || !i18nKey) return null;

        const currentRoute = state.routes[state.index].name;
        const isActuallyFocused = state.index === index;
        const isFocused = isActuallyFocused ||
          (['spa', 'conference', 'vip'].includes(currentRoute) && route.name === 'index');

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isActuallyFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <View style={[styles.pill, isFocused && styles.pillActive]}>
              <MaterialIcons
                name={icon}
                size={22}
                color={isFocused ? BrandColors.white : BrandColors.black}
              />
              <Text style={[styles.label, isFocused && styles.labelActive]} numberOfLines={1}>
                {t(i18nKey)}
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
