import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { ArrowDown, ArrowUp, Minus, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useMarketStore } from '@/store/market-store';
import { PriceData, Product, Market } from '@/types/market';

interface PriceCardProps {
  priceData: PriceData;
  onPress?: () => void;
}

export default function PriceCard({ priceData, onPress }: PriceCardProps) {
  const { getProductById, getMarketById, toggleFavoriteProduct, favoriteProducts } = useMarketStore();
  
  const product = getProductById(priceData.productId);
  const market = getMarketById(priceData.marketId);
  
  if (!product || !market) return null;
  
  const isFavorite = favoriteProducts.includes(product.id);
  
  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavoriteProduct(product.id);
  };
  
  return (
    <Pressable 
      style={styles.container}
      onPress={onPress}
      android_ripple={{ color: Colors.border }}
    >
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.productName}>{product.name}</Text>
          <Pressable onPress={handleFavoritePress} hitSlop={10}>
            <Star
              size={20}
              color={isFavorite ? Colors.accent : Colors.text.light}
              fill={isFavorite ? Colors.accent : 'transparent'}
            />
          </Pressable>
        </View>
        
        <Text style={styles.marketName}>{market.name}</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{priceData.price.toFixed(2)}</Text>
          <Text style={styles.unit}>{priceData.unit}</Text>
          
          <View style={[
            styles.trendContainer,
            priceData.trend === 'up' ? styles.trendUp : 
            priceData.trend === 'down' ? styles.trendDown : 
            styles.trendStable
          ]}>
            {priceData.trend === 'up' ? (
              <ArrowUp size={14} color={Colors.error} />
            ) : priceData.trend === 'down' ? (
              <ArrowDown size={14} color={Colors.success} />
            ) : (
              <Minus size={14} color={Colors.text.light} />
            )}
            <Text style={[
              styles.trendText,
              priceData.trend === 'up' ? styles.trendTextUp : 
              priceData.trend === 'down' ? styles.trendTextDown : 
              styles.trendTextStable
            ]}>
              {Math.abs(priceData.percentChange).toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  marketName: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  unit: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendUp: {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
  },
  trendDown: {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
  },
  trendStable: {
    backgroundColor: 'rgba(153, 153, 153, 0.1)',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
  trendTextUp: {
    color: Colors.error,
  },
  trendTextDown: {
    color: Colors.success,
  },
  trendTextStable: {
    color: Colors.text.light,
  },
});