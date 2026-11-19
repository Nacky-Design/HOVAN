export interface CatalogPhoto {
  id: string;
  label: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  type: string | null;
  photos: readonly CatalogPhoto[];
  sizes: readonly string[];
}

export const products: readonly Product[] = [
  {
    id: 'shunch', name: 'SHUNCH', type: 'Блуза',
    photos: [
      { id: 'shunch-1', label: 'Силуэт', alt: 'Светлая блуза с объёмными рукавами' },
      { id: 'shunch-2', label: 'Со спины', alt: 'Светлая блуза со спины' },
      { id: 'shunch-3', label: 'Деталь', alt: 'Манжета светлой блузы крупным планом' },
    ],
    sizes: [],
  },
  {
    id: 'hishat', name: 'HISHAT', type: 'Кушак',
    photos: [
      { id: 'hishat-1', label: 'Орнамент', alt: 'Орнамент узорного кушака' },
      { id: 'hishat-2', label: 'В образе', alt: 'Тёмный образ с узорным кушаком' },
      { id: 'hishat-3', label: 'Застёжка', alt: 'Кушак со спины' },
    ],
    sizes: [],
  },
  {
    id: 'vortan', name: 'VORTAN', type: 'Туника',
    photos: [
      { id: 'vortan-1', label: 'Ворот', alt: 'Высокий ворот чёрной туники' },
      { id: 'vortan-2', label: 'Силуэт', alt: 'Тёмная туника в полный рост' },
      { id: 'vortan-3', label: 'В движении', alt: 'Тёмная одежда в движении' },
    ],
    sizes: [],
  },
  {
    id: 'mshush', name: 'MSHUSH', type: 'Платье',
    photos: [
      { id: 'mshush-1', label: 'Сбоку', alt: 'Чёрное платье, вид сбоку' },
      { id: 'mshush-2', label: 'Силуэт', alt: 'Чёрное длинное платье' },
      { id: 'mshush-3', label: 'Со спины', alt: 'Чёрное платье со спины' },
    ],
    sizes: [],
  },
  {
    id: 'hoh', name: 'HOH', type: 'Брюки',
    photos: [
      { id: 'hoh-1', label: 'Спереди', alt: 'Тёмные широкие брюки спереди' },
      { id: 'hoh-2', label: 'Со спины', alt: 'Тёмные брюки со спины' },
      { id: 'hoh-3', label: 'Сбоку', alt: 'Тёмные брюки сбоку' },
    ],
    sizes: [],
  },
  {
    id: 'alik', name: 'ALIK', type: 'Юбка',
    photos: [
      { id: 'alik-1', label: 'Силуэт', alt: 'Тёмная юбка в полный рост' },
      { id: 'alik-2', label: 'В движении', alt: 'Тёмная юбка в движении' },
      { id: 'alik-3', label: 'Со спины', alt: 'Тёмная юбка со спины' },
    ],
    sizes: [],
  },
  {
    id: 'model-07', name: 'Модель 07', type: null,
    photos: [],
    sizes: [],
  },
];
