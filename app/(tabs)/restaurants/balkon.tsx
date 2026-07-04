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
  Linking,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BrandColors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { EventsCarousel } from '@/components/home/events-carousel';
import { useEvents } from '@/hooks/use-events';
import { BackButton } from '@/components/navigation/back-button';
import { useContactActions } from '@/hooks/use-contact-actions';
import { useRestaurantPhotos } from '@/hooks/use-restaurant-photos';
import { useMenu } from '@/hooks/use-menu';
import { ImageViewerHeader } from '@/components/image-viewer-header';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NAV_DARK = '#1a2035';

const PHOTO_GAP = 8;
const PHOTO_H_PAD = 16;
const PHOTO_SIZE = (SCREEN_WIDTH - PHOTO_H_PAD * 2 - PHOTO_GAP * 2) / 3;



type TabKey = 'menu' | 'photos' | 'events' | 'info';

export default function BalkonScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('menu');
  const { events } = useEvents();
  const { showContactAlert } = useContactActions();
  const { photos } = useRestaurantPhotos('Balkon');
  const photosForViewer = photos.map((p) => ({ uri: p.imageUrl }));
  const { pages: menuPages } = useMenu('Balkon');
  const menuForViewer = menuPages.map((p) => ({ uri: p.imageUrl }));

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'menu',   label: t('restaurants.tab_menu') },
    { key: 'photos', label: t('restaurants.tab_photos') },
    { key: 'events', label: t('restaurants.tab_events') },
    { key: 'info',   label: t('restaurants.tab_info') },
  ];
  const [viewerImages, setViewerImages] = useState<{ uri: string }[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);

  const openViewer = (images: { uri: string }[], index: number) => {
    setViewerImages(images);
    setViewerIndex(index);
    setViewerVisible(true);
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ─── Hero ─── */}
        <ImageBackground
          source={require('@/assets/images/grill-bc.jpg')}
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
            <Text style={styles.heroTitle}>{t('restaurants.balkon_title')}</Text>
            <Text style={styles.heroSub}>{t('restaurants.subtitle')}</Text>
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
            {menuPages.map((p, i) => (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.9}
                onPress={() => openViewer(menuForViewer, i)}
              >
                <Image source={{ uri: p.imageUrl }} style={styles.menuImage} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ImageViewing
          images={viewerImages}
          imageIndex={viewerIndex}
          visible={viewerVisible}
          onRequestClose={() => setViewerVisible(false)}
          HeaderComponent={() => <ImageViewerHeader onClose={() => setViewerVisible(false)} />}
        />

        {/* ─── Photos ─── */}
        {activeTab === 'photos' && (
          <View style={styles.photosWrap}>
            {photos.map((p, i) => (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.85}
                onPress={() => openViewer(photosForViewer, i)}
              >
                <Image source={{ uri: p.imageUrl }} style={styles.photo} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ─── Events ─── */}
        {activeTab === 'events' && (
          <EventsCarousel items={events} />
        )}

        {/* ─── Info ─── */}
        {activeTab === 'info' && (
          <View style={styles.infoWrap}>
            <View style={styles.scheduleCard}>
              <Text style={styles.scheduleTitle}>{t('restaurants.hours_title')}</Text>
              <View style={styles.scheduleDivider} />
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleDay}>{t('restaurants.hours_weekdays')}</Text>
                <Text style={styles.scheduleTime}>12:00 – 23:00</Text>
              </View>
              <View style={[styles.scheduleRow, { marginBottom: 0 }]}>
                <Text style={styles.scheduleDay}>{t('restaurants.hours_weekend')}</Text>
                <Text style={styles.scheduleTime}>12:00 – 00:00</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ─── Sticky Reservation Button ─── */}
      <View style={[styles.reserveBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.reserveBtn} activeOpacity={0.85} onPress={() => showContactAlert(t('restaurants.book_table'))}>
          <Text style={styles.reserveText}>{t('restaurants.book_table')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.couponsBtn}
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: '/coupons', params: { from: 'balkon' } })}
        >
          <Text style={styles.couponsText}>{t('restaurants.view_coupons')}</Text>
        </TouchableOpacity>
      </View>

      <BackButton tint="dark" />
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
    paddingTop: 8,
    gap: 4,
  },
  menuImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.7,
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
  couponsBtn: {
    marginTop: 10,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BrandColors.gold,
    backgroundColor: 'transparent',
  },
  couponsText: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.gold,
    letterSpacing: 0.4,
  },
});
