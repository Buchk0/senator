import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { BrandColors } from '@/constants/theme';
import { useLanguage } from '@/hooks/use-language';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function AuthGate() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { activeLanguage, changeLanguage } = useLanguage();

  return (
    <ImageBackground
      source={require('@/assets/images/restaurants-bc.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />

        <LanguageSwitcher activeLanguage={activeLanguage} onLanguageChange={changeLanguage} />

        <Text style={styles.title}>{t('auth.gate_title')}</Text>
        <Text style={styles.subtitle}>{t('auth.gate_subtitle')}</Text>

        <TouchableOpacity style={styles.btnOuter} onPress={() => router.push('/auth/login')} activeOpacity={0.8}>
          <View style={styles.btnInner}>
            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
            <Text style={styles.btnText}>{t('auth.login_btn')}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/auth/register')} activeOpacity={0.8}>
          <Text style={styles.registerBtnText}>{t('auth.register_btn')}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.white,
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  btnOuter: {
    width: '100%',
  },
  btnInner: {
    height: 52,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BrandColors.gold,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  btnText: {
    color: BrandColors.white,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  registerBtn: {
    width: '100%',
    height: 52,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerBtnText: {
    color: BrandColors.white,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
