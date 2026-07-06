import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandColors } from '@/constants/theme';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Coupon } from '@/constants/coupons-data';
import { query, where } from 'firebase/firestore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { auth, db } from '@/constants/firebase';
import { useAuth } from '@/context/AuthContext';
import { AuthGate } from '@/components/auth/auth-gate';
import { BackButton } from '@/components/navigation/back-button';
import { router, useLocalSearchParams } from 'expo-router';
import {
  doc, getDoc, setDoc, deleteDoc, updateDoc,
  arrayUnion, collection, getDocs, serverTimestamp, Timestamp,
} from 'firebase/firestore';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─── Coupon Card ─────────────────────────────────────────────────────────────

type CouponCardProps = {
  c: Coupon;
  timerSeconds: number | null;
  onUse: (id: string) => void;
};

function CouponCard({ c, timerSeconds, onUse }: CouponCardProps) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === 'kz' ? 'kz' : i18n.language === 'ru' ? 'ru' : 'en') as 'en' | 'ru' | 'kz';

  const isActive  = timerSeconds !== null;
  const isExpired = timerSeconds === 0;

  return (
    <View style={styles.coupon}>
      {/* ── Pills ── */}
      <View style={styles.couponFilter}>
        <View style={styles.couponPill}>
          <Text style={styles.couponPillText}>
            {c.restaurant === 'All' ? t('coupons.segment_all') : c.restaurant}
          </Text>
        </View>
        <View style={styles.couponTypePill}>
          <Text style={styles.couponTypePillText}>{t(`coupons.expires_${c.type}`)}</Text>
        </View>
        {c.oneTime && (
          <View style={styles.couponOneTimePill}>
            <Text style={styles.couponOneTimePillText}>{t('coupons.one_time')}</Text>
          </View>
        )}
      </View>

      {/* ── Title & description ── */}
      <Text style={styles.couponTitle}>{c.emoji} {c.title[lang] || c.title.en}</Text>
      <Text style={styles.couponDesc}>{c.description[lang] || c.description.en}</Text>

      <View style={styles.couponDivider} />

      {/* ── Terms ── */}
      <Text style={styles.couponTerms}>
        <Text style={styles.couponTermsLabel}>{t('coupons.terms_label')}: </Text>
        {c.terms[lang] || c.terms.en}
      </Text>

      {/* ── Action area (one-time coupons only) ── */}
      {c.oneTime && (
        isExpired ? (
          /* Coupon expired */
          <View style={styles.expiredBadge}>
            <MaterialIcons name="check-circle" size={16} color="rgba(11,27,46,0.4)" />
            <Text style={styles.expiredText}>{t('coupons.used')}</Text>
          </View>
        ) : isActive ? (
          /* Timer is running */
          <View style={styles.timerDisplay}>
            <MaterialIcons name="timer" size={18} color={BrandColors.gold} />
            <Text style={styles.timerText}>{formatTime(timerSeconds!)}</Text>
          </View>
        ) : (
          /* Ready to use */
          <Pressable style={styles.useBtn} onPress={() => onUse(c.id)}>
            <Text style={styles.useBtnText}>{t('coupons.use_btn')}</Text>
          </Pressable>
        )
      )}
    </View>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

type SectionProps = {
  titleKey: string;
  subtitleKey: string;
  items: Coupon[];
  timers: Record<string, number | null>;
  onUse: (id: string) => void;
};

function CouponSection({ titleKey, subtitleKey, items, timers, onUse }: SectionProps) {
  const { t } = useTranslation();
  if (items.length === 0) return null;
  return (
    <View>
      <View style={styles.sectionTitles}>
        <Text style={styles.sectionTitle}>{t(titleKey as any)}</Text>
        <Text style={styles.sectionSubtitle}>{t(subtitleKey as any)}</Text>
      </View>
      <View style={styles.couponsSection}>
        {items.map((c) => (
          <CouponCard
            key={c.id}
            c={c}
            timerSeconds={timers[c.id] ?? null}
            onUse={onUse}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function CouponsTab() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { from } = useLocalSearchParams<{ from?: string }>();

  const handleBack = () => {
    if (from === 'balkon') {
      router.replace('/(tabs)/restaurants/balkon');
    } else if (from === 'senator') {
      router.replace('/(tabs)/restaurants/senator');
    } else {
      router.replace('/(tabs)');
    }
  };

  const [restaurant, setRestaurant] = useState<'All' | 'Senator' | 'Balkon'>('All');
  const [allCoupons, setAllCoupons] = useState<Coupon[]>([]);
  const [usedCouponIds, setUsedCouponIds] = useState<string[]>([]);

  // timers: coupon id → seconds remaining (null = not started)
  const [timers, setTimers] = useState<Record<string, number | null>>({});
  const intervalRefs = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  // ─── Load state from Firebase on mount ───────────────────────────────────
  useEffect(() => {
    if (!auth.currentUser) return;
    // Fetch coupons from Firestore
    getDocs(query(collection(db, 'coupons'), where('active', '==', true)))
      .then((snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Coupon));
        setAllCoupons(items);
      })
      .catch(console.error);

    loadCouponState();
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, []);

  async function loadCouponState() {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // 1. Load used coupon IDs — these will be filtered out of the list
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const usedIds: string[] = userSnap.data()?.usedCouponIds ?? [];
      setUsedCouponIds(usedIds);

      // 2. Active coupon timers → resume countdown
      const activeCoupons = await getDocs(collection(db, 'users', user.uid, 'coupons'));
      const now = Date.now();
      const initialTimers: Record<string, number> = {};

      for (const snap of activeCoupons.docs) {
        const activatedAt: Timestamp = snap.data().activatedAt;
        if (!activatedAt) continue;

        const elapsed = (now - activatedAt.toMillis()) / 1000;
        const remaining = Math.floor(3600 - elapsed);

        if (remaining <= 0) {
          // Expired while app was closed — clean up
          await deleteDoc(snap.ref);
          await updateDoc(doc(db, 'users', user.uid), { usedCouponIds: arrayUnion(snap.id) });
          setUsedCouponIds(prev => [...prev, snap.id]);
        } else {
          initialTimers[snap.id] = remaining;
          runInterval(snap.id);
        }
      }

      setTimers(prev => ({ ...prev, ...initialTimers }));
    } catch {
      // Offline or error — timers stay at null (show Use button)
    }
  }

  // ─── Interval runner (shared by startTimer and resume on load) ───────────
  function runInterval(id: string) {
    if (intervalRefs.current[id]) clearInterval(intervalRefs.current[id]);

    intervalRefs.current[id] = setInterval(() => {
      setTimers(prev => {
        const remaining = (prev[id] ?? 1) - 1;
        if (remaining <= 0) {
          clearInterval(intervalRefs.current[id]);
          delete intervalRefs.current[id];
          // Clean up Firebase: delete active doc, mark as used
          const user = auth.currentUser;
          if (user) {
            deleteDoc(doc(db, 'users', user.uid, 'coupons', id));
            updateDoc(doc(db, 'users', user.uid), { usedCouponIds: arrayUnion(id) });
            setUsedCouponIds(prev => [...prev, id]);
          }
          return { ...prev, [id]: 0 };
        }
        return { ...prev, [id]: remaining };
      });
    }, 1000);
  }

  // ─── Called when user presses "Use" ──────────────────────────────────────
  async function startTimer(id: string) {
    setTimers(prev => ({ ...prev, [id]: 3600 }));
    runInterval(id);

    // Persist to Firebase (best-effort — works offline via Firestore queue)
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid, 'coupons', id), {
          activatedAt: serverTimestamp(),
        });
      }
    } catch {
      // Continue with local timer if Firebase write fails
    }
  }

  const filtered = allCoupons
    .filter(c => !c.oneTime || !usedCouponIds.includes(c.id))
    .filter(c => restaurant === 'All' ? true : c.restaurant === 'All' || c.restaurant === restaurant);

  const welcome  = filtered.filter(c => c.type === 'welcome');
  const seasonal = filtered.filter(c => c.type === 'seasonal');
  const always   = filtered.filter(c => c.type === 'always');

  if (!user) return (
    <View style={{ flex: 1 }}>
      <AuthGate />
      <BackButton tint="dark" onPress={handleBack} />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.scroll}>
      <View style={[styles.container, { paddingTop: insets.top + 56 }]}>
        <Text style={styles.title}>{t('coupons.title')}</Text>
        <Text style={styles.subTitle}>{t('coupons.subtitle')}</Text>
      </View>

      {/* ── Filter ── */}
      <View style={styles.filterWrapper}>
        <View style={styles.card}>
          <View style={styles.filterRow}>
            <Text style={styles.filterTitle}>{t('coupons.filter_title')}</Text>
            <Pressable onPress={() => setRestaurant('All')}>
              <Text style={styles.resetBtn}>{t('coupons.filter_reset')}</Text>
            </Pressable>
          </View>
          <Text style={styles.segmentLabel}>{t('coupons.segment_label')}</Text>
          <View style={styles.segmentRow}>
            {(['All', 'Senator', 'Balkon'] as const).map((r) => (
              <Pressable
                key={r}
                style={[styles.segmentBtn, restaurant === r && styles.segmentBtnActive]}
                onPress={() => setRestaurant(r)}
              >
                <Text style={[styles.segmentBtnText, restaurant === r && styles.segmentBtnTextActive]}>
                  {r === 'All' ? t('coupons.segment_all') : r}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* ── Coupon sections ── */}
      <View style={styles.couponsWrapper}>
        <CouponSection
          titleKey="coupons.section_welcome"
          subtitleKey="coupons.section_welcome_sub"
          items={welcome}
          timers={timers}
          onUse={startTimer}
        />
        <CouponSection
          titleKey="coupons.section_seasonal"
          subtitleKey="coupons.section_seasonal_sub"
          items={seasonal}
          timers={timers}
          onUse={startTimer}
        />
        <CouponSection
          titleKey="coupons.section_always"
          subtitleKey="coupons.section_always_sub"
          items={always}
          timers={timers}
          onUse={startTimer}
        />
      </View>
    </ScrollView>
      <BackButton tint="dark" onPress={handleBack} />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: BrandColors.white,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: BrandColors.navy,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(11,27,46,0.65)',
    marginTop: 4,
  },
  filterWrapper: {
    paddingHorizontal: 18,
    marginTop: 16,
  },
  card: {
    backgroundColor: BrandColors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(11,27,46,0.10)',
    padding: 16,
    shadowColor: BrandColors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.navy,
  },
  resetBtn: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(11,27,46,0.65)',
  },
  segmentLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(11,27,46,0.55)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 8,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(11,27,46,0.10)',
    backgroundColor: 'rgba(11,27,46,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: BrandColors.navy,
    borderColor: 'rgba(201,165,106,0.45)',
  },
  segmentBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(11,27,46,0.78)',
  },
  segmentBtnTextActive: {
    color: BrandColors.white,
  },
  couponsWrapper: {
    paddingHorizontal: 18,
    marginTop: 20,
    gap: 20,
    paddingBottom: 110,
  },
  sectionTitles: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.navy,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(11,27,46,0.65)',
    marginTop: 2,
  },
  couponsSection: {
    gap: 12,
  },
  coupon: {
    backgroundColor: BrandColors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(11,27,46,0.10)',
    padding: 16,
    shadowColor: BrandColors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  couponFilter: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  couponPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(201,165,106,0.45)',
    backgroundColor: 'rgba(201,165,106,0.12)',
  },
  couponPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.navy,
  },
  couponTypePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(11,27,46,0.12)',
    backgroundColor: 'rgba(11,27,46,0.06)',
  },
  couponTypePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.navy,
  },
  couponOneTimePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(11,27,46,0.12)',
    backgroundColor: 'rgba(11,27,46,0.03)',
  },
  couponOneTimePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(11,27,46,0.70)',
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.navy,
    marginTop: 10,
  },
  couponDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(11,27,46,0.72)',
    marginTop: 6,
    lineHeight: 18,
  },
  couponDivider: {
    height: 1,
    backgroundColor: 'rgba(11,27,46,0.08)',
    marginVertical: 12,
  },
  couponTerms: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(11,27,46,0.62)',
    lineHeight: 17,
  },
  couponTermsLabel: {
    fontWeight: '700',
    color: 'rgba(11,27,46,0.75)',
  },

  /* Use button */
  useBtn: {
    height: 50,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(201,165,106,0.55)',
    backgroundColor: BrandColors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  useBtnText: {
    color: BrandColors.gold,
    fontWeight: '700',
    fontSize: 14,
  },

  /* Timer display (replaces button while countdown is running) */
  timerDisplay: {
    height: 50,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(201,165,106,0.55)',
    backgroundColor: 'rgba(201,165,106,0.08)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  timerText: {
    color: BrandColors.navy,
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 1,
  },

  /* Expired / used state */
  expiredBadge: {
    height: 50,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(11,27,46,0.12)',
    backgroundColor: 'rgba(11,27,46,0.04)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  expiredText: {
    color: 'rgba(11,27,46,0.4)',
    fontWeight: '700',
    fontSize: 14,
  },
});
