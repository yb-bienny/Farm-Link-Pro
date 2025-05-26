export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
}

export interface PriceData {
  id: string;
  productId: string;
  marketId: string;
  price: number;
  unit: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
  percentChange: number;
}

export interface Market {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
  };
  distance?: number; // in km
  operatingHours: string;
  contactPhone?: string;
  products: string[]; // product IDs
}

export interface Buyer {
  id: string;
  name: string;
  profileImage?: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    city: string;
    state: string;
  };
  contactPhone?: string;
  email?: string;
  interestedProducts: string[]; // product IDs
  rating: number;
  verified: boolean;
}

export interface MarketAlert {
  id: string;
  productId: string;
  marketId: string;
  threshold: number;
  type: 'above' | 'below';
  active: boolean;
  createdAt: string;
}