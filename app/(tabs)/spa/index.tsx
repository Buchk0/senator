import { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageViewing from 'react-native-image-viewing';
import { ImageViewerHeader } from '@/components/image-viewer-header';
import { BrandColors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BackButton } from '@/components/navigation/back-button';
import { useContactActions } from '@/hooks/use-contact-actions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NAV_DARK = '#1a2035';

const PHOTO_GAP = 8;
const PHOTO_H_PAD = 16;
const PHOTO_SIZE = (SCREEN_WIDTH - PHOTO_H_PAD * 2 - PHOTO_GAP * 2) / 3;

const SPA_PHOTOS = [
    require('@/assets/images/spa/spa-photo-1.jpg'),
    require('@/assets/images/spa/spa-photo-2.jpg'),
    require('@/assets/images/spa/spa-photo-3.jpg'),
    require('@/assets/images/spa/spa-photo-4.jpg'),
    require('@/assets/images/spa/spa-photo-5.jpg'),
];

const SPA_PHOTOS_FOR_VIEWER = SPA_PHOTOS.map((src) => ({
    uri: Image.resolveAssetSource(src).uri,
}));

const PRICE_REGULAR = '40 000 ₸';
const PRICE_HOTEL_GUESTS = '30 000 ₸';

const FEATURES = ['hammam', 'sauna', 'pool', 'lounge'] as const;

type TabKey = 'info' | 'photos';

export default function SpaScreen() {
    const insets = useSafeAreaInsets();
    const { t, i18n } = useTranslation();
    // Tab buttons always stay in English, like the navbar
    const tEn = i18n.getFixedT('en');
    const [activeTab, setActiveTab] = useState<TabKey>('info');
    const [viewerIndex, setViewerIndex] = useState(0);
    const [viewerVisible, setViewerVisible] = useState(false);

    const { showContactAlert } = useContactActions();
    const handleBook = () => showContactAlert(t('spa.book_btn'));

    const TABS: { key: TabKey; label: string }[] = [
        { key: 'info',   label: tEn('spa.tab_info') },
        { key: 'photos', label: tEn('spa.tab_photos') },
    ];

    return (
        <View style={styles.root}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: BrandColors.white }}>

                {/* ─── Hero ─── */}
                <ImageBackground
                    source={require('@/assets/images/spa/spa-hero.jpg')}
                    style={styles.hero}
                    resizeMode="cover"
                >
                    <View style={styles.heroOverlay} />

                    <View style={[styles.logoWrap, { top: insets.top + 16 }]}>
                        <Image
                            source={require('@/assets/images/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>{t('spa.title')}</Text>
                        <Text style={styles.heroSub}>{t('spa.subtitle')}</Text>
                    </View>
                </ImageBackground>

                {/* ─── Tab pills ─── */}
                <View style={styles.tabsRow}>
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            onPress={() => setActiveTab(tab.key)}
                            style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ─── Info ─── */}
                {activeTab === 'info' && (
                    <View style={styles.infoWrap}>
                        <View style={styles.scheduleCard}>
                            <Text style={styles.scheduleTitle}>{t('spa.hours_title')}</Text>
                            <View style={styles.scheduleDivider} />
                            <View style={styles.scheduleRow}>
                                <Text style={styles.scheduleDay}>{t('spa.hours_daily')}</Text>
                                <Text style={styles.scheduleTime}>{t('spa.hours_time')}</Text>
                            </View>
                        </View>

                        <View style={styles.priceRow}>
                            <View style={styles.priceBox}>
                                <Text style={styles.priceValue}>{PRICE_REGULAR}</Text>
                            </View>
                            <View style={styles.priceBox}>
                                <Text style={styles.priceLabel}>{t('spa.price_hotel_guests')}</Text>
                                <Text style={styles.priceValue}>{PRICE_HOTEL_GUESTS}</Text>
                            </View>
                        </View>

                        <Text style={styles.bookingNote}>{t('spa.booking_note')}</Text>

                        <View style={styles.featuresGrid}>
                            {FEATURES.map((feature) => (
                                <View key={feature} style={styles.featureCard}>
                                    <View style={styles.featureIconWrap}>
                                        <MaterialIcons name="star-border" size={15} color={BrandColors.navy} />
                                    </View>
                                    <Text style={styles.featureTitle} numberOfLines={2}>{t(`spa.features.${feature}`)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* ─── Photos ─── */}
                {activeTab === 'photos' && (
                    <View style={styles.photosWrap}>
                        {SPA_PHOTOS.map((img, i) => (
                            <TouchableOpacity key={i} onPress={() => { setViewerIndex(i); setViewerVisible(true); }}>
                                <Image source={img} style={styles.photo} resizeMode="cover" />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <ImageViewing
                    images={SPA_PHOTOS_FOR_VIEWER}
                    imageIndex={viewerIndex}
                    visible={viewerVisible}
                    onRequestClose={() => setViewerVisible(false)}
                    HeaderComponent={() => <ImageViewerHeader onClose={() => setViewerVisible(false)} />}
                />

                <View style={{ height: 90 }} />
            </ScrollView>

            <View style={styles.reserveBar}>
                <TouchableOpacity style={styles.reserveBtn} activeOpacity={0.85} onPress={handleBook}>
                    <Text style={styles.reserveText}>{t('spa.book_btn')}</Text>
                </TouchableOpacity>
            </View>

            <BackButton tint="dark" />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: BrandColors.white,
    },

    /* ── Hero ── */
    hero: {
        minHeight: 280,
        justifyContent: 'flex-end',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.52)',
    },
    logoWrap: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    logo: {
        width: 72,
        height: 40,
    },
    heroContent: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: BrandColors.white,
        marginBottom: 8,
    },
    heroSub: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(255,255,255,0.75)',
        letterSpacing: 0.3,
        lineHeight: 18,
    },

    /* ── Tabs ── */
    tabsRow: {
        flexDirection: 'row',
        backgroundColor: BrandColors.white,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 10,
        gap: 8,
    },
    tabBtn: {
        flex: 1,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBtnActive: {
        backgroundColor: NAV_DARK,
    },
    tabLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#888',
    },
    tabLabelActive: {
        color: BrandColors.white,
    },

    /* ── Info ── */
    infoWrap: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
    },
    scheduleCard: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 16,
        padding: 20,
    },
    scheduleTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: BrandColors.navy,
        marginBottom: 16,
    },
    scheduleDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#e5e5e5',
        marginBottom: 16,
    },
    scheduleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scheduleDay: {
        fontSize: 14,
        fontWeight: '500',
        color: BrandColors.navy,
    },
    scheduleTime: {
        fontSize: 14,
        fontWeight: '400',
        color: '#666',
    },
    priceRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
    },
    priceBox: {
        flex: 1,
        height: 54,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    priceLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: BrandColors.navy,
    },
    priceValue: {
        fontSize: 14,
        fontWeight: '700',
        color: BrandColors.navy,
    },
    bookingNote: {
        fontSize: 12,
        fontWeight: '700',
        color: BrandColors.navy,
        textAlign: 'center',
        marginTop: 14,
        marginBottom: 14,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 14,
    },
    featureCard: {
        width: '48%',
        // Fixed height so every tile is the same size, whether its label is one line or two
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: BrandColors.white,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(11,27,46,0.08)',
        paddingHorizontal: 10,
        shadowColor: BrandColors.navy,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 3,
    },
    featureIconWrap: {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: '#f4efe4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureTitle: {
        flex: 1,
        fontSize: 12,
        fontWeight: '400',
        color: BrandColors.navy,
        lineHeight: 15,
    },

    /* ── Photos ── */
    photosWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: PHOTO_GAP,
        paddingHorizontal: PHOTO_H_PAD,
        paddingTop: 20,
        paddingBottom: 20,
    },
    photo: {
        width: PHOTO_SIZE,
        height: PHOTO_SIZE,
        borderRadius: 12,
    },

    /* ── Reserve button ── */
    reserveBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: BrandColors.white,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 10,
    },
    reserveBtn: {
        backgroundColor: NAV_DARK,
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: 'center',
    },
    reserveText: {
        fontSize: 15,
        fontWeight: '700',
        color: BrandColors.gold,
        letterSpacing: 0.4,
    },
});
