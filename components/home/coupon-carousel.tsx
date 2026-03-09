import { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BrandColors } from '@/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Each "page" of the ScrollView is exactly SCREEN_WIDTH wide.
// The card sits inside with horizontal padding, so it looks inset.
const CARD_SIDE_PADDING = 24;
const CARD_WIDTH = SCREEN_WIDTH - CARD_SIDE_PADDING * 2;

export interface CouponItem {
  id: string;
  imageUrl: string;
  categoryLabel: string;
  validUntil: string;
  title: string;
  description: string;
}

export interface CouponCarouselProps {
  sectionTitle: string;
  items: CouponItem[];
  topSpacing?: number;
  cardBottomPadding?: number;
}

function CouponCard({ imageUrl, categoryLabel, validUntil, title, description, cardBottomPadding }: CouponItem & { cardBottomPadding?: number }) {
  return (
    <View style={[styles.cardWrapper, cardBottomPadding !== undefined && { paddingBottom: cardBottomPadding }]}>
      <View style={styles.card}>
        {/* Image with inner padding — does NOT cover full width */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Tags overlaid on the image */}
          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{categoryLabel}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{validUntil}</Text>
            </View>
          </View>
        </View>

        {/* Text body */}
        <View style={styles.body}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.descText}>{description}</Text>

          {/* Chevron bottom-right */}
          <View style={styles.chevronWrap}>
            <View style={styles.chevronCircle}>
              <MaterialIcons name="chevron-right" size={24} color={BrandColors.black} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export function CouponCarousel({ sectionTitle, items, topSpacing, cardBottomPadding }: CouponCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / SCREEN_WIDTH);
    setActiveIndex(Math.max(0, Math.min(index, items.length - 1)));
  };

  return (
    <View style={[styles.section, topSpacing !== undefined && { paddingTop: topSpacing }]}>
      {/* Section title */}
      <Text style={styles.sectionTitle}>{sectionTitle}</Text>

      {/* Carousel — pages are SCREEN_WIDTH wide, card is inset inside */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
      >
        {items.map((item) => (
          <CouponCard key={item.id} {...item} cardBottomPadding={cardBottomPadding} />
        ))}
      </ScrollView>

      {/* Dot indicators */}
      <View style={[styles.dots, cardBottomPadding !== undefined && { marginTop: cardBottomPadding }]}>
        {items.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: BrandColors.white,
    paddingTop: 28,
    paddingBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: BrandColors.black,
    paddingHorizontal: CARD_SIDE_PADDING,
    marginBottom: 6,
    letterSpacing: 0.3,
  },

  // Each scroll page is exactly SCREEN_WIDTH — ensures only 1 card visible
  cardWrapper: {
    width: SCREEN_WIDTH,
    paddingHorizontal: CARD_SIDE_PADDING,
    // vertical padding so shadow is fully visible
    paddingTop: 20,
    paddingBottom: 6,
  },

  // The actual card with shadow
  card: {
    width: CARD_WIDTH,
    backgroundColor: BrandColors.white,
    borderRadius: 20,
    // iOS shadow — offset 0,0 so shadow is equal on all sides
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    // Android shadow
    elevation: 10,
  },

  // Image sits inside card with padding on all sides
  imageContainer: {
    margin: 12,
    borderRadius: 14,
    overflow: 'hidden',
    height: 190,
  },
  image: {
    width: '100%',
    height: '100%',
  },

  // Tags overlay — positioned absolute inside imageContainer
  tagsRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tag: {
    borderWidth: 1.5,
    borderColor: BrandColors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'transparent',
  },
  tagText: {
    color: BrandColors.white,
    fontSize: 12,
    fontWeight: '600',
  },

  // Card text body
  body: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.gold,
    marginBottom: 8,
    lineHeight: 28,
  },
  descText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 20,
  },
  chevronWrap: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
  chevronCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: BrandColors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Dot indicators
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: BrandColors.black,
    opacity: 0.15,
  },
  dotActive: {
    backgroundColor: BrandColors.gold,
    opacity: 1,
  },
});
