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
import { Image as ExpoImage } from 'expo-image';
import ImageViewing from 'react-native-image-viewing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BrandColors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@/components/navigation/back-button';
import { useContactActions } from '@/hooks/use-contact-actions';
import { useRestaurantPhotos } from '@/hooks/use-restaurant-photos';
import { useMenu } from '@/hooks/use-menu';
import { ImageViewerHeader } from '@/components/image-viewer-header';
import { PromoBanners } from '@/components/restaurants/promo-banners';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NAV_DARK = '#1a2035';

const PHOTO_GAP = 8;
const PHOTO_H_PAD = 16;
// Divide by ~3.3 instead of 3 so a sliver of the next photo peeks in,
// signalling that the row scrolls horizontally.
const PHOTO_SIZE = (SCREEN_WIDTH - PHOTO_H_PAD * 2 - PHOTO_GAP * 2) / 3.3;



type TabKey = 'menu' | 'photos' | 'events' | 'info';
type MenuMode = 'text' | 'photo';

export default function BalkonScreen() {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  // Tab buttons always stay in English, like the navbar
  const tEn = i18n.getFixedT('en');
  const [activeTab, setActiveTab] = useState<TabKey>('menu');
  const { showContactAlert } = useContactActions();
  const { photos } = useRestaurantPhotos('Balkon');
  const photosForViewer = photos.map((p) => ({ uri: p.imageUrl }));
  const { pages: menuPages } = useMenu('Balkon');
  const menuForViewer = menuPages.map((p) => ({ uri: p.imageUrl }));

  // null = nothing picked yet, only the two menu buttons are shown
  const [menuMode, setMenuMode] = useState<MenuMode | null>(null);

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'info',   label: tEn('restaurants.tab_info') },
    { key: 'photos', label: tEn('restaurants.tab_photos') },
    { key: 'menu',   label: tEn('restaurants.tab_menu') },
    { key: 'events', label: tEn('restaurants.tab_promotions_events') },
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
              source={require('@/assets/images/restaurants/balkon/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{t('restaurants.balkon_title')}</Text>
            <Text style={styles.heroSub}>{t('restaurants.balkon_subtitle')}</Text>
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
              <Text
                style={[
                  styles.tabLabel,
                  tab.label.includes('\n') && styles.tabLabelTwoLines,
                  activeTab === tab.key && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Menu ─── */}
        {activeTab === 'menu' && (
          <View style={styles.menuModeRow}>
            {(['text', 'photo'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.menuModeBtn, menuMode === mode && styles.menuModeBtnActive]}
                activeOpacity={0.8}
                onPress={() => setMenuMode(mode)}
              >
                <Text style={[styles.menuModeLabel, menuMode === mode && styles.menuModeLabelActive]}>
                  {t(mode === 'text' ? 'restaurants.menu_text' : 'restaurants.menu_photo')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* TODO: content for the text menu (menuMode === 'text') is not defined yet */}
        {activeTab === 'menu' && menuMode === 'photo' && (
          <View style={styles.menuWrap}>
            {menuPages.map((p, i) => (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.9}
                onPress={() => openViewer(menuForViewer, i)}
              >
                <ExpoImage
                  source={{ uri: p.imageUrl }} cachePolicy="memory-disk"
                  style={styles.menuImage}
                  contentFit="contain"
                  transition={200}
                />
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photosWrap}
          >
            {photos.map((p, i) => (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.85}
                onPress={() => openViewer(photosForViewer, i)}
              >
                <ExpoImage
                  source={{ uri: p.imageUrl }} cachePolicy="memory-disk"
                  style={styles.photo}
                  contentFit="cover"
                  transition={200}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ─── Events ─── */}
        {activeTab === 'events' && (
          <PromoBanners restaurant="balkon" />
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

        <View style={{ height: insets.bottom + 160 }} />
      </ScrollView>

      {/* ─── Sticky Reservation Button ─── */}
      <View style={styles.reserveBar}>
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
    width: 93,
    height: 45,
  },
  heroContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: BrandColors.white,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.3,
    lineHeight: 18,
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
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: NAV_DARK,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  tabLabelTwoLines: {
    fontSize: 11,
    lineHeight: 13,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: BrandColors.white,
  },

  /* ── Menu / Menu Photo buttons ── */
  menuModeRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  menuModeBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuModeBtnActive: {
    backgroundColor: NAV_DARK,
  },
  menuModeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: NAV_DARK,
  },
  menuModeLabelActive: {
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
    backgroundColor: '#eee',
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
    backgroundColor: '#eee',
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
    paddingBottom: 12,
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
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BrandColors.gold,
    backgroundColor: 'transparent',
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
