import { Product } from '@/types/market';

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Rice',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'p2',
    name: 'Wheat',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'p3',
    name: 'Tomatoes',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'p4',
    name: 'Potatoes',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'p5',
    name: 'Apples',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'p6',
    name: 'Mangoes',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'p7',
    name: 'Milk',
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'p8',
    name: 'Eggs',
    category: 'Poultry',
    image: 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'p9',
    name: 'Corn',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 'p10',
    name: 'Soybeans',
    category: 'Legumes',
    image: 'https://images.unsplash.com/photo-1599486045717-d0e3411bbde0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
];

export const productCategories = [
  'All',
  'Grains',
  'Vegetables',
  'Fruits',
  'Dairy',
  'Poultry',
  'Legumes',
];