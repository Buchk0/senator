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
import { Image as ExpoImage } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import ImageViewing from 'react-native-image-viewing';
import { ImageViewerHeader } from '@/components/image-viewer-header';
import { BrandColors } from '@/constants/theme';
import { BackButton } from '@/components/navigation/back-button';
import { useGallery } from '@/hooks/use-gallery';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 12;
const GAP = 8;
const COLS = 3;
const PHOTO_SIZE = (SCREEN_WIDTH - H_PADDING * 2 - GAP * (COLS - 1)) / COLS;

export default function PhotosScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { photos } = useGallery();
  const photosForViewer = photos.map((p) => ({ uri: p.imageUrl }));
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={require('@/assets/images/home/background.jpg')}
          style={[styles.hero, { paddingTop: insets.top + 140 }]}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />
          <View style={[styles.logoWrap, { top: insets.top + 12 }]}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.heroTitle}>{t('photos.title')}</Text>
          <Text style={styles.heroSub}>{t('photos.subtitle')}</Text>
        </ImageBackground>

        <View style={styles.grid}>
          {photos.map((p, i) => (
            <TouchableOpacity
              key={p.id}
              activeOpacity={0.85}
              onPress={() => { setViewerIndex(i); setViewerVisible(true); }}
              style={styles.photoTouch}
            >
              <ExpoImage
                source={{ uri: p.imageUrl }} cachePolicy="memory-disk"
                style={styles.photo}
                contentFit="cover"
                transition={200}
              />
            </TouchableOpacity>
          ))}
        </View>

        {photos.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>{t('photos.empty')}</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <ImageViewing
        images={photosForViewer}
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
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  logoWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 36,
  },
  heroTitle: {
    color: BrandColors.white,
    fontSize: 28,
    fontWeight: '700',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: H_PADDING,
    paddingTop: 28,
    gap: GAP,
  },
  photoTouch: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 20,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
  },
  emptyWrap: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(0,0,0,0.45)',
    fontSize: 15,
  },
});
