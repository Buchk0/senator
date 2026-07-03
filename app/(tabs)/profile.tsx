import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandColors } from '@/constants/theme';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AuthGate } from '@/components/auth/auth-gate';
import { BackButton } from '@/components/navigation/back-button';
import { useContactActions } from '@/hooks/use-contact-actions';

export default function ProfileTab() {
  const insets = useSafeAreaInsets();
  const { user, profile, signOut } = useAuth();
  const { t } = useTranslation();
  const { showContactAlert } = useContactActions();

  if (!user) return (
    <View style={{ flex: 1 }}>
      <AuthGate />
      <BackButton tint="dark" />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
    <ScrollView
      style={styles.profileBg}
      contentContainerStyle={[styles.profileContent, { paddingTop: insets.top + 56, paddingBottom: insets.bottom + 24 }]}
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

        <TouchableOpacity style={styles.helpRow} activeOpacity={0.8} onPress={() => showContactAlert(t('profile.contact_reception'))}>
          <Text style={styles.helpCardText}>{t('profile.contact_reception')}</Text>
          <View style={styles.chevronCircle}>
            <MaterialIcons name="chevron-right" size={22} color="#1a2035" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.helpRow} activeOpacity={0.8} onPress={() => Linking.openURL('https://maps.app.goo.gl/kRDshYUDDvmSryyX6?g_st=ic')}>
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
      <BackButton tint="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
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
