import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BrandColors } from '@/constants/theme';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '@/hooks/use-language';

interface Props {
  activeLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export function LanguageSwitcher({ activeLanguage, onLanguageChange }: Props) {
  return (
    <View style={styles.switcher}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <TouchableOpacity
          key={lang}
          style={[styles.btn, activeLanguage === lang && styles.btnActive]}
          onPress={() => onLanguageChange(lang)}
          activeOpacity={0.8}
        >
          <Text style={[styles.text, activeLanguage === lang && styles.textActive]}>
            {lang.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  switcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: BrandColors.gold,
    padding: 6,
    alignSelf: 'center',
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 50,
  },
  btnActive: {
    backgroundColor: BrandColors.white,
  },
  text: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    fontSize: 13,
  },
  textActive: {
    color: '#1a2035',
  },
});
