import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Switch,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Settings, 
  Shield, 
  LogOut,
  Camera,
  Wifi,
  WifiOff
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '@/store/user-store';
import { useMarketStore } from '@/store/market-store';
import Colors from '@/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { 
    profile, 
    updateProfile, 
    setOfflineMode, 
    isOfflineMode,
    logout
  } = useUserStore();
  const { products, getFavoriteProducts } = useMarketStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile?.name || '');
  const [editedEmail, setEditedEmail] = useState(profile?.email || '');
  const [editedPhone, setEditedPhone] = useState(profile?.phone || '');
  
  const favoriteProducts = getFavoriteProducts();
  
  const handleImagePick = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to change profile picture.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        updateProfile({ profileImage: result.assets[0].uri });
      }
    }
  };
  
  const handleSaveProfile = () => {
    updateProfile({
      name: editedName,
      email: editedEmail,
      phone: editedPhone,
    });
    setIsEditing(false);
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            router.replace('/onboarding');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  if (!profile) {
    return null;
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {profile.profileImage ? (
            <Image
              source={{ uri: profile.profileImage }}
              style={styles.profileImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={[styles.profileImage, styles.profilePlaceholder]}>
              <Text style={styles.profileInitial}>{profile.name.charAt(0)}</Text>
            </View>
          )}
          
          <Pressable 
            style={styles.cameraButton}
            onPress={handleImagePick}
          >
            <Camera size={16} color="white" />
          </Pressable>
        </View>
        
        {isEditing ? (
          <View style={styles.editForm}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Your name"
                placeholderTextColor={Colors.text.light}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editedEmail}
                onChangeText={setEditedEmail}
                placeholder="Your email"
                placeholderTextColor={Colors.text.light}
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editedPhone}
                onChangeText={setEditedPhone}
                placeholder="Your phone number"
                placeholderTextColor={Colors.text.light}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.editActions}>
              <Pressable 
                style={[styles.editButton, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={[styles.editButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.profileName}>{profile.name}</Text>
            
            <View style={styles.profileInfo}>
              {profile.email && (
                <View style={styles.infoRow}>
                  <Mail size={16} color={Colors.primary} style={styles.infoIcon} />
                  <Text style={styles.infoText}>{profile.email}</Text>
                </View>
              )}
              
              {profile.phone && (
                <View style={styles.infoRow}>
                  <Phone size={16} color={Colors.primary} style={styles.infoIcon} />
                  <Text style={styles.infoText}>{profile.phone}</Text>
                </View>
              )}
              
              {profile.location && (
                <View style={styles.infoRow}>
                  <MapPin size={16} color={Colors.primary} style={styles.infoIcon} />
                  <Text style={styles.infoText}>
                    {profile.location.address ? `${profile.location.address}, ` : ''}
                    {profile.location.city ? `${profile.location.city}, ` : ''}
                    {profile.location.state || ''}
                  </Text>
                </View>
              )}
            </View>
            
            <Pressable 
              style={styles.editProfileButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </Pressable>
          </>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorite Products</Text>
        {favoriteProducts.length > 0 ? (
          <View style={styles.favoriteProductsContainer}>
            {favoriteProducts.map(product => (
              <Pressable 
                key={product.id}
                style={styles.favoriteProduct}
                onPress={() => router.push(`/product/${product.id}`)}
              >
                <Image
                  source={{ uri: product.image }}
                  style={styles.favoriteProductImage}
                  contentFit="cover"
                  transition={200}
                />
                <Text style={styles.favoriteProductName}>{product.name}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No favorite products yet</Text>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            {isOfflineMode ? (
              <WifiOff size={20} color={Colors.text.primary} style={styles.settingIcon} />
            ) : (
              <Wifi size={20} color={Colors.text.primary} style={styles.settingIcon} />
            )}
            <Text style={styles.settingText}>Offline Mode</Text>
          </View>
          <Switch
            value={isOfflineMode}
            onValueChange={setOfflineMode}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="white"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Settings size={20} color={Colors.text.primary} style={styles.settingIcon} />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={profile.notificationsEnabled}
            onValueChange={(value) => updateProfile({ notificationsEnabled: value })}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="white"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Shield size={20} color={Colors.text.primary} style={styles.settingIcon} />
            <Text style={styles.settingText}>Data Sharing</Text>
          </View>
          <Switch
            value={profile.isDataSharingEnabled}
            onValueChange={(value) => updateProfile({ isDataSharingEnabled: value })}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="white"
          />
        </View>
      </View>
      
      <Pressable 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LogOut size={20} color={Colors.error} style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
      
      <Text style={styles.versionText}>
        Farmer's Market Connect v1.0.0
        {profile.lastSyncTimestamp && (
          `\nLast synced: ${new Date(profile.lastSyncTimestamp).toLocaleString()}`
        )}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePlaceholder: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  profileInfo: {
    width: '100%',
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
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  editProfileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  editForm: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
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
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  favoriteProductsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  favoriteProduct: {
    width: '30%',
    marginRight: '5%',
    marginBottom: 16,
    alignItems: 'center',
  },
  favoriteProduct3n: {
    marginRight: 0,
  },
  favoriteProductImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginBottom: 8,
  },
  favoriteProductName: {
    fontSize: 14,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.light,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.text.light,
    marginBottom: 24,
  },
});