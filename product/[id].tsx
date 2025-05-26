import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  FlatList,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Star, 
  Bell, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  ChevronRight,
  Users
} from 'lucide-react-native';
import { useMarketStore } from '@/store/market-store';
import AlertModal from '@/components/AlertModal';
import Colors from '@/constants/colors';
import { Market, PriceData } from '@/types/market';
import { generateHistoricalPrices } from '@/mocks/markets';

export default function ProductDetailScreen() {
  const { id, marketId } = useLocalSearchParams<{ id: string; marketId?: string }>();
  const router = useRouter();
  
  const { 
    getProductById, 
    getMarketById, 
    getPriceForProductInMarket,
    priceData,
    toggleFavoriteProduct,
    favoriteProducts,
    buyers
  } = useMarketStore();
  
  const product = getProductById(id);
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(marketId || null);
  const selectedMarket = selectedMarketId ? getMarketById(selectedMarketId) : null;
  const currentPrice = selectedMarketId 
    ? getPriceForProductInMarket(id, selectedMarketId) 
    : null;
  
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [marketsWithProduct, setMarketsWithProduct] = useState<Market[]>([]);
  const [historicalPrices, setHistoricalPrices] = useState<{date: string; price: number}[]>([]);
  const [interestedBuyers, setInterestedBuyers] = useState([]);
  
  const isFavorite = favoriteProducts.includes(id);
  
  useEffect(() => {
    if (product) {
      // Find all markets that have this product
      const markets = priceData
        .filter(price => price.productId === product.id)
        .map(price => getMarketById(price.marketId))
        .filter(Boolean);
      
      setMarketsWithProduct(markets);
      
      // If no market is selected, select the first one
      if (!selectedMarketId && markets.length > 0) {
        setSelectedMarketId(markets[0].id);
      }
      
      // Find buyers interested in this product
      const interested = buyers.filter(buyer => 
        buyer.interestedProducts.includes(product.id)
      );
      setInterestedBuyers(interested);
    }
  }, [product, priceData, selectedMarketId]);
  
  useEffect(() => {
    if (product && selectedMarketId) {
      // Generate historical price data for charts
      const historical = generateHistoricalPrices(product.id, selectedMarketId);
      setHistoricalPrices(historical);
    }
  }, [product, selectedMarketId]);
  
  const handleToggleFavorite = () => {
    if (product) {
      toggleFavoriteProduct(product.id);
    }
  };
  
  const handleMarketSelect = (marketId: string) => {
    setSelectedMarketId(marketId);
  };
  
  const handleSetAlert = () => {
    setShowAlertModal(true);
  };
  
  const handleViewBuyers = () => {
    router.push(`/buyers?productId=${product?.id}`);
  };
  
  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          contentFit="cover"
          transition={200}
        />
        
        <View style={styles.productInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <Pressable onPress={handleToggleFavorite} hitSlop={10}>
              <Star
                size={24}
                color={isFavorite ? Colors.accent : Colors.text.light}
                fill={isFavorite ? Colors.accent : 'transparent'}
              />
            </Pressable>
          </View>
          
          <Text style={styles.categoryText}>{product.category}</Text>
          
          {currentPrice && (
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Current Price:</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{currentPrice.price.toFixed(2)}</Text>
                <Text style={styles.unit}>{currentPrice.unit}</Text>
                
                <View style={[
                  styles.trendContainer,
                  currentPrice.trend === 'up' ? styles.trendUp : 
                  currentPrice.trend === 'down' ? styles.trendDown : 
                  styles.trendStable
                ]}>
                  {currentPrice.trend === 'up' ? (
                    <ArrowUp size={16} color={Colors.error} />
                  ) : currentPrice.trend === 'down' ? (
                    <ArrowDown size={16} color={Colors.success} />
                  ) : (
                    <Minus size={16} color={Colors.text.light} />
                  )}
                  <Text style={[
                    styles.trendText,
                    currentPrice.trend === 'up' ? styles.trendTextUp : 
                    currentPrice.trend === 'down' ? styles.trendTextDown : 
                    styles.trendTextStable
                  ]}>
                    {Math.abs(currentPrice.percentChange).toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          )}
          
          {selectedMarket && (
            <Pressable 
              style={styles.marketButton}
              onPress={() => router.push(`/market/${selectedMarket.id}`)}
            >
              <Text style={styles.marketButtonText}>
                {selectedMarket.name}
              </Text>
              <ChevronRight size={16} color={Colors.primary} />
            </Pressable>
          )}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available at {marketsWithProduct.length} Markets</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.marketsContainer}
        >
          {marketsWithProduct.map(market => {
            const price = getPriceForProductInMarket(product.id, market.id);
            const isSelected = selectedMarketId === market.id;
            
            return (
              <Pressable
                key={market.id}
                style={[
                  styles.marketCard,
                  isSelected && styles.selectedMarketCard
                ]}
                onPress={() => handleMarketSelect(market.id)}
              >
                <Text 
                  style={[
                    styles.marketCardName,
                    isSelected && styles.selectedMarketCardText
                  ]}
                  numberOfLines={1}
                >
                  {market.name}
                </Text>
                {price && (
                  <Text 
                    style={[
                      styles.marketCardPrice,
                      isSelected && styles.selectedMarketCardText
                    ]}
                  >
                    ₹{price.price.toFixed(2)}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      
      {historicalPrices.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Trend (Last 30 Days)</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartYAxis}>
              {[0, 1, 2, 3, 4].map((_, index) => {
                const max = Math.max(...historicalPrices.map(p => p.price));
                const min = Math.min(...historicalPrices.map(p => p.price));
                const range = max - min;
                const value = max - (range * (index / 4));
                
                return (
                  <Text key={index} style={styles.chartYLabel}>
                    ₹{value.toFixed(1)}
                  </Text>
                );
              })}
            </View>
            
            <View style={styles.chart}>
              {historicalPrices.map((point, index) => {
                const max = Math.max(...historicalPrices.map(p => p.price));
                const min = Math.min(...historicalPrices.map(p => p.price));
                const range = max - min;
                const height = range === 0 ? 50 : ((point.price - min) / range) * 100;
                
                return (
                  <View key={index} style={styles.chartBarContainer}>
                    <View 
                      style={[
                        styles.chartBar,
                        { height: `${height}%` },
                        index === historicalPrices.length - 1 && styles.chartBarCurrent
                      ]} 
                    />
                    {index % 5 === 0 && (
                      <Text style={styles.chartXLabel}>
                        {new Date(point.date).getDate()}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      )}
      
      {interestedBuyers.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {interestedBuyers.length} Interested Buyers
            </Text>
            <Pressable onPress={handleViewBuyers}>
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>
          
          <View style={styles.buyersContainer}>
            {interestedBuyers.slice(0, 3).map(buyer => (
              <Pressable
                key={buyer.id}
                style={styles.buyerCard}
                onPress={() => router.push(`/buyer/${buyer.id}`)}
              >
                {buyer.profileImage ? (
                  <Image
                    source={{ uri: buyer.profileImage }}
                    style={styles.buyerImage}
                    contentFit="cover"
                    transition={200}
                  />
                ) : (
                  <View style={[styles.buyerImage, styles.buyerImagePlaceholder]}>
                    <Text style={styles.buyerInitial}>{buyer.name.charAt(0)}</Text>
                  </View>
                )}
                <Text style={styles.buyerName} numberOfLines={1}>{buyer.name}</Text>
                <Text style={styles.buyerLocation} numberOfLines={1}>
                  {buyer.location.city}
                </Text>
              </Pressable>
            ))}
            
            {interestedBuyers.length > 3 && (
              <Pressable
                style={styles.moreBuyersCard}
                onPress={handleViewBuyers}
              >
                <View style={styles.moreBuyersIcon}>
                  <Users size={24} color={Colors.primary} />
                </View>
                <Text style={styles.moreBuyersText}>
                  +{interestedBuyers.length - 3} more
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
      
      <View style={styles.actions}>
        <Pressable 
          style={styles.actionButton}
          onPress={handleSetAlert}
        >
          <Bell size={20} color="white" style={styles.actionIcon} />
          <Text style={styles.actionText}>Set Price Alert</Text>
        </Pressable>
      </View>
      
      {showAlertModal && selectedMarketId && currentPrice && (
        <AlertModal
          visible={showAlertModal}
          onClose={() => setShowAlertModal(false)}
          productId={product.id}
          marketId={selectedMarketId}
          currentPrice={currentPrice.price}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productInfo: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  categoryText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  priceContainer: {
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  unit: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
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
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
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
  marketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
  },
  marketButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  marketsContainer: {
    paddingBottom: 8,
  },
  marketCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedMarketCard: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  marketCardName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  marketCardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  selectedMarketCardText: {
    color: 'white',
  },
  chartContainer: {
    height: 200,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    paddingBottom: 24,
  },
  chartYAxis: {
    width: 40,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  chartYLabel: {
    fontSize: 10,
    color: Colors.text.light,
  },
  chart: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  chartBarContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: 6,
    backgroundColor: Colors.secondary,
    borderRadius: 3,
  },
  chartBarCurrent: {
    backgroundColor: Colors.primary,
    width: 8,
  },
  chartXLabel: {
    fontSize: 10,
    color: Colors.text.light,
    marginTop: 4,
  },
  buyersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buyerCard: {
    width: '30%',
    marginRight: '5%',
    marginBottom: 16,
    alignItems: 'center',
  },
  buyerCard3n: {
    marginRight: 0,
  },
  buyerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  buyerImagePlaceholder: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyerInitial: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buyerName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 2,
  },
  buyerLocation: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  moreBuyersCard: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBuyersIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  moreBuyersText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    textAlign: 'center',
  },
  actions: {
    padding: 16,
    paddingBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  errorText: {
    fontSize: 18,
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: 24,
  },
});