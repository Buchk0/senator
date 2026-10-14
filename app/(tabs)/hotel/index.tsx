import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { BrandColors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@/components/navigation/back-button';
import { HotelInfo } from '@/components/hotel/hotel-info';
import { HotelPrices } from '@/components/hotel/hotel-prices';
import { HotelGuests } from '@/components/hotel/hotel-guests';

const ROOMS = [
  { type: 'standard', image: require('@/assets/images/standart/standart-double/1.jpg') },
  { type: 'deluxe',   image: require('@/assets/images/deluxe/deluxe-double/1.jpg') },
  { type: 'suite',    image: require('@/assets/images/suite/executive/1.jpg') },
] as const;

const TABS = ['info', 'prices', 'promotions'] as const;
type HotelTabId = (typeof TABS)[number];
type HotelSection = HotelTabId | 'guests';

const NAVY = '#1a2035';

export default function HotelTab() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  // null = room categories list
  const [activeTab, setActiveTab] = useState<HotelSection | null>(null);

  const handleTabPress = (tab: HotelTabId) => {
    // TODO: content for promotions is not defined yet
    if (tab === 'promotions') return;
    setActiveTab((current) => (current === tab ? null : tab));
  };

  // TODO: content for the bottom buttons is not defined yet
  const handlePlaceholderPress = () => {};

  return (
    <View style={styles.container}>
      <BackButton tint="dark" onPress={activeTab ? () => setActiveTab(null) : undefined} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 88 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>{t('hotel.title')}</Text>
        <Text style={styles.subheading}>{t('hotel.subtitle')}</Text>

        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              activeOpacity={0.7}
              onPress={() => handleTabPress(tab)}
            >
              <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]} numberOfLines={1}>{t(`hotel.tab_${tab}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'info' ? (
          <HotelInfo />
        ) : activeTab === 'prices' ? (
          <HotelPrices />
        ) : activeTab === 'guests' ? (
          <HotelGuests />
        ) : (
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
        )}

        {activeTab !== 'guests' && (
        <>
        <TouchableOpacity
          style={[styles.wideButton, styles.wideButtonDark]}
          activeOpacity={0.85}
          onPress={() => setActiveTab('guests')}
        >
          <Image source={require('@/assets/images/hotel/icon-star.svg')} style={styles.starIcon} contentFit="contain" />
          <Text style={[styles.wideButtonLabel, styles.wideButtonLabelDark]}>
            {t('hotel.famous_guests')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.wideButton, styles.wideButtonLight]}
          activeOpacity={0.85}
          onPress={handlePlaceholderPress}
        >
          <Image source={require('@/assets/images/hotel/icon-award.svg')} style={styles.awardIcon} contentFit="contain" />
          <Text style={styles.wideButtonLabel}>{t('hotel.awards')}</Text>
        </TouchableOpacity>
        </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 120,
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
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  tabActive: {
    backgroundColor: NAVY,
  },
  tabLabelActive: {
    color: BrandColors.white,
    fontWeight: '600',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.6)',
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
  chevronCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: BrandColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wideButton: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    marginTop: 16,
  },
  starIcon: {
    width: 25,
    height: 24,
  },
  awardIcon: {
    width: 17,
    height: 23,
    marginHorizontal: 4,
  },
  wideButtonDark: {
    backgroundColor: NAVY,
    borderColor: NAVY,
  },
  wideButtonLight: {
    backgroundColor: '#f0f0f0',
    borderColor: BrandColors.gold,
  },
  wideButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.7)',
  },
  wideButtonLabelDark: {
    color: BrandColors.white,
  },
});
