export interface LocalizedText {
  en: string;
  ru: string;
  kz: string;
}

export type Coupon = {
  id: string;
  type: 'welcome' | 'seasonal' | 'always';
  emoji: string;
  restaurant: 'All' | 'Senator' | 'Balkon';
  oneTime: boolean;
  active: boolean;
  title: LocalizedText;
  description: LocalizedText;
  terms: LocalizedText;
}
