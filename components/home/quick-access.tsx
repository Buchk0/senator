import { ComponentProps } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image, ImageSource } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BrandColors } from '@/constants/theme';

export interface QuickAccessItem {
  id: string;
  /** Custom icon from the design; falls back to iconName when not provided */
  iconSource?: ImageSource | number;
  iconName?: ComponentProps<typeof MaterialIcons>['name'];
  /** Natural size of iconSource; without it the icon is stretched to fill the box */
  iconSize?: { width: number; height: number };
  label: string;
  onPress: () => void;
}

export interface QuickAccessProps {
  items: QuickAccessItem[];
  /** Wide buttons (icon on the left) shown in a row under the grid */
  wideItems?: QuickAccessItem[];
}

const COLUMNS = 3;

function ItemIcon({ item, size }: { item: QuickAccessItem; size: number }) {
  if (item.iconSource) {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={item.iconSource}
          style={item.iconSize ?? { width: size, height: size }}
          contentFit="contain"
        />
      </View>
    );
  }
  return <MaterialIcons name={item.iconName} size={size} color={BrandColors.white} />;
}

export function QuickAccess({ items, wideItems = [] }: QuickAccessProps) {
  const rows: QuickAccessItem[][] = [];
  for (let i = 0; i < items.length; i += COLUMNS) {
    rows.push(items.slice(i, i + COLUMNS));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              style={styles.tile}
              activeOpacity={0.7}
            >
              <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
              <ItemIcon item={item} size={36} />
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {wideItems.length > 0 && (
        <View style={[styles.row, styles.wideRow]}>
          {wideItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.onPress}
              style={styles.wideTile}
              activeOpacity={0.7}
            >
              {/* No experimentalBlurMethod: on Android it also blurs this tile's own
                  icon/text, which shows up as a white glow around them */}
              <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
              <View style={styles.wideGoldTint} />
              <ItemIcon item={item} size={32} />
              <Text style={[styles.label, styles.wideLabel]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const tileBase = {
  borderRadius: 20,
  borderWidth: 1,
  borderColor: BrandColors.gold,
  overflow: 'hidden',
  backgroundColor: 'rgba(0,0,0,0.5)',
} as const;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    ...tileBase,
    flex: 1,
    height: 100,
    paddingHorizontal: 4,
    // Top-anchored (not centered) so one- and two-line labels start on the same line
    paddingTop: 14,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  wideRow: {
    marginTop: 20,
  },
  wideTile: {
    ...tileBase,
    flex: 1,
    height: 62,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 13,
    color: BrandColors.white,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 17,
  },
  wideGoldTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(198,156,109,0.15)',
  },
  wideLabel: {
    flex: 1,
  },
});
