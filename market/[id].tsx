import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Clock, Phone, ExternalLink } from 'lucide-react-native';
import { useMarketStore } from '@/store/market-store';
import PriceCard from '@/components/PriceCard';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { PriceData } from '@/types/market';

export default function MarketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { getMarketById, priceData, getProductById } = useMarketStore();
  const market = getMarketById(id);
  
  const [marketPrices, setMarketPrices] = useState<PriceData[]>([]);
  
  useEffect(() => {
    if (market) {
      const prices = priceData.filter(price => price.marketId === market.id);
      setMarketPrices(prices);
    }
  }, [market, priceData]);
  
  const handlePriceCardPress = (priceData: PriceData) => {
    router.push(`/product/${priceData.productId}?marketId=${priceData.marketId}`);
  };
  
  const handleCallPress = () => {
    if (market?.contactPhone && Platform.OS !== 'web') {
      Linking.openURL(`tel:${market.contactPhone}`);
    }
  };
  
  const handleDirectionsPress = () => {
    if (market && Platform.OS !== 'web') {
      const { latitude, longitude } = market.location;
      const url = Platform.select({
        ios: `maps:0,0?q=${latitude},${longitude}`,
        android: `geo:0,0?q=${latitude},${longitude}`,
      });
      
      if (url) {
        Linking.openURL(url);
      }
    } else if (market && Platform.OS === 'web') {
      const { latitude, longitude } = market.location;
      window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank');
    }
  };
  
  if (!market) {
    return (
      <EmptyState
        title="Market not found"
        message="The market you're looking for doesn't exist"
      />
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.marketName}>{market.name}</Text>
        
        <View style={styles.infoRow}>
          <MapPin size={18} color={Colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            {market.location.address}, {market.location.city}, {market.location.state}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Clock size={18} color={Colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>{market.operatingHours}</Text>
        </View>
        
        {market.contactPhone && (
          <View style={styles.infoRow}>
            <Phone size={18} color={Colors.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>{market.contactPhone}</Text>
          </View>
        )}
        
        <View style={styles.actions}>
          {market.contactPhone && (
            <Pressable 
              style={styles.actionButton}
              onPress={handleCallPress}
            >
              <Phone size={18} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Call</Text>
            </Pressable>
          )}
          
          <Pressable 
            style={styles.actionButton}
            onPress={handleDirectionsPress}
          >
            <MapPin size={18} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Directions</Text>
          </Pressable>
          
          <Pressable 
            style={styles.actionButton}
            onPress={() => {}}
          >
            <ExternalLink size={18} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Share</Text>
          </Pressable>
        </View>
      </View>
      
      <View style={styles.pricesContainer}>
        <Text style={styles.sectionTitle}>Available Products</Text>
        
        <FlatList
          data={marketPrices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PriceCard 
              priceData={item} 
              onPress={() => handlePriceCardPress(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title="No products available"
              message="This market doesn't have any products listed yet"
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.card,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  marketName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
    color: Colors.text.secondary,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  actionButtonText: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.primary,
  },
  pricesContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
});