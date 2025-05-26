import { Market, PriceData } from '@/types/market';

export const markets: Market[] = [
  {
    id: 'm1',
    name: 'Central Farmers Market',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: '123 Market Street',
      city: 'San Francisco',
      state: 'CA',
    },
    operatingHours: 'Mon-Sat: 8AM-6PM',
    contactPhone: '555-123-4567',
    products: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'],
  },
  {
    id: 'm2',
    name: 'Riverside Agricultural Hub',
    location: {
      latitude: 37.7833,
      longitude: -122.4167,
      address: '456 River Road',
      city: 'San Francisco',
      state: 'CA',
    },
    operatingHours: 'Tue-Sun: 7AM-5PM',
    contactPhone: '555-987-6543',
    products: ['p1', 'p3', 'p5', 'p7', 'p9', 'p10'],
  },
  {
    id: 'm3',
    name: 'Valley Fresh Produce',
    location: {
      latitude: 37.7694,
      longitude: -122.4862,
      address: '789 Valley Way',
      city: 'San Francisco',
      state: 'CA',
    },
    operatingHours: 'Mon-Fri: 9AM-7PM',
    contactPhone: '555-456-7890',
    products: ['p2', 'p4', 'p6', 'p8', 'p10'],
  },
  {
    id: 'm4',
    name: 'Hillside Growers Collective',
    location: {
      latitude: 37.7562,
      longitude: -122.4430,
      address: '101 Hill Avenue',
      city: 'San Francisco',
      state: 'CA',
    },
    operatingHours: 'Wed-Sun: 8AM-4PM',
    products: ['p1', 'p2', 'p9', 'p10'],
  },
  {
    id: 'm5',
    name: 'Eastside Organic Market',
    location: {
      latitude: 37.7648,
      longitude: -122.4103,
      address: '202 East Boulevard',
      city: 'San Francisco',
      state: 'CA',
    },
    operatingHours: 'Mon-Sun: 7AM-8PM',
    contactPhone: '555-222-3333',
    products: ['p3', 'p4', 'p5', 'p6', 'p7', 'p8'],
  },
];

export const priceData: PriceData[] = [
  {
    id: 'price1',
    productId: 'p1',
    marketId: 'm1',
    price: 25.50,
    unit: 'per kg',
    date: '2025-05-25',
    trend: 'up',
    percentChange: 3.2,
  },
  {
    id: 'price2',
    productId: 'p1',
    marketId: 'm2',
    price: 24.75,
    unit: 'per kg',
    date: '2025-05-25',
    trend: 'stable',
    percentChange: 0.1,
  },
  {
    id: 'price3',
    productId: 'p2',
    marketId: 'm1',
    price: 18.30,
    unit: 'per kg',
    date: '2025-05-25',
    trend: 'down',
    percentChange: -2.1,
  },
  {
    id: 'price4',
    productId: 'p3',
    marketId: 'm1',
    price: 12.75,
    unit: 'per kg',
    date: '2025-05-25',
    trend: 'up',
    percentChange: 5.4,
  },
  {
    id: 'price5',
    productId: 'p3',
    marketId: 'm2',
    price: 13.25,
    unit: 'per kg',
    date: '2025-05-25',
    trend: 'up',
    percentChange: 4.8,
  },
  {
    id: 'price6',
    productId: 'p4',
    marketId: 'm3',
    price: 8.50,
    unit: 'per kg',
    date: '2025-05-25',
    trend: 'down',
    percentChange: -1.7,
  },
  {
    id: 'price7',
    productId: 'p5',
    marketId: 'm1',
    price: 15.00,
    unit: 'per kg',
    date: '2025-05-25',
    trend: 'stable',
    percentChange: 0.3,
  },
  {
    id: 'price8',
    productId: 'p6',
    marketId: 'm5',
    price: 22.50,
    unit: 'per kg',
    date: '2025-05-25',
    trend: 'up',
    percentChange: 7.2,
  },
  {
    id: 'price9',
    productId: 'p7',
    marketId: 'm2',
    price: 6.75,
    unit: 'per liter',
    date: '2025-05-25',
    trend: 'stable',
    percentChange: 0.0,
  },
  {
    id: 'price10',
    productId: 'p8',
    marketId: 'm3',
    price: 9.25,
    unit: 'per dozen',
    date: '2025-05-25',
    trend: 'down',
    percentChange: -3.5,
  },
  {
    id: 'price11',
    productId: 'p9',
    marketId: 'm4',
    price: 14.50,
    unit: 'per kg',
    date: '2025-05-25',
    trend: 'up',
    percentChange: 2.8,
  },
  {
    id: 'price12',
    productId: 'p10',
    marketId: 'm4',
    price: 19.75,
    unit: 'per kg',
    date: '2025-05-25',
    trend: 'down',
    percentChange: -1.2,
  },
];

// Historical price data for charts
export const generateHistoricalPrices = (productId: string, marketId: string) => {
  const today = new Date();
  const data = [];
  
  // Generate 30 days of historical data
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Base price with some randomness
    const basePrice = productId === 'p1' ? 25 : 
                      productId === 'p2' ? 18 : 
                      productId === 'p3' ? 12 : 
                      productId === 'p4' ? 8 : 
                      productId === 'p5' ? 15 : 
                      productId === 'p6' ? 22 : 
                      productId === 'p7' ? 6 : 
                      productId === 'p8' ? 9 : 
                      productId === 'p9' ? 14 : 19;
    
    // Add some randomness and a slight trend
    const randomFactor = (Math.random() * 0.2) - 0.1; // -10% to +10%
    const trendFactor = (i / 100) * (Math.random() > 0.5 ? 1 : -1); // Slight upward or downward trend
    
    const price = basePrice * (1 + randomFactor + trendFactor);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2))
    });
  }
  
  return data;
};