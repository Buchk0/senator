import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BrandColors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';

const ROOMS = [
  { type: 'standard', image: require('@/assets/images/standart/standart-double/1.jpg') },
  { type: 'deluxe',   image: require('@/assets/images/deluxe/deluxe-double/1.jpg') },
  { type: 'suite',    image: require('@/assets/images/suite/executive/1.jpg') },
] as const;

export default function HotelTab() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 24 }]}>
      <Text style={styles.heading}>{t('hotel.title')}</Text>
      <Text style={styles.subheading}>{t('hotel.subtitle')}</Text>

      <View style={styles.list}>
        {ROOMS.map((room) => (
          <TouchableOpacity
            key={room.type}
            activeOpacity={0.85}
            onPress={() => router.push(`/hotel/room/${room.type}` as any)}
          >
            <ImageBackground
              source={room.image}
              style={styles.card}
              imageStyle={styles.cardImage}
              resizeMode="cover"
            >
              <View style={styles.overlay} />
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardLabel}>{t(`hotel.rooms.${room.type}.label`)}</Text>
                </View>
                <View style={styles.chevronCircle}>
                  <MaterialIcons name="chevron-right" size={22} color={BrandColors.white} />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.white,
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: BrandColors.black,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0,0,0,0.45)',
    marginBottom: 32,
  },
  list: {
    gap: 16,
  },
  card: {
    height: 110,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BrandColors.gold,
  },
  cardImage: {
    borderRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.50)',
    borderRadius: 20,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  cardLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.white,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
  },
  chevronCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: BrandColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
