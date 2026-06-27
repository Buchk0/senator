import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
} from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import { BrandColors } from '@/constants/theme';
import { ROOM_CATEGORIES } from '@/constants/room-data';
import { BackButton } from '@/components/navigation/back-button';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_H_MARGIN = 20;
const CARD_WIDTH = SCREEN_WIDTH - CARD_H_MARGIN * 2;
const THUMB_WIDTH = (CARD_WIDTH - 10) / 2;
const THUMB_HEIGHT = THUMB_WIDTH * 0.72;

export default function RoomCategoryScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const category = ROOM_CATEGORIES[type as string] ?? ROOM_CATEGORIES.standard;
  const { t } = useTranslation();

  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const toggle = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ── */}
      <ImageBackground
        source={category.heroImage}
        style={[styles.hero, { height: SCREEN_HEIGHT * 0.58 }]}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay} />

        <View style={styles.heroBody}>
          <Text style={styles.heroTitle}>{t(`hotel.rooms.${category.key}.label` as any)}</Text>
          <Text style={styles.heroDesc}>{t(`hotel.rooms.${category.key}.short_desc` as any)}</Text>
        </View>

        <View style={styles.heroBookWrap}>
          <TouchableOpacity style={styles.heroBookBtn} activeOpacity={0.85} onPress={() => Linking.openURL('tel:+7777777777')}>
            <BlurView intensity={55} style={StyleSheet.absoluteFill} tint="dark" />
            <Text style={styles.heroBookBtnText}>{t('hotel.book_btn')}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* ── Sub-type cards ── */}
      <View style={styles.subtypeList}>
        {category.subtypes.map((sub) => {
          const isOpen = expandedKey === sub.key;
          return (
            <View key={sub.key} style={styles.subCard}>

              {/* Header — tap to collapse when open */}
              <TouchableOpacity activeOpacity={isOpen ? 0.8 : 1} onPress={isOpen ? () => toggle(sub.key) : undefined}>
                <ImageBackground
                  source={sub.heroImage}
                  style={styles.subCardImage}
                  imageStyle={isOpen ? styles.subCardImageStyleOpen : styles.subCardImageStyle}
                  resizeMode="cover"
                >
                  <View style={styles.subCardOverlay} />
                  <View style={styles.subCardTextWrap}>
                    <Text style={styles.subCardName}>{t(`hotel.rooms.${category.key}.${sub.key}_label` as any)}</Text>
                    <Text style={styles.subCardPrice}>{sub.price}</Text>
                  </View>
                  {/* Strip button — hidden when expanded */}
                  {!isOpen && (
                    <TouchableOpacity style={styles.strip} activeOpacity={0.8} onPress={() => toggle(sub.key)}>
                      <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFillObject} />
                      <Text style={styles.stripText}>{t('hotel.more_btn')}</Text>
                    </TouchableOpacity>
                  )}
                </ImageBackground>
              </TouchableOpacity>

              {/* Expanded body */}
              {isOpen && (
                <View style={styles.expandedBody}>
                  <Text style={styles.description}>{t(`hotel.rooms.${category.key}.${sub.key}_desc` as any)}</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.carouselContent}
                    style={styles.carousel}
                  >
                    {sub.gallery.map((img, i) => (
                      <Image
                        key={i}
                        source={img}
                        style={styles.carouselImg}
                        resizeMode="cover"
                      />
                    ))}
                  </ScrollView>
                </View>
              )}

            </View>
          );
        })}
      </View>
    </ScrollView>
      <BackButton tint="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.white,
  },
  hero: {
    justifyContent: 'space-between',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  heroBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: BrandColors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroDesc: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 22,
  },
  heroBookWrap: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  heroBookBtn: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: BrandColors.gold,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBookBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.white,
    zIndex: 1,
  },
  subtypeList: {
    paddingHorizontal: CARD_H_MARGIN,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 16,
  },
  subCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BrandColors.gold,
    overflow: 'hidden',
    backgroundColor: BrandColors.white,
  },
  subCardImage: {
    height: 140,
    justifyContent: 'space-between',
  },
  subCardImageStyle: {
    borderRadius: 15,
  },
  subCardImageStyleOpen: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  subCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  subCardTextWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  subCardName: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.white,
    textAlign: 'center',
  },
  subCardPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: BrandColors.white,
    textAlign: 'center',
  },
  strip: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BrandColors.gold,
    overflow: 'hidden',
  },
  stripText: {
    color: BrandColors.gold,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    zIndex: 1,
  },
  expandedBody: {
    backgroundColor: BrandColors.white,
    paddingBottom: 20,
  },
  description: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.65)',
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    textAlign: 'center',
  },
  carousel: {
    marginBottom: 20,
  },
  carouselContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  carouselImg: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
