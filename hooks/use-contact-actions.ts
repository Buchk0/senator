import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

const PHONE_DISPLAY = '+7 777 777 77 77';
const PHONE_TEL = 'tel:+7777777777';
const WHATSAPP_URL = 'https://wa.me/77777777777';

export function useContactActions() {
  const { t } = useTranslation();

  const showContactAlert = useCallback((title?: string) => {
    Alert.alert(
      title ?? '',
      undefined,
      [
        { text: `${t('common.call')} ${PHONE_DISPLAY}`, onPress: () => Linking.openURL(PHONE_TEL) },
        { text: t('common.whatsapp'), onPress: () => Linking.openURL(WHATSAPP_URL) },
        { text: t('common.cancel'), style: 'cancel' },
      ],
      { cancelable: true }
    );
  }, [t]);

  return { showContactAlert };
}
