import { useState } from "react";
import { confirmationResult, storedPassword, storedName, storedSurname, storedBirthDate, storedPhone } from "@/constants/auth-store";
import { router } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Keyboard, Alert } from "react-native";
import { BrandColors } from "@/constants/theme";
import { EmailAuthProvider, linkWithCredential } from "firebase/auth";
import { doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/constants/firebase";

export default function Verify() {
    const [code, setCode] = useState<string>('')

    const handleVerify = async () => {
        if (!confirmationResult) return;
        try {
            const generatedEmail = `${storedPhone.replace(/[^0-9]/g, '')}@senator.kz`;
            const result = await confirmationResult.confirm(code);
            const credential = EmailAuthProvider.credential(generatedEmail, storedPassword);
            await linkWithCredential(result.user, credential);

            // Fetch all active welcome coupon IDs to assign to the new user
            const welcomeSnap = await getDocs(
                query(collection(db, 'coupons'), where('type', '==', 'welcome'), where('active', '==', true))
            );
            const welcomeCouponIds = welcomeSnap.docs.map(d => d.id);

            await setDoc(doc(db, "users", result.user.uid), {
                name: storedName,
                surname: storedSurname,
                birthDate: storedBirthDate,
                phone: storedPhone,
                usedCouponIds: [],
                welcomeCouponIds,
            });
            router.replace("/(tabs)");
        } catch (e: any) {
            if (e?.code === 'auth/email-already-in-use') {
                Alert.alert('Ошибка', 'Этот номер уже зарегистрирован');
            } else {
                Alert.alert('Ошибка', e?.message ?? 'Не удалось подтвердить код');
            }
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

                <TouchableOpacity style={styles.btn} onPress={handleVerify} activeOpacity={0.85}>
                    <Text style={styles.btnText}>Подтвердить</Text>
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
    btnText: {
        color: BrandColors.gold,
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.4,
    },
});
