import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Market, PriceData, Product, MarketAlert, Buyer } from '@/types/market';
import { markets, priceData } from '@/mocks/markets';
import { products } from '@/mocks/products';
import { buyers } from '@/mocks/buyers';

interface MarketState {
  markets: Market[];
  products: Product[];
  priceData: PriceData[];
  buyers: Buyer[];
  alerts: MarketAlert[];
  favoriteMarkets: string[];
  favoriteProducts: string[];
  selectedProduct: string | null;
  selectedMarket: string | null;
  
  // Actions
  setSelectedProduct: (productId: string | null) => void;
  setSelectedMarket: (marketId: string | null) => void;
  toggleFavoriteMarket: (marketId: string) => void;
  toggleFavoriteProduct: (productId: string) => void;
  addAlert: (alert: Omit<MarketAlert, 'id' | 'createdAt'>) => void;
  removeAlert: (alertId: string) => void;
  toggleAlertActive: (alertId: string) => void;
  
  // Getters
  getProductById: (id: string) => Product | undefined;
  getMarketById: (id: string) => Market | undefined;
  getBuyerById: (id: string) => Buyer | undefined;
  getPriceForProductInMarket: (productId: string, marketId: string) => PriceData | undefined;
  getAlertsForProduct: (productId: string) => MarketAlert[];
  getFavoriteMarkets: () => Market[];
  getFavoriteProducts: () => Product[];
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set, get) => ({
      markets,
      products,
      priceData,
      buyers,
      alerts: [],
      favoriteMarkets: [],
      favoriteProducts: [],
      selectedProduct: null,
      selectedMarket: null,
      
      setSelectedProduct: (productId) => set({ selectedProduct: productId }),
      setSelectedMarket: (marketId) => set({ selectedMarket: marketId }),
      
      toggleFavoriteMarket: (marketId) => set((state) => {
        const isFavorite = state.favoriteMarkets.includes(marketId);
        return {
          favoriteMarkets: isFavorite
            ? state.favoriteMarkets.filter(id => id !== marketId)
            : [...state.favoriteMarkets, marketId]
        };
      }),
      
      toggleFavoriteProduct: (productId) => set((state) => {
        const isFavorite = state.favoriteProducts.includes(productId);
        return {
          favoriteProducts: isFavorite
            ? state.favoriteProducts.filter(id => id !== productId)
            : [...state.favoriteProducts, productId]
        };
      }),
      
      addAlert: (alert) => set((state) => ({
        alerts: [
          ...state.alerts,
          {
            ...alert,
            id: `alert_${Date.now()}`,
            createdAt: new Date().toISOString(),
          }
        ]
      })),
      
      removeAlert: (alertId) => set((state) => ({
        alerts: state.alerts.filter(alert => alert.id !== alertId)
      })),
      
      toggleAlertActive: (alertId) => set((state) => ({
        alerts: state.alerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, active: !alert.active } 
            : alert
        )
      })),
      
      getProductById: (id) => get().products.find(product => product.id === id),
      
      getMarketById: (id) => get().markets.find(market => market.id === id),
      
      getBuyerById: (id) => get().buyers.find(buyer => buyer.id === id),
      
      getPriceForProductInMarket: (productId, marketId) => 
        get().priceData.find(
          price => price.productId === productId && price.marketId === marketId
        ),
      
      getAlertsForProduct: (productId) => 
        get().alerts.filter(alert => alert.productId === productId),
      
      getFavoriteMarkets: () => 
        get().markets.filter(market => get().favoriteMarkets.includes(market.id)),
      
      getFavoriteProducts: () => 
        get().products.filter(product => get().favoriteProducts.includes(product.id)),
    }),
    {
      name: 'market-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favoriteMarkets: state.favoriteMarkets,
        favoriteProducts: state.favoriteProducts,
        alerts: state.alerts,
      }),
    }
  )
);