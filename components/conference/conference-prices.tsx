import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

interface PriceRow {
  id: string;
  nameKey: string;
  noteKey?: string;
  /** i18n keys, or literal values when `literalTimes` is set */
  times: string[];
  literalTimes?: boolean;
  /** Literal prices; an empty list renders the "free" label */
  prices: string[];
}

const ROWS: PriceRow[] = [
  { id: 'hall', nameKey: 'hall_rent', times: ['hours_1', 'hours_2', 'hours_3'], prices: ['40 000', '60 000', '80 000'] },
  { id: 'extra', nameKey: 'hall_rent', times: ['extra_hour'], prices: ['25 000'] },
  { id: 'day', nameKey: 'full_day', noteKey: 'full_day_note', times: ['09:00', '18:00'], literalTimes: true, prices: ['230 000'] },
  { id: 'equipment', nameKey: 'equipment', noteKey: 'equipment_note', times: [], prices: ['25 000'] },
  { id: 'vip', nameKey: 'vip_room', times: ['hours_1'], prices: ['25 000'] },
  { id: 'supplies', nameKey: 'supplies', times: [], prices: [] },
];

const NAVY = '#1a2035';

export function ConferencePrices() {
  const { t } = useTranslation();
  const tp = (key: string) => t(`conference.prices.${key}` as any) as string;

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerLabel, styles.colName]}>{tp('col_service')}</Text>
        <Text style={[styles.headerLabel, styles.colTime]}>{tp('col_time')}</Text>
        <View style={styles.colPrice}>
          <Text style={[styles.headerLabel, styles.alignRight]}>{tp('col_cost')}</Text>
          <Text style={[styles.headerUnit, styles.alignRight]}>{tp('col_cost_unit')}</Text>
        </View>
      </View>

      {ROWS.map((row) => (
        <View key={row.id} style={styles.row}>
          <View style={styles.colName}>
            <Text style={styles.name}>{tp(row.nameKey)}</Text>
            {row.noteKey && <Text style={styles.note}>{tp(row.noteKey)}</Text>}
          </View>
          <View style={styles.colTime}>
            {row.times.map((time) => (
              <Text key={time} style={styles.time}>{row.literalTimes ? time : tp(time)}</Text>
            ))}
          </View>
          <View style={styles.colPrice}>
            {row.prices.length > 0 ? (
              row.prices.map((price) => (
                <Text key={price} style={styles.price}>{price}</Text>
              ))
            ) : (
              <Text style={styles.free}>{tp('free')}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 12,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#888',
    lineHeight: 14,
  },
  headerUnit: {
    fontSize: 9,
    fontWeight: '400',
    color: '#888',
    lineHeight: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 56,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#d9d9d9',
  },
  colName: {
    flex: 1.5,
  },
  colTime: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  colPrice: {
    flex: 0.9,
    alignItems: 'flex-end',
  },
  alignRight: {
    textAlign: 'right',
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: NAVY,
    lineHeight: 15,
  },
  note: {
    fontSize: 9,
    fontWeight: '400',
    color: NAVY,
    lineHeight: 12,
  },
  time: {
    fontSize: 12,
    fontWeight: '400',
    color: NAVY,
    lineHeight: 16,
    textAlign: 'center',
  },
  price: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    lineHeight: 16,
  },
  free: {
    fontSize: 11,
    fontWeight: '500',
    color: '#888',
  },
});
