export type Coupon = {
    id: string;
    type: 'welcome' | 'seasonal' | 'always';
    title: string;
    emoji: string;
    description: string;
    terms: string;
    restaurant: 'All' | 'Senator' | 'Balkon';
    expiresText?: string;
    oneTime?: boolean;
}

export const coupons: Coupon[] = [
    // Welcome
    {
        id: "w1",
        type: "welcome",
        title: "Welcome Drink",
        emoji: "🍸",
        description: "Free signature cocktail at the bar.",
        terms: "Available once after check-in. 18+.",
        restaurant: "Senator",
        oneTime: true,
        expiresText: "1 time",
    },
    {
        id: "w2",
        type: "welcome",
        title: "Welcome Dessert",
        emoji: "🍰",
        description: "Free dessert when ordering a main course.",
        terms: "Available once after check-in. 1 dessert per table.",
        restaurant: "Balkon",
        oneTime: true,
        expiresText: "1 time",
    },
    {
        id: "w3",
        type: "welcome",
        title: "−10% on First Dinner",
        emoji: "🍽️",
        description: "10% discount on your first dinner. One time only.",
        terms: "Cannot be combined with other offers. 1 use.",
        restaurant: "All",
        oneTime: true,
        expiresText: "1 time",
    },
    {
        id: "w4",
        type: "welcome",
        title: "Breakfast Upgrade",
        emoji: "☕️",
        description: "Free specialty coffee or fresh juice with breakfast.",
        terms: "Available once after check-in.",
        restaurant: "Senator",
        oneTime: true,
        expiresText: "1 time",
    },

    // Seasonal
    {
        id: "s1",
        type: "seasonal",
        title: "Spring Taste – −15%",
        emoji: "🌷",
        description: "15% off the seasonal menu.",
        terms: "Valid during the season. Cannot be combined.",
        restaurant: "Senator",
        expiresText: "Seasonal • 2–3 mo.",
    },
    {
        id: "s2",
        type: "seasonal",
        title: "Strawberry Dessert Gift",
        emoji: "🍓",
        description: "Free strawberry dessert with any main course.",
        terms: "When ordering a main course. 1 dessert per table.",
        restaurant: "Balkon",
        expiresText: "Seasonal • 2–3 mo.",
    },
    {
        id: "s3",
        type: "seasonal",
        title: "Wine & Dinner",
        emoji: "🍷",
        description: "Free glass of wine with dinner.",
        terms: "18+. When ordering a main course. 1 glass.",
        restaurant: "Senator",
        expiresText: "Seasonal • 2–3 mo.",
    },
    {
        id: "s4",
        type: "seasonal",
        title: "Hot Chocolate Treat",
        emoji: "🍫",
        description: "Free hot chocolate.",
        terms: "1 per guest per visit.",
        restaurant: "Balkon",
        expiresText: "Seasonal • 2–3 mo.",
    },

    // Always Available
    {
        id: "a1",
        type: "always",
        title: "Happy Hour – −20%",
        emoji: "🍹",
        description: "20% off cocktails from 5 pm to 7 pm.",
        terms: "Valid daily during stated hours. 18+.",
        restaurant: "Senator",
        expiresText: "Always",
    },
    {
        id: "a2",
        type: "always",
        title: "Romantic Dinner",
        emoji: "🍾",
        description: "Free champagne for two when booking a table.",
        terms: "When booking a table for two. 18+.",
        restaurant: "Balkon",
        expiresText: "Always",
    },
    {
        id: "a3",
        type: "always",
        title: "Lunch Offer – −15%",
        emoji: "🥗",
        description: "15% off business lunch on weekdays.",
        terms: "Valid on weekdays. Check hours in Info.",
        restaurant: "All",
        expiresText: "Always",
    },
    {
        id: "a4",
        type: "always",
        title: "Chef's Recommendation",
        emoji: "🍽",
        description: "Free compliment from the chef.",
        terms: "Limited availability. At the restaurant's discretion.",
        restaurant: "Senator",
        expiresText: "Always",
    },
];
