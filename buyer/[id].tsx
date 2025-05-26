import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Linking, 
  Platform 
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle,
  MessageCircle
} from 'lucide-react-native';
import { useMarketStore } from '@/store/market-store';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';

export default function BuyerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { getBuyerById, getProductById } = useMarketStore();
  const buyer = getBuyerById(id);
  
  const handleCallPress = () => {
    if (buyer?.contactPhone && Platform.OS !== 'web') {
      Linking.openURL(`tel:${buyer.contactPhone}`);
    }
  };
  
  const handleEmailPress = () => {
    if (buyer?.email) {
      Linking.openURL(`mailto:${buyer.email}`);
    }
  };
  
  const handleMessagePress = () => {
    if (buyer?.contactPhone && Platform.OS !== 'web') {
      Linking.openURL(`sms:${buyer.contactPhone}`);
    }
  };
  
  const handleDirectionsPress = () => {
    if (buyer && Platform.OS !== 'web') {
      const { latitude, longitude } = buyer.location;
      const url = Platform.select({
        ios: `maps:0,0?q=${latitude},${longitude}`,
        android: `geo:0,0?q=${latitude},${longitude}`,
      });
      
      if (url) {
        Linking.openURL(url);
      }
    } else if (buyer && Platform.OS === 'web') {
      const { latitude, longitude } = buyer.location;
      window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank');
    }
  };
  
  if (!buyer) {
    return (
      <EmptyState
        title="Buyer not found"
        message="The buyer you're looking for doesn't exist"
      />
    );
  }
  
  return (
    <ScrollView style={styles.container}>
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
            <View style={styles.nameRow}>
              <Text style={styles.name}>{buyer.name}</Text>
              {buyer.verified && (
                <CheckCircle size={16} color={Colors.success} style={styles.verifiedIcon} />
              )}
            </View>
            
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
        
        <View style={styles.contactInfo}>
          <View style={styles.infoRow}>
            <MapPin size={18} color={Colors.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {buyer.location.address ? `${buyer.location.address}, ` : ''}
              {buyer.location.city}, {buyer.location.state}
            </Text>
          </View>
          
          {buyer.email && (
            <View style={styles.infoRow}>
              <Mail size={18} color={Colors.primary} style={styles.infoIcon} />
              <Text style={styles.infoText}>{buyer.email}</Text>
            </View>
          )}
          
          {buyer.contactPhone && (
            <View style={styles.infoRow}>
              <Phone size={18} color={Colors.primary} style={styles.infoIcon} />
              <Text style={styles.infoText}>{buyer.contactPhone}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.actions}>
          {buyer.contactPhone && (
            <Pressable 
              style={styles.actionButton}
              onPress={handleCallPress}
            >
              <Phone size={18} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Call</Text>
            </Pressable>
          )}
          
          {buyer.email && (
            <Pressable 
              style={styles.actionButton}
              onPress={handleEmailPress}
            >
              <Mail size={18} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Email</Text>
            </Pressable>
          )}
          
          {buyer.contactPhone && (
            <Pressable 
              style={styles.actionButton}
              onPress={handleMessagePress}
            >
              <MessageCircle size={18} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Message</Text>
            </Pressable>
          )}
          
          <Pressable 
            style={styles.actionButton}
            onPress={handleDirectionsPress}
          >
            <MapPin size={18} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Directions</Text>
          </Pressable>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interested In</Text>
        <View style={styles.productsList}>
          {buyer.interestedProducts.map(productId => {
            const product = getProductById(productId);
            if (!product) return null;
            
            return (
              <Pressable
                key={productId}
                style={styles.productCard}
                onPress={() => router.push(`/product/${productId}`)}
              >
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  contentFit="cover"
                  transition={200}
                />
                <Text style={styles.productName}>{product.name}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          {buyer.name} is a verified buyer interested in purchasing agricultural products directly from farmers.
          They have been in the business for several years and maintain a strong reputation for fair pricing and timely payments.
        </Text>
      </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profilePlaceholder: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
    marginRight: 8,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 18,
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
  contactInfo: {
    marginBottom: 16,
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
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  productsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  productCard: {
    width: '30%',
    marginRight: '5%',
    marginBottom: 16,
    alignItems: 'center',
  },
  productCard3n: {
    marginRight: 0,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text.secondary,
  },
});