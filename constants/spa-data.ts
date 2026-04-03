export type SpaCategoryId = 'massages' | 'facial' | 'body' | 'rituals';

export type SpaCategory = {
    id: SpaCategoryId;
}

export type SpaTreatment = {
    id: string;
    categoryId: string;
    title: string;
    duration: number;
    priceFrom: number;
    image: number;
}

export const spaCategories: SpaCategory[] = [
    { id: 'massages' },
    { id: 'facial' },
    { id: 'body' },
    { id: 'rituals' },
]

export const spaTreatments: SpaTreatment[] = [
    {
        id: 't1',
        categoryId: 'massages',
        title: 'Aroma Relax Massage',
        duration: 60,
        priceFrom: 18000,
        image: require('@/assets/images/spa/card-img.jpg'),
    },
    {
        id: 't2',
        categoryId: 'massages',
        title: 'Aroma Relax Massage',
        duration: 60,
        priceFrom: 18000,
        image: require('@/assets/images/spa/card-img.jpg'),
    }
]
