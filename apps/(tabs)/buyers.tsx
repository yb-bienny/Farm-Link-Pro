import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter } from 'lucide-react-native';
import { useMarketStore } from '@/store/market-store';
import BuyerCard from '@/components/BuyerCard';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { Buyer } from '@/types/market';

export default function BuyersScreen() {
  const router = useRouter();
  const { buyers, products } = useMarketStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [filteredBuyers, setFilteredBuyers] = useState<Buyer[]>([]);
  const [showProductFilter, setShowProductFilter] = useState(false);
  
  useEffect(() => {
    let filtered = [...buyers];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(buyer => 
        buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.location.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by selected product
    if (selectedProductId) {
      filtered = filtered.filter(buyer => 
        buyer.interestedProducts.includes(selectedProductId)
      );
    }
    
    setFilteredBuyers(filtered);
  }, [searchQuery, selectedProductId, buyers]);
  
  const handleBuyerPress = (buyer: Buyer) => {
    router.push(`/buyer/${buyer.id}`);
  };
  
  const toggleProductFilter = () => {
    setShowProductFilter(!showProductFilter);
    if (!showProductFilter) {
      setSelectedProductId(null);
    }
  };
  
  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId === selectedProductId ? null : productId);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.text.light} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search buyers..."
            placeholderTextColor={Colors.text.light}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable 
          style={[
            styles.filterButton,
            showProductFilter && styles.filterButtonActive
          ]}
          onPress={toggleProductFilter}
        >
          <Filter size={20} color={showProductFilter ? 'white' : Colors.text.primary} />
        </Pressable>
      </View>
      
      {showProductFilter && (
        <View style={styles.productFilterContainer}>
          <Text style={styles.filterTitle}>Filter by product interest:</Text>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.productFilterItem,
                  selectedProductId === item.id && styles.productFilterItemSelected
                ]}
                onPress={() => handleProductSelect(item.id)}
              >
                <Text
                  style={[
                    styles.productFilterText,
                    selectedProductId === item.id && styles.productFilterTextSelected
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
            contentContainerStyle={styles.productFilterList}
          />
        </View>
      )}
      
      <FlatList
        data={filteredBuyers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BuyerCard 
            buyer={item} 
            onPress={() => handleBuyerPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No buyers found"
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
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  productFilterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  productFilterList: {
    paddingBottom: 8,
  },
  productFilterItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productFilterItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  productFilterText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  productFilterTextSelected: {
    color: 'white',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
});