import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BrandColors } from '@/constants/theme';

interface PriceRow {
  name: string;
  nameRu: string;
  note?: string;
  price: string;
}

const MAIN_PRICES: PriceRow[] = [
  { name: 'Standard single room', nameRu: 'Стандартный одноместный', price: '80 000' },
  { name: 'Standard double room', nameRu: 'Стандартный двухместный', price: '90 000' },
  { name: 'Standard twin room', nameRu: 'Стандартный двухместный с двумя кроватями', note: 'Одноместное размещение', price: '90 000' },
  { name: 'Standard twin room', nameRu: 'Стандартный двухместный с двумя кроватями', note: 'Двухместное размещение', price: '100 000' },
  { name: 'Deluxe single room', nameRu: 'Делюкс одноместный', price: '100 000' },
  { name: 'Deluxe double room', nameRu: 'Делюкс двухместный', price: '110 000' },
  { name: 'Deluxe twin room', nameRu: 'Делюкс двухместный с двумя кроватями', note: 'Одноместное размещение', price: '110 000' },
  { name: 'Deluxe twin room', nameRu: 'Делюкс двухместный с двумя кроватями', note: 'Двухместное размещение', price: '120 000' },
  { name: 'Premium deluxe', nameRu: 'Улучшенный делюкс', price: '140 000' },
  { name: 'Executive suite', nameRu: 'Представительский люкс', price: '239 000' },
  { name: 'Presidential suite', nameRu: 'Президентский люкс', price: '269 000' },
];

const EXTRA_PRICES: PriceRow[] = [
  { name: 'Standard room for people with disabilities', nameRu: 'Стандартный номер для людей с ограниченными возможностями', price: '80 000' },
  { name: 'Family room', nameRu: 'Семейный номер', price: '200 000' },
];

const BORDER_COLOR = 'rgba(198, 156, 109, 0.5)';
const NAVY = '#1a2035';

function PriceTable({ rows }: { rows: PriceRow[] }) {
  const { t } = useTranslation();

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={styles.headerLabel}>{t('hotel.prices.category')}</Text>
        <Text style={styles.headerLabel}>{t('hotel.prices.cost')}</Text>
      </View>

      {rows.map((row, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.rowName}>{row.name} /</Text>
            <Text style={styles.rowNameRu}>{row.nameRu}</Text>
            {row.note && <Text style={styles.rowNote}>({row.note})</Text>}
          </View>
          <Text style={styles.rowPrice}>{row.price}</Text>
        </View>
      ))}
    </View>
  );
}

export function HotelPrices() {
  const { t } = useTranslation();

  return (
    <View>
      <PriceTable rows={MAIN_PRICES} />
      <Text style={styles.sectionTitle}>{t('hotel.prices.extra_categories')}</Text>
      <PriceTable rows={EXTRA_PRICES} />
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: BrandColors.gold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 46,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER_COLOR,
  },
  rowText: {
    flex: 1,
  },
  rowName: {
    fontSize: 12,
    fontWeight: '700',
    color: NAVY,
    lineHeight: 16,
  },
  rowNameRu: {
    fontSize: 12,
    fontWeight: '400',
    color: NAVY,
    lineHeight: 16,
  },
  rowNote: {
    fontSize: 9,
    fontStyle: 'italic',
    color: NAVY,
    lineHeight: 13,
  },
  rowPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: BrandColors.gold,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.gold,
    marginTop: 20,
    marginBottom: 14,
  },
});
