import { useState, useRef } from "react";
import { TextInput, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Keyboard, Alert, ScrollView, Modal, ImageBackground, Image } from "react-native";
import { signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth, firebaseConfig } from "@/constants/firebase";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { router } from "expo-router";
import { setConfirmationResult, setStoredCredentials, setStoredProfile } from "@/constants/auth-store";
import { BrandColors } from "@/constants/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import PhoneInput from "react-native-phone-number-input";

const getFlagEmoji = (code: string) =>
    code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

function formatDate(date: Date): string {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
}

export default function Reg() {
    const { i18n } = useTranslation();
    const locale = i18n.language === 'kz' ? 'kk' : i18n.language;
    const insets = useSafeAreaInsets();

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [formattedPhone, setFormattedPhone] = useState('');
    const [password, setPassword] = useState('');
    const phoneInput = useRef<PhoneInput>(null);
    const recaptchaVerifier = useRef(null);
    const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

    const handleRegister = async () => {
        const generatedEmail = `${formattedPhone.replace(/[^0-9]/g, '')}@senator.kz`;

        if (!name.trim()) return Alert.alert('Ошибка', 'Введите имя');
        if (!surname.trim()) return Alert.alert('Ошибка', 'Введите фамилию');
        if (!birthDate) return Alert.alert('Ошибка', 'Введите дату рождения');
        if (!formattedPhone) return Alert.alert('Ошибка', 'Введите номер телефона');
        if (password.length < 6) return Alert.alert('Ошибка', 'Пароль должен содержать не менее 6 символов');
        if (!recaptchaVerifier.current) return;

        try {
            setStoredCredentials(formattedPhone, password);
            setStoredProfile(name, surname, formatDate(birthDate));
            const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier.current);
            setConfirmation(result);
            setConfirmationResult(result);
            router.push("/auth/verify");
        } catch (e: any) {
            Alert.alert('Ошибка', e?.message ?? 'Не удалось отправить код');
        }
    };

    return (
        <ImageBackground
            source={require('@/assets/images/restaurants-bc.png')}
            style={styles.bg}
            resizeMode="cover"
        >
            <View style={styles.overlay} />
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
                attemptInvisibleVerification={true}
            />
            <Pressable style={styles.flex} onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    contentContainerStyle={[styles.inner, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>Регистрация</Text>

                    <View style={styles.inputRow}>
                        <MaterialIcons name="person" size={20} color={BrandColors.gold} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Имя"
                            placeholderTextColor="rgba(255,255,255,0.5)"
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <MaterialIcons name="person-outline" size={20} color={BrandColors.gold} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={surname}
                            onChangeText={setSurname}
                            placeholder="Фамилия"
                            placeholderTextColor="rgba(255,255,255,0.5)"
                        />
                    </View>

                    <TouchableOpacity style={styles.inputRow} onPress={() => setShowPicker(true)} activeOpacity={0.7}>
                        <MaterialIcons name="calendar-today" size={20} color={BrandColors.gold} style={styles.icon} />
                        <Text style={birthDate ? styles.dateText : styles.datePlaceholder}>
                            {birthDate ? formatDate(birthDate) : 'Дата рождения'}
                        </Text>
                    </TouchableOpacity>

                    <Modal visible={showPicker} transparent animationType="slide">
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalSheet}>
                                <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.doneBtn}>
                                    <Text style={styles.doneBtnText}>Готово</Text>
                                </TouchableOpacity>
                                <DateTimePicker
                                    value={birthDate ?? new Date(2000, 0, 1)}
                                    mode="date"
                                    display="spinner"
                                    maximumDate={new Date()}
                                    onChange={(_, date) => { if (date) setBirthDate(date); }}
                                    style={{ width: '100%' }}
                                    textColor="#1a2035"
                                    locale={locale}
                                />
                            </View>
                        </View>
                    </Modal>

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
                            placeholder="Пароль (минимум 6 символов)"
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            maxLength={20}
                        />
                    </View>

                    <TouchableOpacity style={styles.btnOuter} onPress={handleRegister} activeOpacity={0.8}>
                        <View style={styles.btnInner}>
                            <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
                            <Text style={styles.btnText}>Получить код</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                        <Text style={styles.backLink}>уже есть аккаунт?</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
            </Pressable>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.55)',
    },
    flex: { flex: 1 },
    inner: {
        alignItems: 'center',
        paddingHorizontal: 32,
        gap: 14,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: BrandColors.white,
        marginBottom: 8,
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
    dateText: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 15,
        color: BrandColors.white,
    },
    datePlaceholder: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 15,
        color: 'rgba(255,255,255,0.5)',
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
    backLink: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        textDecorationLine: 'underline',
        marginTop: 4,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalSheet: {
        backgroundColor: BrandColors.white,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 32,
        alignItems: 'center',
    },
    doneBtn: {
        width: '100%',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    doneBtnText: {
        color: '#1a2035',
        fontSize: 16,
        fontWeight: '700',
    },
});
