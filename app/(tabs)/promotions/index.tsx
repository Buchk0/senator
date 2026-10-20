import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { VenuePicker } from '@/components/venue-picker';

export default function PromotionsScreen() {
  const { t } = useTranslation();

  return (
    <VenuePicker
      title={t('promotions.title_full')}
      subtitle={t('promotions.subtitle')}
      venues={['senator', 'balkon', 'hotel']}
      onSelect={(venue) => router.push(`/promotions/${venue}` as any)}
    />
  );
}
