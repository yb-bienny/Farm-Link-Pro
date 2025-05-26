import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MapPin, Clock, Phone, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Market } from '@/types/market';
import { useMarketStore } from '@/store/market-store';

interface MarketCardProps {
  market: Market;
  onPress?: () => void;
}

export default function MarketCard({ market, onPress }: MarketCardProps) {
  const { toggleFavoriteMarket, favoriteMarkets } = useMarketStore();
  
  const isFavorite = favoriteMarkets.includes(market.id);
  
  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavoriteMarket(market.id);
  };
  
  return (
    <Pressable 
      style={styles.container}
      onPress={onPress}
      android_ripple={{ color: Colors.border }}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{market.name}</Text>
        <Pressable onPress={handleFavoritePress} hitSlop={10}>
          <Star
            size={20}
            color={isFavorite ? Colors.accent : Colors.text.light}
            fill={isFavorite ? Colors.accent : 'transparent'}
          />
        </Pressable>
      </View>
      
      <View style={styles.infoRow}>
        <MapPin size={16} color={Colors.primary} style={styles.icon} />
        <Text style={styles.infoText}>
          {market.location.address}, {market.location.city}
        </Text>
      </View>
      
      <View style={styles.infoRow}>
        <Clock size={16} color={Colors.primary} style={styles.icon} />
        <Text style={styles.infoText}>{market.operatingHours}</Text>
      </View>
      
      {market.contactPhone && (
        <View style={styles.infoRow}>
          <Phone size={16} color={Colors.primary} style={styles.icon} />
          <Text style={styles.infoText}>{market.contactPhone}</Text>
        </View>
      )}
      
      {market.distance !== undefined && (
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>
            {market.distance < 1 
              ? `${(market.distance * 1000).toFixed(0)}m` 
              : `${market.distance.toFixed(1)}km`} away
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  distanceContainer: {
    position: 'absolute',
    top: 16,
    right: 48,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});