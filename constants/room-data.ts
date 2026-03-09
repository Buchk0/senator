export type SubType = {
  key: string;
  label: string;
  price: string;
  description: string;
  heroImage: any;
  gallery: any[];
};

export type RoomCategory = {
  key: string;
  label: string;
  heroImage: any;
  shortDescription: string;
  subtypes: SubType[];
};

export const ROOM_CATEGORIES: Record<string, RoomCategory> = {
  standard: {
    key: 'standard',
    label: 'Standart',
    heroImage: require('@/assets/images/standart/standart-double/1.jpg'),
    shortDescription:
      'Просторные и стильные номера STANDARD обладают всем необходимым для полноценного и комфортного отдыха.',
    subtypes: [
      {
        key: 'single',
        label: 'Single',
        price: '100 000₸',
        description:
          'Просторные и стильные номера STANDARD обладают всем необходимым для полноценного и комфортного отдыха. Гармоничное сочетание современного дизайна с комфортным, продуманным до мелочей интерьером делает этот номер идеальным выбором как для бизнесменов, так и для туристов. Во всех номерах данной категории размещена удобная и большая кровать, рабочее место и уютная ванная комната.\n\nОтель располагает технически оснащенным номером для категории людей с ограниченными возможностями.',
        heroImage: require('@/assets/images/standart/standart-single/1.jpg'),
        gallery: [
          require('@/assets/images/standart/standart-single/1.jpg'),
          require('@/assets/images/standart/standart-single/2.jpg'),
          require('@/assets/images/standart/standart-single/3.jpg'),
        ],
      },
      {
        key: 'double',
        label: 'Double',
        price: '110 000₸',
        description:
          'Просторные и стильные номера STANDARD обладают всем необходимым для полноценного и комфортного отдыха. Гармоничное сочетание современного дизайна с комфортным, продуманным до мелочей интерьером делает этот номер идеальным выбором как для бизнесменов, так и для туристов. Во всех номерах данной категории размещена удобная и большая кровать, рабочее место и уютная ванная комната.',
        heroImage: require('@/assets/images/standart/standart-double/1.jpg'),
        gallery: [
          require('@/assets/images/standart/standart-double/1.jpg'),
          require('@/assets/images/standart/standart-double/2.jpg'),
          require('@/assets/images/standart/standart-double/3.jpg'),
          require('@/assets/images/standart/standart-double/4.jpg'),
        ],
      },
      {
        key: 'twin',
        label: 'Twin',
        price: '120 000₸',
        description:
          'Просторные и стильные номера STANDARD обладают всем необходимым для полноценного и комфортного отдыха. Номер оснащён двумя раздельными кроватями, что делает его идеальным выбором для двух гостей. Современный дизайн и продуманный интерьер обеспечат комфортный отдых.',
        heroImage: require('@/assets/images/standart/standart-twin-one/1.jpg'),
        gallery: [
          require('@/assets/images/standart/standart-twin-one/1.jpg'),
          require('@/assets/images/standart/standart-twin-one/2.jpg'),
          require('@/assets/images/standart/standart-twin-one/3.jpg'),
          require('@/assets/images/standart/standart-twin-one/4.jpg'),
          require('@/assets/images/standart/standart-twin-two/1.jpg'),
          require('@/assets/images/standart/standart-twin-two/2.jpg'),
          require('@/assets/images/standart/standart-twin-two/3.jpg'),
          require('@/assets/images/standart/standart-twin-two/4.jpg'),
        ],
      },
    ],
  },

  deluxe: {
    key: 'deluxe',
    label: 'Deluxe',
    heroImage: require('@/assets/images/deluxe/deluxe-double/1.jpg'),
    shortDescription:
      'Просторные номера DELUXE с панорамным видом на город и изысканным интерьером для истинных ценителей комфорта.',
    subtypes: [
      {
        key: 'single',
        label: 'Single',
        price: '140 000₸',
        description:
          'Элегантный номер категории DELUXE с изысканным интерьером и всеми удобствами для комфортного пребывания. Просторная комната с одной большой кроватью, рабочее место и ванная комната премиум-класса.',
        heroImage: require('@/assets/images/deluxe/deluxe-single/1.jpg'),
        gallery: [
          require('@/assets/images/deluxe/deluxe-single/1.jpg'),
          require('@/assets/images/deluxe/deluxe-single/2.jpg'),
          require('@/assets/images/deluxe/deluxe-single/3.jpg'),
        ],
      },
      {
        key: 'double',
        label: 'Double',
        price: '160 000₸',
        description:
          'Роскошный номер DELUXE с двуспальной кроватью king-size и панорамным видом на город. Изысканный декор, мягкое освещение и высококачественные материалы создают неповторимую атмосферу уюта.',
        heroImage: require('@/assets/images/deluxe/deluxe-double/1.jpg'),
        gallery: [
          require('@/assets/images/deluxe/deluxe-double/1.jpg'),
          require('@/assets/images/deluxe/deluxe-double/2.jpg'),
          require('@/assets/images/deluxe/deluxe-double/3.jpg'),
          require('@/assets/images/deluxe/deluxe-double/4.jpg'),
        ],
      },
      {
        key: 'twin',
        label: 'Twin',
        price: '170 000₸',
        description:
          'Просторный номер DELUXE с двумя раздельными кроватями. Идеальный выбор для деловых партнёров или друзей. Премиальный интерьер и все удобства категории Deluxe.',
        heroImage: require('@/assets/images/deluxe/deluxe-twin-one/1.jpg'),
        gallery: [
          require('@/assets/images/deluxe/deluxe-twin-one/1.jpg'),
          require('@/assets/images/deluxe/deluxe-twin-one/2.jpg'),
          require('@/assets/images/deluxe/deluxe-twin-one/3.jpg'),
          require('@/assets/images/deluxe/deluxe-twin-one/4.jpg'),
          require('@/assets/images/deluxe/deluxe-twin-two/1.jpg'),
          require('@/assets/images/deluxe/deluxe-twin-two/2.jpg'),
          require('@/assets/images/deluxe/deluxe-twin-two/3.jpg'),
          require('@/assets/images/deluxe/deluxe-twin-two/4.jpg'),
        ],
      },
      {
        key: 'premium',
        label: 'Premium Deluxe',
        price: '200 000₸',
        description:
          'Вершина категории DELUXE — номер Premium с расширенной площадью, дизайнерской мебелью и эксклюзивными материалами отделки. Ванная комната с джакузи и панорамный вид делают этот номер по-настоящему особенным.',
        heroImage: require('@/assets/images/deluxe/premium-deluxe/1.jpg'),
        gallery: [
          require('@/assets/images/deluxe/premium-deluxe/1.jpg'),
          require('@/assets/images/deluxe/premium-deluxe/2.jpg'),
          require('@/assets/images/deluxe/premium-deluxe/3.jpg'),
          require('@/assets/images/deluxe/premium-deluxe/4.jpg'),
        ],
      },
    ],
  },

  suite: {
    key: 'suite',
    label: 'Suite',
    heroImage: require('@/assets/images/suite/executive/1.jpg'),
    shortDescription:
      'Эксклюзивные апартаменты SUITE — воплощение роскоши и безупречного сервиса для самых взыскательных гостей.',
    subtypes: [
      {
        key: 'executive',
        label: 'Executive',
        price: '350 000₸',
        description:
          'Представительский люкс EXECUTIVE с отдельной гостиной, спальней и рабочим кабинетом. Безупречный сервис, дизайнерский интерьер и все удобства для самых взыскательных гостей. Ванная комната с джакузи и панорамный вид на город.',
        heroImage: require('@/assets/images/suite/executive/1.jpg'),
        gallery: [
          require('@/assets/images/suite/executive/1.jpg'),
          require('@/assets/images/suite/executive/2.jpg'),
          require('@/assets/images/suite/executive/3.jpg'),
          require('@/assets/images/suite/executive/4.jpg'),
        ],
      },
      {
        key: 'presidential',
        label: 'Presidential',
        price: '500 000₸',
        description:
          'Президентский люкс — высшая категория отеля Senator. Просторные апартаменты с двумя спальнями, гостиной, террасой и персональным батлером. Эксклюзивный интерьер и безграничный комфорт для самых особенных гостей.',
        heroImage: require('@/assets/images/suite/presidential/1.jpg'),
        gallery: [
          require('@/assets/images/suite/presidential/1.jpg'),
          require('@/assets/images/suite/presidential/2.jpg'),
          require('@/assets/images/suite/presidential/3.jpg'),
          require('@/assets/images/suite/presidential/4.jpg'),
        ],
      },
    ],
  },
};
