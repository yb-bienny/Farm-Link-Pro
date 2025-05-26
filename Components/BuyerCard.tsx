import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MapPin, Mail, Phone, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Buyer } from '@/types/market';
import { useMarketStore } from '@/store/market-store';

interface BuyerCardProps {
  buyer: Buyer;
  onPress?: () => void;
}

export default function BuyerCard({ buyer, onPress }: BuyerCardProps) {
  const { getProductById } = useMarketStore();
  
  return (
    <Pressable 
      style={styles.container}
      onPress={onPress}
      android_ripple={{ color: Colors.border }}
    >
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          {buyer.profileImage ? (
            <Image
              source={{ uri: buyer.profileImage }}
              style={styles.profileImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={[styles.profileImage, styles.profilePlaceholder]}>
              <Text style={styles.profileInitial}>{buyer.name.charAt(0)}</Text>
            </View>
          )}
          
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{buyer.name}</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text 
                  key={star} 
                  style={[
                    styles.star, 
                    star <= buyer.rating ? styles.starFilled : styles.starEmpty
                  ]}
                >
                  ★
                </Text>
              ))}
              <Text style={styles.ratingText}>{buyer.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
        
        {buyer.verified && (
          <View style={styles.verifiedBadge}>
            <CheckCircle size={16} color={Colors.success} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoRow}>
        <MapPin size={16} color={Colors.primary} style={styles.icon} />
        <Text style={styles.infoText}>
          {buyer.location.address ? `${buyer.location.address}, ` : ''}
          {buyer.location.city}, {buyer.location.state}
        </Text>
      </View>
      
      {buyer.email && (
        <View style={styles.infoRow}>
          <Mail size={16} color={Colors.primary} style={styles.icon} />
          <Text style={styles.infoText}>{buyer.email}</Text>
        </View>
      )}
      
      {buyer.contactPhone && (
        <View style={styles.infoRow}>
          <Phone size={16} color={Colors.primary} style={styles.icon} />
          <Text style={styles.infoText}>{buyer.contactPhone}</Text>
        </View>
      )}
      
      <View style={styles.productsContainer}>
        <Text style={styles.productsTitle}>Interested in:</Text>
        <View style={styles.productsList}>
          {buyer.interestedProducts.map((productId) => {
            const product = getProductById(productId);
            return product ? (
              <View key={productId} style={styles.productTag}>
                <Text style={styles.productTagText}>{product.name}</Text>
              </View>
            ) : null;
          })}
        </View>
      </View>
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  profilePlaceholder: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  starFilled: {
    color: Colors.accent,
  },
  starEmpty: {
    color: Colors.border,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.success,
    marginLeft: 4,
    fontWeight: '500',
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
  productsContainer: {
    marginTop: 8,
  },
  productsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  productsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  productTag: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  productTagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
});