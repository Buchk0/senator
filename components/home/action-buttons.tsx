import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { BrandColors } from '@/constants/theme';

export interface ActionButtonItem {
  label: string;
  onPress: () => void;
}

export interface ActionButtonsProps {
  primary: ActionButtonItem;
  secondary: ActionButtonItem;
}

function ActionButton({ label, onPress }: ActionButtonItem) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonOuter} activeOpacity={0.8}>
      <View style={styles.buttonBorder}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
        <Text style={styles.buttonText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function ActionButtons({ primary, secondary }: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      <ActionButton label={primary.label} onPress={primary.onPress} />
      <ActionButton label={secondary.label} onPress={secondary.onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 28,
  },
  buttonOuter: {
    flex: 1,
  },
  buttonBorder: {
    height: 52,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BrandColors.gold,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  buttonText: {
    color: BrandColors.white,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
    paddingHorizontal: 8,
    alignSelf: 'stretch',
  },
});
