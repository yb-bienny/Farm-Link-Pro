import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, Text, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, MapPin } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useMarketStore } from '@/store/market-store';
import MarketCard from '@/components/MarketCard';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { Market } from '@/types/market';

export default function MarketsScreen() {
  const router = useRouter();
  const { markets } = useMarketStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status === 'granted');
        
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
        }
      }
    })();
  }, []);
  
  useEffect(() => {
    let filtered = [...markets];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(market => 
        market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        market.location.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Calculate distances if user location is available
    if (userLocation) {
      filtered = filtered.map(market => {
        const distance = calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          market.location.latitude,
          market.location.longitude
        );
        
        return {
          ...market,
          distance
        };
      });
      
      // Sort by distance
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    
    setFilteredMarkets(filtered);
  }, [searchQuery, markets, userLocation]);
  
  const calculateDistance = (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };
  
  const handleMarketPress = (market: Market) => {
    router.push(`/market/${market.id}`);
  };
  
  const requestLocationPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.text.light} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search markets..."
            placeholderTextColor={Colors.text.light}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      {locationPermission === false && (
        <View style={styles.permissionBanner}>
          <MapPin size={16} color={Colors.primary} />
          <Text style={styles.permissionText}>
            Enable location to see nearby markets
          </Text>
          <Pressable 
            style={styles.permissionButton}
            onPress={requestLocationPermission}
          >
            <Text style={styles.permissionButtonText}>Enable</Text>
          </Pressable>
        </View>
      )}
      
      <FlatList
        data={filteredMarkets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MarketCard 
            market={item} 
            onPress={() => handleMarketPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No markets found"
            message="Try changing your search criteria"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.text.primary,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  permissionText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text.primary,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
});