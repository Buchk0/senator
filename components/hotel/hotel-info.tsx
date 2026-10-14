import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { BrandColors } from '@/constants/theme';

const AMENITIES = [
  { id: 'breakfast', icon: require('@/assets/images/hotel/icon-breakfast.svg'), hasDescription: true },
  { id: 'fitness', icon: require('@/assets/images/hotel/icon-fitness.svg'), hasDescription: true },
  { id: 'room_service', icon: require('@/assets/images/hotel/icon-room-service.svg'), hasDescription: false },
  { id: 'laundry', icon: require('@/assets/images/hotel/icon-laundry.svg'), hasDescription: false },
  { id: 'parking', icon: require('@/assets/images/hotel/icon-parking.svg'), hasDescription: false },
] as const;

const BOOKING_BLUE = '#003b95';
const BOOKING_BADGE_BLUE = '#006ce4';
const BORDER_COLOR = 'rgba(198, 156, 109, 0.5)';

export function HotelInfo() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.bookingBanner}>
        <View style={styles.bookingText}>
          <Text style={styles.bookingLogo}>Booking.com</Text>
          <Text style={styles.bookingAward} numberOfLines={1} adjustsFontSizeToFit>
            {t('hotel.info.booking_award')}
          </Text>
        </View>
        <View style={styles.bookingBadge}>
          <Text style={styles.bookingScore}>9,5</Text>
        </View>
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeCard}>
          <Text style={styles.timeLabel}>{t('hotel.info.check_in')}</Text>
          <Text style={styles.timeValue}>{t('hotel.info.check_in_value')}</Text>
        </View>
        <View style={styles.timeCard}>
          <Text style={styles.timeLabel}>{t('hotel.info.check_out')}</Text>
          <Text style={styles.timeValue}>{t('hotel.info.check_out_value')}</Text>
        </View>
      </View>

      <View style={styles.amenities}>
        {AMENITIES.map((item, index) => (
          <View key={item.id} style={[styles.amenityRow, index > 0 && styles.amenityDivider]}>
            <Image source={item.icon} style={styles.amenityIcon} contentFit="contain" />
            <View style={styles.amenityText}>
              <Text style={styles.amenityTitle}>{t(`hotel.info.${item.id}`)}</Text>
              {item.hasDescription && (
                <Text style={styles.amenityDesc}>{t(`hotel.info.${item.id}_desc`)}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  bookingBanner: {
    backgroundColor: BOOKING_BLUE,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bookingText: {
    flex: 1,
  },
  bookingLogo: {
    fontSize: 24,
    fontWeight: '800',
    color: BrandColors.white,
    letterSpacing: -0.5,
  },
  bookingAward: {
    fontSize: 17,
    fontWeight: '400',
    color: BrandColors.white,
    marginTop: 4,
  },
  bookingBadge: {
    backgroundColor: BOOKING_BADGE_BLUE,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 6,
    marginTop: -8,
  },
  bookingScore: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.white,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timeCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: BrandColors.gold,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '500',
    color: BrandColors.black,
    marginTop: 2,
  },
  amenities: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 16,
  },
  amenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 52,
    paddingVertical: 8,
  },
  amenityDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.12)',
  },
  amenityIcon: {
    width: 34,
    height: 34,
  },
  amenityText: {
    flex: 1,
  },
  amenityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: BrandColors.black,
  },
  amenityDesc: {
    fontSize: 10,
    fontWeight: '400',
    color: BrandColors.gold,
    marginTop: 1,
    lineHeight: 13,
  },
});
