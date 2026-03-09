import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { BrandColors } from '@/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const H_PADDING = 24;
const GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.8;

export interface EventItem {
  id: string;
  imageUrl: string;
  subtitle: string;
  title: string;
}

export interface EventsCarouselProps {
  sectionTitle?: string;
  items: [EventItem, EventItem];
}

export function EventCard({ imageUrl, subtitle, title }: EventItem) {
  return (
    <ImageBackground
      source={{ uri: imageUrl }}
      style={styles.card}
      imageStyle={styles.cardImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      {/* Subtitle at the top */}
      <Text style={styles.subtitleText}>{subtitle}</Text>

      {/* Title absolutely centred in the card */}
      <View style={styles.titleWrap}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
    </ImageBackground>
  );
}

export function EventsCarousel({ sectionTitle, items }: EventsCarouselProps) {
  return (
    <View style={styles.section}>
      {sectionTitle ? <Text style={styles.sectionTitle}>{sectionTitle}</Text> : null}

      <View style={styles.row}>
        {items.map((item) => (
          <EventCard key={item.id} {...item} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: BrandColors.white,
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: H_PADDING,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: BrandColors.black,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
    paddingTop: 20,
  },

  // Card
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    // layout: column so subtitle sits at top, titleWrap fills remaining space
    flexDirection: 'column',
    padding: 14,
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 10,
  },
  cardImage: {
    borderRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
  },

  // Subtitle pinned to top
  subtitleText: {
    color: BrandColors.white,
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 21,
    opacity: 0.85,
    marginTop: 20,
  },

  // Title absolutely centred in the card
  titleWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: BrandColors.white,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 26,
  },
});
