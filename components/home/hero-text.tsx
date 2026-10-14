import { View, Text, StyleSheet } from 'react-native';
import { BrandColors } from '@/constants/theme';

export interface HeroTextProps {
  title: string;
  subtitle: string;
}

export function HeroText({ title, subtitle }: HeroTextProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 28,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.white,
    lineHeight: 32,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 6,
    letterSpacing: 0.2,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 280,
  },
});
