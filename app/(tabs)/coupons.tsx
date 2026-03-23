import {View, Text, StyleSheet, ScrollView, Pressable} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandColors } from '@/constants/theme';
import {useState} from "react";
import {coupons} from "@/constants/coupons-data";

export default function CouponsTab() {
  const insets = useSafeAreaInsets();
    const [restaurant, setRestaurant] = useState<'All' | 'Senator' | 'Balkon'>('All')
    const filtered = coupons.filter(c =>
        restaurant === 'All' ? true : c.restaurant === 'All' || c.restaurant === restaurant
    )
    const welcome  = filtered.filter(c => c.type === 'welcome')
    const seasonal = filtered.filter(c => c.type === 'seasonal')
    const always   = filtered.filter(c => c.type === 'always')

  return (
    <ScrollView style={styles.scroll}>
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Text style={styles.title}>Coupons</Text>
            <Text style={styles.subTitle}>Welcome, seasonal and permanent coupons.</Text>
        </View>

        <View style={styles.filterWrapper}>
            <View style={styles.card}>
                <View style={styles.filterRow}>
                    <Text style={styles.filterTitle}>Filter</Text>
                    <Pressable onPress={() => setRestaurant('All')}>
                        <Text style={styles.resetBtn}>Reset</Text>
                    </Pressable>
                </View>
                <Text style={styles.segmentLabel}>Restaurant</Text>
                <View style={styles.segmentRow}>
                    <Pressable
                        style={[styles.segmentBtn, restaurant === 'All' && styles.segmentBtnActive]}
                        onPress={() => setRestaurant('All')}
                    >
                        <Text style={[styles.segmentBtnText, restaurant === 'All' && styles.segmentBtnTextActive]}>All</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.segmentBtn, restaurant === 'Senator' && styles.segmentBtnActive]}
                        onPress={() => setRestaurant('Senator')}
                    >
                        <Text style={[styles.segmentBtnText, restaurant === 'Senator' && styles.segmentBtnTextActive]}>Senator</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.segmentBtn, restaurant === 'Balkon' && styles.segmentBtnActive]}
                        onPress={() => setRestaurant('Balkon')}
                    >
                        <Text style={[styles.segmentBtnText, restaurant === 'Balkon' && styles.segmentBtnTextActive]}>Balkon</Text>
                    </Pressable>
                </View>
            </View>
        </View>

        <View style={styles.couponsWrapper}>
            {welcome.length > 0 && (
                <View>
                    <View style={styles.sectionTitles}>
                        <Text style={styles.sectionTitle}>Welcome</Text>
                        <Text style={styles.sectionSubtitle}>Coupons for new guests</Text>
                    </View>
                    <View style={styles.couponsSection}>
                        {welcome.map((c) => (
                            <View style={styles.coupon} key={c.id}>
                                <View style={styles.couponFilter}>
                                    <View style={styles.couponPill}>
                                        <Text style={styles.couponPillText}>{c.restaurant}</Text>
                                    </View>
                                    <View style={styles.couponTypePill}>
                                        <Text style={styles.couponTypePillText}>{c.expiresText ?? '—'}</Text>
                                    </View>
                                    {c.oneTime && (
                                        <View style={styles.couponOneTimePill}>
                                            <Text style={styles.couponOneTimePillText}>1 time</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.couponTitle}>{c.emoji} {c.title}</Text>
                                <Text style={styles.couponDesc}>{c.description}</Text>
                                <View style={styles.couponDivider} />
                                <Text style={styles.couponTerms}>
                                    <Text style={styles.couponTermsLabel}>Terms: </Text>
                                    {c.terms}
                                </Text>
                                <Pressable style={styles.useBtn}>
                                    <Text style={styles.useBtnText}>Use</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {seasonal.length > 0 && (
                <View>
                    <View style={styles.sectionTitles}>
                        <Text style={styles.sectionTitle}>Seasonal</Text>
                        <Text style={styles.sectionSubtitle}>Updated every 2–3 months</Text>
                    </View>
                    <View style={styles.couponsSection}>
                        {seasonal.map((c) => (
                            <View style={styles.coupon} key={c.id}>
                                <View style={styles.couponFilter}>
                                    <View style={styles.couponPill}>
                                        <Text style={styles.couponPillText}>{c.restaurant}</Text>
                                    </View>
                                    <View style={styles.couponTypePill}>
                                        <Text style={styles.couponTypePillText}>{c.expiresText ?? '—'}</Text>
                                    </View>
                                    {c.oneTime && (
                                        <View style={styles.couponOneTimePill}>
                                            <Text style={styles.couponOneTimePillText}>1 time</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.couponTitle}>{c.emoji} {c.title}</Text>
                                <Text style={styles.couponDesc}>{c.description}</Text>
                                <View style={styles.couponDivider} />
                                <Text style={styles.couponTerms}>
                                    <Text style={styles.couponTermsLabel}>Terms: </Text>
                                    {c.terms}
                                </Text>
                                <Pressable style={styles.useBtn}>
                                    <Text style={styles.useBtnText}>Use</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {always.length > 0 && (
                <View>
                    <View style={styles.sectionTitles}>
                        <Text style={styles.sectionTitle}>Always Available</Text>
                        <Text style={styles.sectionSubtitle}>Permanent coupons</Text>
                    </View>
                    <View style={styles.couponsSection}>
                        {always.map((c) => (
                            <View style={styles.coupon} key={c.id}>
                                <View style={styles.couponFilter}>
                                    <View style={styles.couponPill}>
                                        <Text style={styles.couponPillText}>{c.restaurant}</Text>
                                    </View>
                                    <View style={styles.couponTypePill}>
                                        <Text style={styles.couponTypePillText}>{c.expiresText ?? '—'}</Text>
                                    </View>
                                    {c.oneTime && (
                                        <View style={styles.couponOneTimePill}>
                                            <Text style={styles.couponOneTimePillText}>1 time</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.couponTitle}>{c.emoji} {c.title}</Text>
                                <Text style={styles.couponDesc}>{c.description}</Text>
                                <View style={styles.couponDivider} />
                                <Text style={styles.couponTerms}>
                                    <Text style={styles.couponTermsLabel}>Terms: </Text>
                                    {c.terms}
                                </Text>
                                <Pressable style={styles.useBtn}>
                                    <Text style={styles.useBtnText}>Use</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    </ScrollView>
  );
}

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
});
