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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import ImageViewing from 'react-native-image-viewing';
import { ImageViewerHeader } from '@/components/image-viewer-header';
import { BrandColors } from '@/constants/theme';
import { BackButton } from '@/components/navigation/back-button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 16;
const GAP = 8;
const COLS = 3;
const PHOTO_SIZE = (SCREEN_WIDTH - H_PADDING * 2 - GAP * (COLS - 1)) / COLS;

const PHOTOS = [
  require('@/assets/images/senator-photo-1.jpg'),
  require('@/assets/images/senator-photo-2.jpg'),
  require('@/assets/images/senator-photo-3.jpg'),
  require('@/assets/images/senator-photo-4.jpg'),
  require('@/assets/images/grill-photo-1.jpg'),
  require('@/assets/images/grill-photo-2.jpg'),
  require('@/assets/images/grill-photo-3.jpg'),
  require('@/assets/images/grill-photo-4.jpg'),
  require('@/assets/images/grill-photo-5.jpg'),
  require('@/assets/images/spa/spa-photo-1.jpg'),
  require('@/assets/images/spa/spa-photo-2.jpg'),
  require('@/assets/images/spa/spa-photo-3.jpg'),
  require('@/assets/images/spa/spa-photo-4.jpg'),
  require('@/assets/images/spa/spa-photo-5.jpg'),
  require('@/assets/images/spa/spa-photo-6.jpg'),
  require('@/assets/images/vip/vip-photo-1.jpg'),
  require('@/assets/images/vip/vip-photo-2.jpg'),
  require('@/assets/images/vip/vip-photo-3.jpg'),
  require('@/assets/images/conference/conference-photo-1.jpg'),
  require('@/assets/images/conference/conference-photo-2.jpg'),
];

const PHOTOS_FOR_VIEWER = PHOTOS.map((src) => ({
  uri: Image.resolveAssetSource(src).uri,
}));

export default function PhotosScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={require('@/assets/images/restaurants-bc.png')}
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
            <Text style={styles.heroTitle}>{t('photos.title')}</Text>
            <Text style={styles.heroSub}>{t('photos.subtitle')}</Text>
          </View>
        </ImageBackground>

        <View style={styles.grid}>
          {PHOTOS.map((src, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.85}
              onPress={() => { setViewerIndex(i); setViewerVisible(true); }}
              style={styles.photoTouch}
            >
              <Image source={src} style={styles.photo} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <ImageViewing
        images={PHOTOS_FOR_VIEWER}
        imageIndex={viewerIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        HeaderComponent={() => <ImageViewerHeader onClose={() => setViewerVisible(false)} />}
      />

      <BackButton tint="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.white,
  },
  hero: {
    width: '100%',
    paddingBottom: 28,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
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
    paddingTop: 120,
    alignItems: 'center',
  },
  heroTitle: {
    color: BrandColors.white,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: H_PADDING,
    paddingTop: 20,
    gap: GAP,
  },
  photoTouch: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});
