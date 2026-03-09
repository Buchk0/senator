import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { BrandColors } from '@/constants/theme';

export interface Country {
    flag: string;
    name: string;
    dialCode: string;
}

export const COUNTRIES: Country[] = [
    { flag: '🇰🇿', name: 'Казахстан', dialCode: '+7' },
    { flag: '🇷🇺', name: 'Россия', dialCode: '+7' },
    { flag: '🇺🇿', name: 'Узбекистан', dialCode: '+998' },
    { flag: '🇰🇬', name: 'Кыргызстан', dialCode: '+996' },
    { flag: '🇹🇯', name: 'Таджикистан', dialCode: '+992' },
    { flag: '🇹🇲', name: 'Туркменистан', dialCode: '+993' },
    { flag: '🇦🇿', name: 'Азербайджан', dialCode: '+994' },
    { flag: '🇺🇦', name: 'Украина', dialCode: '+380' },
    { flag: '🇧🇾', name: 'Беларусь', dialCode: '+375' },
    { flag: '🇬🇧', name: 'Великобритания', dialCode: '+44' },
    { flag: '🇺🇸', name: 'США', dialCode: '+1' },
    { flag: '🇩🇪', name: 'Германия', dialCode: '+49' },
    { flag: '🇹🇷', name: 'Турция', dialCode: '+90' },
    { flag: '🇨🇳', name: 'Китай', dialCode: '+86' },
];

interface Props {
    selected: Country;
    onSelect: (country: Country) => void;
}

export function CountryCodePicker({ selected, onSelect }: Props) {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)} activeOpacity={0.7}>
                <Text style={styles.flag}>{selected.flag}</Text>
                <Text style={styles.code}>{selected.dialCode}</Text>
                <Text style={styles.arrow}>▾</Text>
            </TouchableOpacity>
            <View style={styles.divider} />

            <Modal visible={visible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Выберите страну</Text>
                            <TouchableOpacity onPress={() => setVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Text style={styles.closeBtn}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={COUNTRIES}
                            keyExtractor={(_, i) => String(i)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.countryRow,
                                        item.flag === selected.flag && styles.countryRowActive,
                                    ]}
                                    onPress={() => { onSelect(item); setVisible(false); }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.countryFlag}>{item.flag}</Text>
                                    <Text style={styles.countryName}>{item.name}</Text>
                                    <Text style={styles.countryCode}>{item.dialCode}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingRight: 12,
    },
    flag: {
        fontSize: 20,
    },
    code: {
        color: BrandColors.white,
        fontSize: 15,
        fontWeight: '500',
    },
    arrow: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.35)',
        marginRight: 12,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalSheet: {
        backgroundColor: '#1a2035',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
        paddingBottom: 32,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    modalTitle: {
        color: BrandColors.white,
        fontSize: 17,
        fontWeight: '600',
    },
    closeBtn: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 18,
    },
    countryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    countryRowActive: {
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    countryFlag: {
        fontSize: 24,
    },
    countryName: {
        flex: 1,
        color: BrandColors.white,
        fontSize: 15,
    },
    countryCode: {
        color: BrandColors.gold,
        fontSize: 15,
        fontWeight: '500',
    },
});
