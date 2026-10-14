import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { BrandColors } from '@/constants/theme';
import {
  ConferenceMenuItem,
  ConferenceMenuType,
  useConferenceMenu,
} from '@/hooks/use-conference-menu';

const NAVY = '#1a2035';
const BORDER_COLOR = 'rgba(198, 156, 109, 0.5)';
const PRICE_BG = '#f5ecdc';
const PLACEHOLDER_BG = '#ececec';
const SKELETON_COUNT = 2;

function PriceTag({ price }: { price: string }) {
  const { t } = useTranslation();
  return (
    <View style={styles.priceTag}>
      <Text style={styles.priceText}>{price} ₸ / {t('conference.per_person')}</Text>
    </View>
  );
}

function CoffeeBreakCard({ menu }: { menu: ConferenceMenuItem }) {
  return (
    <View style={styles.coffeeCard}>
      <Image source={{ uri: menu.imageUrl }} style={styles.coffeeImage} contentFit="cover" transition={200} />
      <PriceTag price={menu.price} />
      <View style={styles.coffeeTitleRow}>
        <Text style={styles.coffeeTitle}>{menu.title}</Text>
        <View style={styles.coffeeTitleLine} />
      </View>
      <View style={styles.coffeeColumns}>
        <View style={styles.coffeeColumn}>
          {menu.items.map((line, i) => (
            <Text key={i} style={styles.coffeeLine}>{line}</Text>
          ))}
        </View>
        <View style={styles.coffeeColumn}>
          {menu.drinks.map((line, i) => (
            <Text key={i} style={styles.coffeeLine}>{line}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function BusinessLunchCard({ menu }: { menu: ConferenceMenuItem }) {
  return (
    <View style={styles.lunchCard}>
      <View>
        <Image source={{ uri: menu.imageUrl }} style={styles.lunchImage} contentFit="cover" transition={200} />
        {menu.title ? (
          <View style={styles.lunchBadge}>
            <Text style={styles.lunchBadgeText}>{menu.title}</Text>
          </View>
        ) : null}
      </View>
      <PriceTag price={menu.price} />
      <View style={styles.lunchItems}>
        {menu.items.map((line, i) => (
          <Text key={i} style={styles.lunchLine}>{line}</Text>
        ))}
      </View>
    </View>
  );
}

function SkeletonCard({ type }: { type: ConferenceMenuType }) {
  const isLunch = type === 'business_lunch';
  return (
    <View style={isLunch ? styles.lunchCard : styles.coffeeCard}>
      <View style={[isLunch ? styles.lunchImage : styles.coffeeImage, styles.placeholder]} />
      <View style={[styles.priceTag, styles.placeholderPrice]} />
      <View style={[styles.placeholderLine, { width: '60%' }]} />
      <View style={[styles.placeholderLine, { width: '80%' }]} />
      <View style={[styles.placeholderLine, { width: '50%' }]} />
    </View>
  );
}

export interface ConferenceMenuProps {
  type: ConferenceMenuType;
}

export function ConferenceMenu({ type }: ConferenceMenuProps) {
  const { t } = useTranslation();
  const { menus, loading } = useConferenceMenu(type);
  const isLunch = type === 'business_lunch';

  if (!loading && menus.length === 0) {
    return <Text style={styles.empty}>{t('conference.menu_empty')}</Text>;
  }

  const cards = loading
    ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <SkeletonCard key={i} type={type} />)
    : menus.map((menu) =>
        isLunch
          ? <BusinessLunchCard key={menu.id} menu={menu} />
          : <CoffeeBreakCard key={menu.id} menu={menu} />
      );

  return <View style={isLunch ? styles.lunchGrid : styles.coffeeList}>{cards}</View>;
}

const styles = StyleSheet.create({
  empty: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },

  /* ── Shared ── */
  priceTag: {
    backgroundColor: PRICE_BG,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '600',
    color: BrandColors.gold,
  },
  placeholder: {
    backgroundColor: PLACEHOLDER_BG,
  },
  placeholderPrice: {
    height: 34,
  },
  placeholderLine: {
    height: 10,
    borderRadius: 5,
    backgroundColor: PLACEHOLDER_BG,
    marginTop: 8,
    alignSelf: 'center',
  },

  /* ── Coffee break ── */
  coffeeList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },
  coffeeCard: {
    backgroundColor: BrandColors.white,
    borderRadius: 18,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  coffeeImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
  },
  coffeeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  coffeeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
  },
  coffeeTitleLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#d9d9d9',
  },
  coffeeColumns: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  coffeeColumn: {
    flex: 1,
    gap: 6,
  },
  coffeeLine: {
    fontSize: 10,
    color: NAVY,
    lineHeight: 13,
  },

  /* ── Business lunch ── */
  lunchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  lunchCard: {
    width: '48.5%',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 14,
    padding: 6,
    paddingBottom: 12,
  },
  lunchImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  lunchBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: BrandColors.gold,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  lunchBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: BrandColors.white,
  },
  lunchItems: {
    marginTop: 8,
    gap: 1,
  },
  lunchLine: {
    fontSize: 10,
    color: NAVY,
    lineHeight: 13,
    textAlign: 'center',
  },
});
