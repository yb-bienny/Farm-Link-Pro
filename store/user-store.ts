import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
  };
  profileImage?: string;
  productsOfInterest: string[];
  isDataSharingEnabled: boolean;
  notificationsEnabled: boolean;
  lastSyncTimestamp?: string;
}

interface UserState {
  profile: UserProfile | null;
  isOnboarded: boolean;
  isOfflineMode: boolean;
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setOnboarded: (value: boolean) => void;
  setOfflineMode: (value: boolean) => void;
  addProductOfInterest: (productId: string) => void;
  removeProductOfInterest: (productId: string) => void;
  setLastSyncTimestamp: () => void;
  logout: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'default',
  name: 'Farmer',
  productsOfInterest: [],
  isDataSharingEnabled: true,
  notificationsEnabled: true,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      isOnboarded: false,
      isOfflineMode: false,
      
      setProfile: (profile) => set({ profile }),
      
      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null
      })),
      
      setOnboarded: (value) => set({ isOnboarded: value }),
      
      setOfflineMode: (value) => set({ isOfflineMode: value }),
      
      addProductOfInterest: (productId) => set((state) => {
        if (!state.profile) return { profile: DEFAULT_PROFILE };
        
        return {
          profile: {
            ...state.profile,
            productsOfInterest: state.profile.productsOfInterest.includes(productId)
              ? state.profile.productsOfInterest
              : [...state.profile.productsOfInterest, productId]
          }
        };
      }),
      
      removeProductOfInterest: (productId) => set((state) => {
        if (!state.profile) return { profile: null };
        
        return {
          profile: {
            ...state.profile,
            productsOfInterest: state.profile.productsOfInterest.filter(id => id !== productId)
          }
        };
      }),
      
      setLastSyncTimestamp: () => set((state) => ({
        profile: state.profile 
          ? { ...state.profile, lastSyncTimestamp: new Date().toISOString() }
          : null
      })),
      
      logout: () => set({ profile: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);