import { ComponentProps } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BrandColors } from '@/constants/theme';

export interface QuickAccessItem {
  id: string;
  iconName: ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  onPress: () => void;
}

export interface QuickAccessProps {
  items: QuickAccessItem[];
}

export function QuickAccess({ items }: QuickAccessProps) {
  const rows = [items.slice(0, 3), items.slice(3, 6)];

  return (
    <View style={styles.container}>
      {/* Single outer card with blur background and gold border */}
      <View style={styles.outerCard}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />

        {rows.map((row, rowIndex) => (
          <View key={rowIndex}>
            {/* Horizontal divider between rows */}
            {rowIndex > 0 && <View style={styles.horizontalDivider} />}

            <View style={styles.row}>
              {row.map((item, colIndex) => (
                <View key={item.id} style={styles.cellWrapper}>
                  {/* Vertical divider between columns */}
                  {colIndex > 0 && <View style={styles.verticalDivider} />}

                  <TouchableOpacity
                    onPress={item.onPress}
                    style={styles.cell}
                    activeOpacity={0.6}
                  >
                    <MaterialIcons
                      name={item.iconName}
                      size={36}
                      color={BrandColors.white}
                    />
                    <Text style={styles.label}>{item.label}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  outerCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BrandColors.gold,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  row: {
    flexDirection: 'row',
  },
  cellWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  verticalDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(198, 156, 109, 0.4)',
  },
  horizontalDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(198, 156, 109, 0.4)',
  },
  cell: {
    flex: 1,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  label: {
    fontSize: 13,
    color: BrandColors.white,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 18,
  },
});
