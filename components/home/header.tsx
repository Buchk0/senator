import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SupportedLanguage } from '@/hooks/use-language';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export interface HeaderProps {
  activeLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  /** Full "SH Senator Hotel Restaurant" logo placed under the language switcher */
  largeLogo?: boolean;
}

export function Header({ activeLanguage, onLanguageChange, largeLogo = false }: HeaderProps) {
  const insets = useSafeAreaInsets();

  if (largeLogo) {
    return (
      <View style={[styles.largeContainer, { paddingTop: insets.top + 36 }]}>
        <Image
          source={require('@/assets/images/home/logo.png')}
          style={styles.largeLogoImage}
          resizeMode="contain"
        />

        {/* Language switcher — top right */}
        <View style={[styles.switcherWrapper, { right: 20, top: insets.top + 8 }]}>
          <LanguageSwitcher
            activeLanguage={activeLanguage}
            onLanguageChange={onLanguageChange}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 96 }]}>
      {/* Logo — absolutely centered */}
      <View style={styles.logoWrapper} pointerEvents="none">
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
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
  largeContainer: {
    alignItems: 'center',
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
  largeLogoImage: {
    width: 118,
    height: 105,
  },
  switcherWrapper: {
    position: 'absolute',
  },
});
