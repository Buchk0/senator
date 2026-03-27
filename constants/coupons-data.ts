export type Coupon = {
    id: string;
    type: 'welcome' | 'seasonal' | 'always';
    emoji: string;
    restaurant: 'All' | 'Senator' | 'Balkon';
    oneTime?: boolean;
}

export const coupons: Coupon[] = [
    // Welcome
    { id: "w1", type: "welcome", emoji: "🍸", restaurant: "Senator", oneTime: true },
    { id: "w2", type: "welcome", emoji: "🍰", restaurant: "Balkon",  oneTime: true },
    { id: "w3", type: "welcome", emoji: "🍽️", restaurant: "All",    oneTime: true },
    { id: "w4", type: "welcome", emoji: "☕️", restaurant: "Senator", oneTime: true },

    // Seasonal
    { id: "s1", type: "seasonal", emoji: "🌷", restaurant: "Senator" },
    { id: "s2", type: "seasonal", emoji: "🍓", restaurant: "Balkon"  },
    { id: "s3", type: "seasonal", emoji: "🍷", restaurant: "Senator" },
    { id: "s4", type: "seasonal", emoji: "🍫", restaurant: "Balkon"  },

    // Always Available
    { id: "a1", type: "always", emoji: "🍹", restaurant: "Senator" },
    { id: "a2", type: "always", emoji: "🍾", restaurant: "Balkon"  },
    { id: "a3", type: "always", emoji: "🥗", restaurant: "All"     },
    { id: "a4", type: "always", emoji: "🍽",  restaurant: "Senator" },
];
