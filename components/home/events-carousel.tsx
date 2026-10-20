import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { BrandColors } from '@/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const H_PADDING = 24;
const GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.8;

export interface EventItem {
  id: string;
  imageUrl: string;   // Firebase Storage URL or local URI
  subtitle: string;
  title: string;
}

export interface EventsCarouselProps {
  sectionTitle?: string;
  items: EventItem[];
}

export function EventCard({ imageUrl, subtitle, title }: EventItem) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: imageUrl }} cachePolicy="memory-disk"
        style={styles.cardImage}
        contentFit="cover"
        transition={200}
      />

      {/* Dark scrim so white text stays legible over bright photos */}
      <View style={styles.scrim} />

      <View style={styles.titleWrap}>
        {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
        <Text style={styles.titleText}>{title}</Text>
      </View>
    </View>
  );
}

export function EventsCarousel({ sectionTitle, items }: EventsCarouselProps) {
  if (items.length === 0) return null;

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
    flexWrap: 'wrap',
    gap: GAP,
    paddingTop: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'column',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 10,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#d9d9d9',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  subtitleText: {
    color: BrandColors.white,
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 21,
    opacity: 0.85,
    marginBottom: 6,
  },
  titleWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  titleText: {
    color: BrandColors.white,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 26,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
