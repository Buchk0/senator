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
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: BrandColors.white,
    letterSpacing: -0.3,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 10,
    letterSpacing: 0.2,
    lineHeight: 22,
  },
});
