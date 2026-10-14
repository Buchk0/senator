import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { BrandColors } from '@/constants/theme';

const FEATURES = [
  { id: 'cuisine', icon: require('@/assets/images/restaurants/icon-dish.svg'), hasNote: false },
  { id: 'wine', icon: require('@/assets/images/restaurants/icon-wine.svg'), hasNote: false },
  { id: 'breakfast', icon: require('@/assets/images/restaurants/icon-coffee.svg'), hasNote: true },
  { id: 'style', icon: require('@/assets/images/restaurants/icon-star.svg'), hasNote: false },
  { id: 'meetings', icon: require('@/assets/images/restaurants/icon-people.svg'), hasNote: false },
  { id: 'music', icon: require('@/assets/images/restaurants/icon-music.svg'), hasNote: true },
] as const;

const BORDER_COLOR = 'rgba(198, 156, 109, 0.5)';

export function SenatorFeatures() {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      {FEATURES.map((item, index) => (
        <View key={item.id} style={[styles.row, index > 0 && styles.divider]}>
          <Image source={item.icon} style={styles.icon} contentFit="contain" />
          <View style={styles.text}>
            <Text style={styles.title}>{t(`restaurants.senator_features.${item.id}`)}</Text>
            {item.hasNote && (
              <Text style={styles.note}>{t(`restaurants.senator_features.${item.id}_note`)}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    paddingVertical: 8,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER_COLOR,
  },
  icon: {
    width: 32,
    height: 26,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: BrandColors.black,
    lineHeight: 16,
  },
  note: {
    fontSize: 9,
    fontWeight: '400',
    color: 'rgba(0,0,0,0.55)',
    lineHeight: 12,
  },
});
