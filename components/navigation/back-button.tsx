import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { BrandColors } from '@/constants/theme';

export interface BackButtonProps {
  tint?: 'dark' | 'light';
  onPress?: () => void;
}

export function BackButton({ tint = 'dark', onPress }: BackButtonProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const isLight = tint === 'light';

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={[
        styles.wrapper,
        {
          top: insets.top + 12,
          backgroundColor: isLight ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.35)',
          borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.12)',
        },
      ]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <BlurView
        intensity={isLight ? 35 : 55}
        tint={isLight ? 'light' : 'dark'}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.inner}>
        <MaterialIcons name="chevron-left" size={22} color={BrandColors.gold} />
        <Text style={styles.label}>{t('common.back')}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    zIndex: 100,
    elevation: 10,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 6,
    paddingRight: 14,
    paddingVertical: 7,
  },
  label: {
    color: BrandColors.gold,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 2,
  },
});
