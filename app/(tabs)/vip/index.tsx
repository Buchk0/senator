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
import { BrandColors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { BackButton } from '@/components/navigation/back-button';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NAV_DARK = '#1a2035';

const PHOTO_GAP = 8;
const PHOTO_H_PAD = 16;
const PHOTO_SIZE = (SCREEN_WIDTH - PHOTO_H_PAD * 2 - PHOTO_GAP * 2) / 3;

const PHOTOS = [
  require('@/assets/images/vip/vip-photo-1.jpg'),
  require('@/assets/images/vip/vip-photo-2.jpg'),
  require('@/assets/images/vip/vip-photo-3.jpg'),
];

const PHOTOS_FOR_VIEWER = PHOTOS.map((src) => ({
  uri: Image.resolveAssetSource(src).uri,
}));

type TabKey = 'photos' | 'info';

export default function VipScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('photos');
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'photos', label: t('vip.tab_photos') },
    { key: 'info',   label: t('vip.tab_info') },
  ];

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ─── Hero ─── */}
        <ImageBackground
          source={require('@/assets/images/vip/vip-bc.jpg')}
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
            <Text style={styles.heroTitle}>{t('vip.title')}</Text>
            <Text style={styles.heroSub}>{t('vip.subtitle')}</Text>
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

        {/* ─── Photos ─── */}
        {activeTab === 'photos' && (
          <View style={styles.photosWrap}>
            {PHOTOS.map((src, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.9}
                onPress={() => { setViewerIndex(i); setViewerVisible(true); }}
              >
                <Image source={src} style={styles.photo} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ImageViewing
          images={PHOTOS_FOR_VIEWER}
          imageIndex={viewerIndex}
          visible={viewerVisible}
          onRequestClose={() => setViewerVisible(false)}
        />

        {/* ─── Info ─── */}
        {activeTab === 'info' && (
          <View style={styles.infoWrap}>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>{t('vip.capacity_title')}</Text>
              <View style={styles.infoDivider} />
              <Text style={styles.infoCardValue}>{t('vip.capacity_value')}</Text>
            </View>

            <View style={[styles.infoCard, { marginTop: 16 }]}>
              <Text style={styles.infoCardTitle}>{t('vip.hours_title')}</Text>
              <View style={styles.infoDivider} />
              <View style={styles.scheduleRow}>
                <Text style={styles.scheduleDay}>{t('vip.hours_daily')}</Text>
                <Text style={styles.scheduleTime}>{t('vip.hours_time')}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ─── Sticky Book Button ─── */}
      <View style={[styles.reserveBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.reserveBtn} activeOpacity={0.85} onPress={() => Linking.openURL('tel:+7777777777')}>
          <Text style={styles.reserveText}>{t('vip.book_btn')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappBtn} activeOpacity={0.85} onPress={() => Linking.openURL('https://wa.me/77777777777')}>
          <Ionicons name="logo-whatsapp" size={18} color={BrandColors.gold} style={{ marginRight: 8 }} />
          <Text style={styles.whatsappText}>{t('common.whatsapp')}</Text>
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
  infoCard: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 16,
    padding: 20,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.black,
    marginBottom: 16,
  },
  infoDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e5e5',
    marginBottom: 16,
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  whatsappBtn: {
    marginTop: 10,
    borderRadius: 50,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: BrandColors.gold,
    backgroundColor: 'transparent',
  },
  whatsappText: {
    fontSize: 15,
    fontWeight: '700',
    color: BrandColors.gold,
    letterSpacing: 0.4,
  },
});
