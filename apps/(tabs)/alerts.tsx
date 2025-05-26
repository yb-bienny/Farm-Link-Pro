import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Trash2 } from 'lucide-react-native';
import { useMarketStore } from '@/store/market-store';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';

export default function AlertsScreen() {
  const router = useRouter();
  const { 
    alerts, 
    getProductById, 
    getMarketById, 
    getPriceForProductInMarket,
    toggleAlertActive,
    removeAlert
  } = useMarketStore();
  
  const handleAlertPress = (alertId: string, productId: string, marketId: string) => {
    router.push(`/product/${productId}?marketId=${marketId}`);
  };
  
  const renderAlertItem = ({ item }) => {
    const product = getProductById(item.productId);
    const market = getMarketById(item.marketId);
    const currentPrice = getPriceForProductInMarket(item.productId, item.marketId);
    
    if (!product || !market || !currentPrice) return null;
    
    const isTriggered = item.type === 'above' 
      ? currentPrice.price > item.threshold
      : currentPrice.price < item.threshold;
    
    return (
      <View style={[
        styles.alertCard,
        isTriggered && styles.triggeredCard
      ]}>
        <View style={styles.alertHeader}>
          <View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.marketName}>{market.name}</Text>
          </View>
          
          <View style={styles.alertActions}>
            <Switch
              value={item.active}
              onValueChange={() => toggleAlertActive(item.id)}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="white"
            />
            <Pressable 
              style={styles.deleteButton}
              onPress={() => removeAlert(item.id)}
              hitSlop={8}
            >
              <Trash2 size={18} color={Colors.error} />
            </Pressable>
          </View>
        </View>
        
        <View style={styles.alertInfo}>
          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>Current:</Text>
            <Text style={styles.priceValue}>₹{currentPrice.price.toFixed(2)}</Text>
          </View>
          
          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>Alert {item.type === 'above' ? '>' : '<'}:</Text>
            <Text style={styles.priceValue}>₹{item.threshold.toFixed(2)}</Text>
          </View>
          
          {isTriggered && (
            <View style={styles.triggeredBadge}>
              <Bell size={14} color="white" />
              <Text style={styles.triggeredText}>Triggered</Text>
            </View>
          )}
        </View>
        
        <Pressable
          style={styles.viewButton}
          onPress={() => handleAlertPress(item.id, item.productId, item.marketId)}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </Pressable>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={renderAlertItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon={<Bell size={48} color={Colors.text.light} />}
            title="No price alerts set"
            message="Set alerts to get notified when prices change for your products"
            action={
              <Pressable
                style={styles.createAlertButton}
                onPress={() => router.push('/')}
              >
                <Text style={styles.createAlertButtonText}>Browse Products</Text>
              </Pressable>
            }
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
  listContent: {
    padding: 16,
    paddingTop: 16,
  },
  alertCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  triggeredCard: {
    borderLeftColor: Colors.error,
    backgroundColor: 'rgba(211, 47, 47, 0.05)',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  marketName: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  alertActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
  },
  alertInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  priceInfo: {
    marginRight: 24,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  triggeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  triggeredText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  viewButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  viewButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  createAlertButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createAlertButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});