import { useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, Alert, Pressable, Keyboard } from "react-native";
import { signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth, firebaseConfig } from "@/constants/firebase";
import { router } from "expo-router";
import { BrandColors } from "@/constants/theme";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/hooks/use-language";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BlurView } from "expo-blur";
import PhoneInput from "react-native-phone-number-input";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

const getFlagEmoji = (code: string) =>
    code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

export default function Login() {
    const phoneInput = useRef<PhoneInput>(null);
    const [formattedPhone, setFormattedPhone] = useState('');
    const [loginStep, setLoginStep] = useState<'phone' | 'otp'>('phone');
    const [otp, setOtp] = useState('');
    const [loginConfirmation, setLoginConfirmation] = useState<ConfirmationResult | null>(null);
    const recaptchaVerifier = useRef<any>(null);
    const { activeLanguage, changeLanguage } = useLanguage();
    const insets = useSafeAreaInsets();

    const handleSendCode = async () => {
        if (!formattedPhone) return Alert.alert('Ошибка', 'Введите номер телефона');
        if (!recaptchaVerifier.current) return;
        try {
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier.current);
            setLoginConfirmation(confirmation);
            setLoginStep('otp');
        } catch (e: any) {
            Alert.alert('Ошибка', e?.message ?? 'Не удалось отправить код');
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || !loginConfirmation) return;
        try {
            await loginConfirmation.confirm(otp);
            router.replace("/(tabs)");
        } catch {
            Alert.alert('Ошибка', 'Неверный код');
        }
    };

    return (
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
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
            <View style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>

                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <View style={styles.langSwitcher}>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <TouchableOpacity
                            key={lang}
                            style={[styles.langBtn, activeLanguage === lang && styles.langBtnActive]}
                            onPress={() => changeLanguage(lang)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.langText, activeLanguage === lang && styles.langTextActive]}>
                                {lang.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {loginStep === 'phone' ? (
                    <>
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

                        <TouchableOpacity style={styles.btnOuter} onPress={handleSendCode} activeOpacity={0.8}>
                            <View style={styles.btnInner}>
                                <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
                                <Text style={styles.btnText}>Получить код</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/auth/register')} activeOpacity={0.7}>
                            <Text style={styles.registerLink}>нет аккаунта?</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.otpHint}>Введите код из SMS</Text>

                        <View style={styles.inputRow}>
                            <MaterialIcons name="sms" size={20} color={BrandColors.gold} style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                value={otp}
                                onChangeText={setOtp}
                                placeholder="— — — — — —"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                keyboardType="number-pad"
                                maxLength={6}
                            />
                        </View>

                        <TouchableOpacity style={styles.btnOuter} onPress={handleVerifyOtp} activeOpacity={0.8}>
                            <View style={styles.btnInner}>
                                <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
                                <Text style={styles.btnText}>Войти</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { setLoginStep('phone'); setOtp(''); }} activeOpacity={0.7}>
                            <Text style={styles.registerLink}>← Изменить номер</Text>
                        </TouchableOpacity>
                    </>
                )}

            </View>
        </ImageBackground>
        </Pressable>
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
        marginBottom: 16,
    },
    langSwitcher: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: BrandColors.gold,
        padding: 6,
        alignSelf: 'center',
        marginBottom: 8,
    },
    langBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 50,
    },
    langBtnActive: {
        backgroundColor: BrandColors.white,
    },
    langText: {
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
        fontSize: 13,
    },
    langTextActive: {
        color: '#1a2035',
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
    otpHint: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        textAlign: 'center',
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
});
