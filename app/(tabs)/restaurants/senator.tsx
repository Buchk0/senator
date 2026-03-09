import { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandColors } from '@/constants/theme';
import { EventsCarousel } from '@/components/home/events-carousel';
import { HOTEL_EVENTS } from '@/constants/events-data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NAV_DARK = '#1a2035';

const PHOTO_GAP = 8;
const PHOTO_H_PAD = 16;
const PHOTO_SIZE = (SCREEN_WIDTH - PHOTO_H_PAD * 2 - PHOTO_GAP * 2) / 3;

const MENU_IMAGES = [
  require('@/assets/images/menu/senator/1.png'),
  require('@/assets/images/menu/senator/2.png'),
  require('@/assets/images/menu/senator/3.png'),
  require('@/assets/images/menu/senator/4.png'),
  require('@/assets/images/menu/senator/5.png'),
  require('@/assets/images/menu/senator/6.png'),
  require('@/assets/images/menu/senator/7.png'),
  require('@/assets/images/menu/senator/8.png'),
];

const MENU_IMAGES_FOR_VIEWER = MENU_IMAGES.map((src) => ({
  uri: Image.resolveAssetSource(src).uri,
}));

type TabKey = 'menu' | 'photos' | 'events' | 'info';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'menu',   label: 'Меню' },
  { key: 'photos', label: 'Фото' },
  { key: 'events', label: 'События' },
  { key: 'info',   label: 'Инфо' },
];

export default function SenatorScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>('menu');
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ─── Hero ─── */}
        <ImageBackground
          source={require('@/assets/images/senator-bc.jpg')}
          style={styles.hero}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />

          <View style={[styles.logoWrap, { top: insets.top + 16 }]}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Ресторан Senator</Text>
            <Text style={styles.heroSub}>Меню, события, контакты</Text>
          </View>
        </ImageBackground>

        {/* ─── Tab pills ─── */}
        <View style={styles.tabsRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Menu ─── */}
        {activeTab === 'menu' && (
          <View style={styles.menuWrap}>
            {MENU_IMAGES.map((src, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.9}
                onPress={() => { setViewerIndex(i); setViewerVisible(true); }}
              >
                <Image source={src} style={styles.menuImage} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ImageViewing
          images={MENU_IMAGES_FOR_VIEWER}
          imageIndex={viewerIndex}
          visible={viewerVisible}
          onRequestClose={() => setViewerVisible(false)}
        />

        {/* ─── Photos ─── */}
        {activeTab === 'photos' && (
          <View style={styles.photosWrap}>
            <Image source={require('@/assets/images/senator-photo-1.jpg')} style={styles.photo} resizeMode="cover" />
            <Image source={require('@/assets/images/senator-photo-2.jpg')} style={styles.photo} resizeMode="cover" />
            <Image source={require('@/assets/images/senator-photo-3.jpg')} style={styles.photo} resizeMode="cover" />
          </View>
        )}

        {/* ─── Events ─── */}
        {activeTab === 'events' && (
          <EventsCarousel items={HOTEL_EVENTS} />
        )}

        {/* ─── Info ─── */}
        {activeTab === 'info' && (
          <View style={styles.infoWrap}>
            <View style={styles.scheduleCard}>
              <Text style={styles.scheduleTitle}>Время Работы</Text>
              <View style={styles.scheduleDivider} />
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleDay}>Пн – Чт</Text>
                <Text style={styles.scheduleTime}>12:00 – 23:00</Text>
              </View>
              <View style={[styles.scheduleRow, { marginBottom: 0 }]}>
                <Text style={styles.scheduleDay}>Пт – Вс</Text>
                <Text style={styles.scheduleTime}>12:00 – 00:00</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ─── Sticky Reservation Button ─── */}
      <View style={[styles.reserveBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.reserveBtn} activeOpacity={0.85}>
          <Text style={styles.reserveText}>Забронировать столик</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.white,
  },

  /* ── Hero ── */
  hero: {
    minHeight: 280,
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.52)',
  },
  logoWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo: {
    width: 72,
    height: 40,
  },
  heroContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '400',
    color: BrandColors.white,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.3,
  },

  /* ── Tabs ── */
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: BrandColors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: NAV_DARK,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  tabLabelActive: {
    color: BrandColors.white,
  },

  /* ── Menu images ── */
  menuWrap: {
    paddingTop: 0,
    gap: 0,
  },
  menuImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.5,
    backgroundColor: BrandColors.white,
  },

  /* ── Photos ── */
  photosWrap: {
    flexDirection: 'row',
    gap: PHOTO_GAP,
    paddingHorizontal: PHOTO_H_PAD,
    paddingTop: 20,
    paddingBottom: 20,
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
  },

  /* ── Info ── */
  infoWrap: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  scheduleCard: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 16,
    padding: 20,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.black,
    marginBottom: 16,
  },
  scheduleDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e5e5',
    marginBottom: 16,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scheduleDay: {
    fontSize: 14,
    fontWeight: '500',
    color: BrandColors.black,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },

  /* ── Reserve button ── */
  reserveBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: BrandColors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 10,
  },
  reserveBtn: {
    backgroundColor: NAV_DARK,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  reserveText: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.gold,
    letterSpacing: 0.4,
  },
});
