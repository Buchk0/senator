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
    Linking,
} from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { BrandColors } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { spaCategories, spaTreatments } from '@/constants/spa-data';
import { Header } from '@/components/home/header';
import { useLanguage } from '@/hooks/use-language';

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

type TabKey = 'services' | 'photos' | 'price';

export default function SpaScreen() {
    const { t } = useTranslation();
    const { activeLanguage, changeLanguage } = useLanguage();
    const [activeTab, setActiveTab] = useState<TabKey>('services');
    const [viewerIndex, setViewerIndex] = useState(0);
    const [viewerVisible, setViewerVisible] = useState(false);

    const TABS: { key: TabKey; label: string }[] = [
        { key: 'services', label: t('spa.tab_services') },
        { key: 'photos',   label: t('spa.tab_photos') },
        { key: 'price',    label: t('spa.tab_price') },
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

                    <Header
                        activeLanguage={activeLanguage}
                        onLanguageChange={changeLanguage}
                    />

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

                {/* ─── Services ─── */}
                {activeTab === 'services' && (
                    <View style={styles.servicesWrap}>
                        <Text style={styles.sectionTitle}>{t('spa.section_categories')}</Text>
                        <View style={styles.servicesGrid}>
                            {spaCategories.map(c => (
                                <View key={c.id} style={styles.categoryCard}>
                                    <View style={styles.cardTitleContainer}>
                                        <View style={styles.cardIconWrap}>
                                            <MaterialIcons name="star" size={13} color={BrandColors.navy} />
                                        </View>
                                        <Text style={styles.cardTitle}>{t(`spa.categories.${c.id}.title`)}</Text>
                                    </View>
                                    <Text style={styles.cardDescription}>{t(`spa.categories.${c.id}.subtitle`)}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.treatmentsWrap}>
                            <Text style={styles.sectionTitle}>{t('spa.section_treatments')}</Text>
                            {spaTreatments.map(c => (
                                <View key={c.id} style={styles.treatmentCard}>
                                    <Image source={c.image} style={styles.treatmentImage} resizeMode="cover" />
                                    <View style={styles.treatmentBody}>
                                        <View style={styles.treatmentTitleRow}>
                                            <Text style={styles.treatmentTitle}>{c.title}</Text>
                                            <View style={styles.pricePill}>
                                                <Text style={styles.priceText}>{t('spa.price_from')} {c.priceFrom.toLocaleString()} Т</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.treatmentDuration}>{c.duration} {t('spa.min')}</Text>
                                        <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85} onPress={() => Linking.openURL('tel:+7777777777')}>
                                            <Text style={styles.bookBtnText}>{t('spa.book_btn')}</Text>
                                        </TouchableOpacity>
                                    </View>
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
                />

                {/* ─── Price ─── */}
                {activeTab === 'price' && (
                    <View style={styles.infoWrap}>
                        <View style={styles.scheduleCard}>
                            <Text style={styles.scheduleTitle}>{t('spa.hours_title')}</Text>
                            <View style={styles.scheduleDivider} />
                            <View style={[styles.scheduleRow, { marginBottom: 0 }]}>
                                <Text style={styles.scheduleDay}>{t('spa.hours_daily')}</Text>
                                <Text style={styles.scheduleTime}>{t('spa.hours_time')}</Text>
                            </View>
                        </View>
                    </View>
                )}

                <View style={{ height: 90 }} />
            </ScrollView>
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
        justifyContent: 'space-between',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.52)',
    },
    heroContent: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '400',
        color: BrandColors.white,
        marginBottom: 8,
    },
    heroSub: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(255,255,255,0.65)',
        letterSpacing: 0.3,
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
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
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

    /* ── Services ── */
    servicesWrap: {
        paddingHorizontal: 16,
        paddingTop: 24,
        backgroundColor: BrandColors.white,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: BrandColors.navy,
        marginBottom: 16,
    },

    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryCard: {
        width: '48%',
        minHeight: 110,
        backgroundColor: BrandColors.white,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(11,27,46,0.08)',
        padding: 14,
        shadowColor: BrandColors.navy,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 3,
    },
    cardTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIconWrap: {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: '#f4efe4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: BrandColors.navy,
        marginBottom: 10,
        marginLeft: 4,
    },
    cardDescription: {
        fontSize: 12,
        fontWeight: '400',
        color: BrandColors.navy,
        lineHeight: 17,
    },

    /* ── Treatments ── */
    treatmentsWrap: {
        marginTop: 28,
    },
    treatmentCard: {
        backgroundColor: BrandColors.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(11,27,46,0.08)',
        marginBottom: 16,
        shadowColor: BrandColors.navy,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 3,
    },
    treatmentImage: {
        width: '100%',
        height: 140,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    treatmentBody: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
        gap: 10,
    },
    treatmentTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    treatmentTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: BrandColors.navy,
        flexShrink: 1,
        marginRight: 8,
    },
    pricePill: {
        backgroundColor: '#F5EFE0',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    priceText: {
        fontSize: 11,
        fontWeight: '700',
        color: BrandColors.gold,
    },
    treatmentDuration: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(11,27,46,0.55)',
    },
    bookBtn: {
        backgroundColor: NAV_DARK,
        borderRadius: 50,
        paddingVertical: 10,
        alignItems: 'center',
    },
    bookBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: BrandColors.gold,
        letterSpacing: 0.3,
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

    /* ── Info ── */
    infoWrap: {
        paddingHorizontal: 16,
        paddingTop: 24,
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
        marginBottom: 12,
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

    /* ── Reserve button ── */
    reserveBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 12,
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
