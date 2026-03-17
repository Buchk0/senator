import { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SupportedLanguage } from '@/hooks/use-language';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export interface HeaderProps {
  activeLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export function Header({ activeLanguage, onLanguageChange }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const [logoHeight, setLogoHeight] = useState(40);

  const handleLogoLayout = (e: LayoutChangeEvent) => {
    setLogoHeight(e.nativeEvent.layout.height);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 96 }]}>
      {/* Logo — absolutely centered */}
      <View style={styles.logoWrapper} pointerEvents="none">
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
          onLayout={handleLogoLayout}
        />
      </View>

      {/* Language switcher — right side */}
      <View style={[styles.switcherWrapper, { right: 20 }]}>
        <LanguageSwitcher
          activeLanguage={activeLanguage}
          onLanguageChange={onLanguageChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  logoWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logoImage: {
    width: 72,
    height: 40,
  },
  switcherWrapper: {
    position: 'absolute',
  },
});
