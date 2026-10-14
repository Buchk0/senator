import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { BrandColors } from '@/constants/theme';

const GUEST_PHOTOS = [
  require('@/assets/images/hotel/guests/1.png'),
  require('@/assets/images/hotel/guests/2.png'),
  require('@/assets/images/hotel/guests/3.png'),
  require('@/assets/images/hotel/guests/4.png'),
  require('@/assets/images/hotel/guests/5.png'),
  require('@/assets/images/hotel/guests/6.png'),
];

const COLUMNS = 3;
const GAP = 8;

export function HotelGuests() {
  const { t } = useTranslation();

  const rows: number[][] = [];
  for (let i = 0; i < GUEST_PHOTOS.length; i += COLUMNS) {
    rows.push(GUEST_PHOTOS.slice(i, i + COLUMNS));
  }

  return (
    <View>
      <Text style={styles.title}>{t('hotel.famous_guests_title')}</Text>
      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((photo, index) => (
              <Image key={index} source={photo} style={styles.photo} contentFit="cover" />
            ))}
            {/* keep the last row aligned to the grid when it is not full */}
            {Array.from({ length: COLUMNS - row.length }).map((_, index) => (
              <View key={`spacer-${index}`} style={styles.spacer} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.gold,
    marginBottom: 18,
  },
  grid: {
    gap: GAP,
    marginHorizontal: -8,
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
  },
  photo: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 18,
  },
  spacer: {
    flex: 1,
  },
});
