import { useState } from "react";
import { confirmationResult, storedPassword, storedName, storedSurname, storedBirthDate, storedPhone } from "@/constants/auth-store";
import { router } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Keyboard, Alert } from "react-native";
import { BrandColors } from "@/constants/theme";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/constants/firebase";
import { doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import nativeAuth from "@react-native-firebase/auth";

export default function Verify() {
    const [code, setCode] = useState<string>('')
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!confirmationResult) return;
        if (code.length < 6) return Alert.alert('Ошибка', 'Введите 6-значный код');

        setLoading(true);
        try {
            // Confirm OTP via native Firebase auth
            await confirmationResult.confirm(code);

            // Sign out of native auth — we only needed it for OTP
            await nativeAuth().signOut();

            // Create the actual account via JS SDK (email/password)
            const generatedEmail = `${storedPhone.replace(/[^0-9]/g, '')}@senator.kz`;
            const credential = await createUserWithEmailAndPassword(auth, generatedEmail, storedPassword);

            // Fetch welcome coupons
            const welcomeSnap = await getDocs(
                query(collection(db, 'coupons'), where('type', '==', 'welcome'), where('active', '==', true))
            );
            const welcomeCouponIds = welcomeSnap.docs.map(d => d.id);

            // Save profile to Firestore
            await setDoc(doc(db, "users", credential.user.uid), {
                name: storedName,
                surname: storedSurname,
                birthDate: storedBirthDate,
                phone: storedPhone,
                usedCouponIds: [],
                welcomeCouponIds,
            });

            router.replace("/(tabs)");
        } catch (e: any) {
            if (e?.code === 'auth/invalid-verification-code') {
                Alert.alert('Ошибка', 'Неверный код. Попробуйте ещё раз.');
            } else if (e?.code === 'auth/email-already-in-use') {
                Alert.alert('Ошибка', 'Этот номер уже зарегистрирован');
            } else {
                Alert.alert('Ошибка', e?.message ?? 'Не удалось подтвердить код');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Pressable style={styles.root} onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.inner}>
                <Text style={styles.title}>Подтверждение</Text>
                <Text style={styles.subtitle}>Введите код из SMS, отправленного на ваш номер</Text>

                <Text style={styles.label}>Код из SMS</Text>
                <TextInput
                    style={styles.input}
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    placeholder="— — — — — —"
                    placeholderTextColor="#aaa"
                    maxLength={6}
                />

                <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleVerify} activeOpacity={0.85} disabled={loading}>
                    <Text style={styles.btnText}>{loading ? '...' : 'Подтвердить'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
                    <Text style={styles.backText}>← Назад</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: BrandColors.white,
    },
    inner: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 48,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a2035',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 36,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1a2035',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 22,
        color: '#1a2035',
        backgroundColor: '#f9f9f9',
        marginBottom: 20,
        textAlign: 'center',
        letterSpacing: 8,
    },
    btn: {
        backgroundColor: '#1a2035',
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    btnDisabled: {
        opacity: 0.6,
    },
    btnText: {
        color: BrandColors.gold,
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.4,
    },
    backBtn: {
        marginTop: 20,
        alignItems: 'center',
    },
    backText: {
        color: '#888',
        fontSize: 14,
    },
});
