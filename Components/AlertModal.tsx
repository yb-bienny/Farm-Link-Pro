import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Pressable,
  TextInput,
  Switch,
  Platform
} from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useMarketStore } from '@/store/market-store';
import { MarketAlert } from '@/types/market';

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  productId: string;
  marketId: string;
  currentPrice?: number;
}

export default function AlertModal({ 
  visible, 
  onClose, 
  productId, 
  marketId,
  currentPrice = 0
}: AlertModalProps) {
  const { getProductById, getMarketById, addAlert } = useMarketStore();
  
  const [threshold, setThreshold] = useState(currentPrice.toString());
  const [alertType, setAlertType] = useState<'above' | 'below'>('below');
  
  const product = getProductById(productId);
  const market = getMarketById(marketId);
  
  if (!product || !market) return null;
  
  const handleCreateAlert = () => {
    const thresholdValue = parseFloat(threshold);
    
    if (isNaN(thresholdValue)) return;
    
    const alert: Omit<MarketAlert, 'id' | 'createdAt'> = {
      productId,
      marketId,
      threshold: thresholdValue,
      type: alertType,
      active: true,
    };
    
    addAlert(alert);
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Set Price Alert</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <X size={24} color={Colors.text.primary} />
            </Pressable>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.marketName}>{market.name}</Text>
            
            <Text style={styles.label}>Current Price: ₹{currentPrice.toFixed(2)}</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Alert me when price is:</Text>
              <View style={styles.alertTypeContainer}>
                <Pressable
                  style={[
                    styles.alertTypeButton,
                    alertType === 'below' && styles.alertTypeButtonSelected
                  ]}
                  onPress={() => setAlertType('below')}
                >
                  <Text
                    style={[
                      styles.alertTypeText,
                      alertType === 'below' && styles.alertTypeTextSelected
                    ]}
                  >
                    Below
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.alertTypeButton,
                    alertType === 'above' && styles.alertTypeButtonSelected
                  ]}
                  onPress={() => setAlertType('above')}
                >
                  <Text
                    style={[
                      styles.alertTypeText,
                      alertType === 'above' && styles.alertTypeTextSelected
                    ]}
                  >
                    Above
                  </Text>
                </Pressable>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Threshold Price (₹):</Text>
              <TextInput
                style={styles.input}
                value={threshold}
                onChangeText={setThreshold}
                keyboardType="numeric"
                placeholder="Enter price"
                placeholderTextColor={Colors.text.light}
              />
            </View>
          </View>
          
          <View style={styles.footer}>
            <Pressable
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.createButton}
              onPress={handleCreateAlert}
            >
              <Text style={styles.createButtonText}>Create Alert</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  content: {
    padding: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  marketName: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  alertTypeContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  alertTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  alertTypeButtonSelected: {
    backgroundColor: Colors.primary,
  },
  alertTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  alertTypeTextSelected: {
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  createButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});