import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { BrandColors } from '@/constants/theme';

const NAV_DARK = '#1a2035';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

const TAB_CONFIG: Record<string, { icon: IconName; label: string }> = {
  index:       { icon: 'home',                label: 'Главная' },
  hotel:       { icon: 'apartment',           label: 'Отель' },
  restaurants: { icon: 'restaurant',          label: 'Рестораны' },
  coupons:     { icon: 'confirmation-number', label: 'Купоны' },
  profile:     { icon: 'person',              label: 'Профиль' },
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: 15 }]}>
      {state.routes.map((route, index) => {
        const config = TAB_CONFIG[route.name];
        if (!config) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
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
                name={config.icon}
                size={22}
                color={isFocused ? BrandColors.white : BrandColors.black}
              />
              <Text style={[styles.label, isFocused && styles.labelActive]} numberOfLines={1}>
                {config.label}
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
    paddingTop: 10,
    paddingHorizontal: 8,
    // top shadow
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
    paddingHorizontal: 6,
    borderRadius: 12,
    gap: 3,
  },
  pillActive: {
    backgroundColor: NAV_DARK,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: BrandColors.black,
  },
  labelActive: {
    color: BrandColors.white,
    fontWeight: '600',
  },
});
