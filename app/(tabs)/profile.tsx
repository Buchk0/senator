import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, TextInput, Alert, Pressable, Keyboard, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandColors } from '@/constants/theme';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/constants/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/constants/firebase';
import { useLanguage } from '@/hooks/use-language';
import { useTranslation } from 'react-i18next';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import PhoneInput from 'react-native-phone-number-input';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

const getFlagEmoji = (code: string) =>
  code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

interface UserProfile {
  name: string;
  surname: string;
  birthDate: string;
  phone: string;
}

export default function ProfileTab() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const phoneInput = useRef<PhoneInput>(null);
  const [formattedPhone, setFormattedPhone] = useState('');
  const [password, setPassword] = useState('');
  const { activeLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (snap.exists()) setProfile(snap.data() as UserProfile);
    });
  }, [user]);

  const handleLogin = async () => {
    if (!formattedPhone) return Alert.alert(t('profile.error'), t('profile.enter_phone'));
    if (!password) return Alert.alert(t('profile.error'), t('profile.enter_password'));
    try {
      const email = `${formattedPhone.replace(/[^0-9]/g, '')}@senator.kz`;
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      Alert.alert(t('profile.error'), t('profile.wrong_credentials'));
    }
  };

  if (!user) {
    return (
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <ImageBackground
          source={require('@/assets/images/restaurants-bc.png')}
          style={styles.bg}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={[styles.loginContainer, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>

            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <LanguageSwitcher
              activeLanguage={activeLanguage}
              onLanguageChange={changeLanguage}
            />

            <PhoneInput
              ref={phoneInput}
              defaultCode="KZ"
              layout="first"
              onChangeFormattedText={setFormattedPhone}
              containerStyle={styles.phoneContainer}
              textContainerStyle={styles.phoneTextContainer}
              textInputStyle={styles.phoneInputText}
              codeTextStyle={styles.phoneCodeText}
              withShadow={false}
              placeholder="700 000 00 00"
              textInputProps={{ placeholderTextColor: 'rgba(255,255,255,0.5)', maxLength: 13 }}
              flagButtonStyle={{ width: 80 }}
              countryPickerProps={{
                withFilter: true,
                withFlag: true,
                withCountryNameButton: false,
                withAlphaFilter: true,
                withEmoji: true,
                renderFlagButton: ({ countryCode, onOpen }: { countryCode: string; onOpen: () => void }) => (
                  <TouchableOpacity onPress={onOpen} style={styles.flagButton} activeOpacity={0.7}>
                    <Text style={styles.flagEmoji}>{getFlagEmoji(countryCode || 'KZ')}</Text>
                    <Text style={styles.flagChevron}>▾</Text>
                  </TouchableOpacity>
                ),
              }}
            />

            <View style={styles.inputRow}>
              <MaterialIcons name="lock" size={20} color={BrandColors.gold} style={styles.icon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder={t('profile.password_placeholder')}
                placeholderTextColor="rgba(255,255,255,0.5)"
                maxLength={20}
              />
            </View>

            <TouchableOpacity style={styles.btnOuter} onPress={handleLogin} activeOpacity={0.8}>
              <View style={styles.btnInner}>
                <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
                <Text style={styles.btnText}>{t('profile.login_btn')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/auth/register')} activeOpacity={0.7}>
              <Text style={styles.registerLink}>{t('profile.no_account')}</Text>
            </TouchableOpacity>

          </View>
        </ImageBackground>
      </Pressable>
    );
  }

  return (
    <ScrollView
      style={styles.profileBg}
      contentContainerStyle={[styles.profileContent, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Info card */}
      <View style={styles.card}>
        <Text style={styles.fullName}>{profile?.name} {profile?.surname}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('profile.phone_label')}</Text>
          <Text style={styles.infoValue}>{profile?.phone}</Text>
        </View>
        <View style={styles.actionCardsRow}>
          <TouchableOpacity style={styles.actionPill} onPress={() => router.push('/(tabs)/coupons')} activeOpacity={0.8}>
            <MaterialIcons name="confirmation-number" size={18} color="#1a2035" />
            <View style={{ flex: 1 }}>
              <Text style={styles.actionCardTitle}>{t('profile.my_coupons')}</Text>
              <Text style={styles.actionCardSub}>{t('profile.coupon_sub')}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.actionPill}>
            <MaterialIcons name="cake" size={18} color="#1a2035" />
            <View style={{ flex: 1 }}>
              <Text style={styles.actionCardTitle} numberOfLines={1}>{t('profile.birthday')}</Text>
              <Text style={styles.actionCardSub}>{profile?.birthDate}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Help section */}
      <View style={styles.helpCard}>
        <Text style={styles.sectionHeader}>{t('profile.help')}</Text>

        <TouchableOpacity style={styles.helpRow} activeOpacity={0.8}>
          <Text style={styles.helpCardText}>{t('profile.contact_reception')}</Text>
          <View style={styles.chevronCircle}>
            <MaterialIcons name="chevron-right" size={22} color="#1a2035" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpRow} activeOpacity={0.8}>
          <Text style={styles.helpCardText}>{t('profile.directions')}</Text>
          <View style={styles.chevronCircle}>
            <MaterialIcons name="chevron-right" size={22} color="#1a2035" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={signOut} activeOpacity={0.8}>
        <Text style={styles.logoutBtnText}>{t('profile.logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  phoneContainer: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BrandColors.white,
    width: '100%',
  },
  phoneTextContainer: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingLeft: 0,
  },
  phoneInputText: {
    color: BrandColors.white,
    fontSize: 15,
  },
  phoneCodeText: {
    color: BrandColors.white,
    fontSize: 15,
  },
  flagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 20,
    gap: 4,
  },
  flagEmoji: {
    fontSize: 24,
  },
  flagChevron: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 12,
    paddingHorizontal: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: BrandColors.white,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: BrandColors.white,
  },
  btnOuter: {
    width: '100%',
    marginTop: 8,
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
  registerLink: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  profileBg: {
    flex: 1,
    backgroundColor: BrandColors.white,
  },
  profileContent: {
    paddingHorizontal: 16,
    gap: 14,
  },
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  fullName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a2035',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: '#999',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a2035',
  },
  actionCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionPill: {
    flex: 1,
    backgroundColor: '#f2f2f7',
    borderRadius: 14,
    paddingVertical: 16,
    paddingLeft: 14,
    paddingRight: 8,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  actionCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a2035',
    marginBottom: 2,
  },
  actionCardSub: {
    fontSize: 10,
    color: '#999',
    lineHeight: 14,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a2035',
    marginBottom: -2,
  },
  helpCard: {
    backgroundColor: BrandColors.white,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  helpRow: {
    backgroundColor: '#f2f2f7',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpCardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a2035',
  },
  chevronCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#1a2035',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
    borderWidth: 1.5,
    borderColor: '#1a2035',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  logoutBtnText: {
    color: '#1a2035',
    fontSize: 15,
    fontWeight: '700',
  },
});
