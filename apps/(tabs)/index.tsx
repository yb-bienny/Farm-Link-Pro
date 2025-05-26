import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter } from 'lucide-react-native';
import { useMarketStore } from '@/store/market-store';
import { useUserStore } from '@/store/user-store';
import PriceCard from '@/components/PriceCard';
import CategoryFilter from '@/components/CategoryFilter';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { PriceData } from '@/types/market';

export default function MarketPricesScreen() {
  const router = useRouter();
  const { priceData, products, getProductById } = useMarketStore();
  const { isOnboarded } = useUserStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredPrices, setFilteredPrices] = useState<PriceData[]>([]);
  
  useEffect(() => {
    if (!isOnboarded) {
      router.replace('/onboarding');
    }
  }, [isOnboarded]);
  
  useEffect(() => {
    let filtered = [...priceData];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(price => {
        const product = getProductById(price.productId);
        return product?.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(price => {
        const product = getProductById(price.productId);
        return product?.category === selectedCategory;
      });
    }
    
    setFilteredPrices(filtered);
  }, [searchQuery, selectedCategory, priceData]);
  
  const handlePriceCardPress = (priceData: PriceData) => {
    router.push(`/product/${priceData.productId}?marketId=${priceData.marketId}`);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.text.light} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={Colors.text.light}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable style={styles.filterButton}>
          <Filter size={20} color={Colors.text.primary} />
        </Pressable>
      </View>
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <FlatList
        data={filteredPrices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PriceCard 
            priceData={item} 
            onPress={() => handlePriceCardPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No prices found"
            message="Try changing your search or filter criteria"
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
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.card,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
});