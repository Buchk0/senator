import { ComponentProps } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BrandColors } from '@/constants/theme';

export interface VenueCardItem {
  id: string;
  imageUrl: string;
  iconName: ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  reserveLabel: string;
  onPress: () => void;
}

export interface VenueCardsProps {
  items: VenueCardItem[];
}

function VenueCard({ imageUrl, iconName, title, reserveLabel, onPress }: VenueCardItem) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.9}>
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      >
        {/* Dark overlay */}
        <View style={styles.overlay} />

        {/* Content row */}
        <View style={styles.content}>
          {/* Left icon */}
          <MaterialIcons name={iconName} size={32} color={BrandColors.gold} />

          {/* Center title */}
          <Text style={styles.title} numberOfLines={1}>{title}</Text>

          {/* Right chevron in circle */}
          <View style={styles.chevronCircle}>
            <MaterialIcons name="chevron-right" size={22} color={BrandColors.white} />
          </View>
        </View>

        {/* Bottom reserve strip */}
        <TouchableOpacity onPress={onPress} style={styles.strip} activeOpacity={0.8}>
          <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFillObject} />
          <Text style={styles.reserveText}>{reserveLabel}</Text>
        </TouchableOpacity>
      </ImageBackground>
    </TouchableOpacity>
  );
}

export function VenueCards({ items }: VenueCardsProps) {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <VenueCard key={item.id} {...item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 0,
    backgroundColor: BrandColors.white,

    paddingTop: 24,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BrandColors.gold,
    marginBottom: 28,
  },
  image: {
    height: 160,
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    flex: 1,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.white,
    paddingHorizontal: 8,
  },
  chevronCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: BrandColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strip: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BrandColors.gold,
    overflow: 'hidden',
  },
  reserveText: {
    color: BrandColors.gold,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
