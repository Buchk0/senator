import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandColors } from '@/constants/theme';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '@/hooks/use-language';

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

      {/* Language switcher — right side, 20px from logo */}
      <View style={[styles.switcherWrapper, { right: 20 }]}>
        <BlurView
          intensity={80}
          tint="dark"
          style={[styles.switcherBlur, { height: logoHeight }]}
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isActive = lang === activeLanguage;
            return (
              <TouchableOpacity
                key={lang}
                onPress={() => onLanguageChange(lang)}
                style={[styles.langButton, isActive && styles.langButtonActive]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langText,
                    isActive ? styles.langTextActive : styles.langTextInactive,
                  ]}
                >
                  {lang.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </BlurView>
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
  switcherBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 4,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  langButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  langButtonActive: {
    backgroundColor: BrandColors.white,
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
  },
  langTextActive: {
    color: BrandColors.black,
  },
  langTextInactive: {
    color: 'rgba(255,255,255,0.6)',
  },
});
