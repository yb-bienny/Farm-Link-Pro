import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight, ArrowRight, Camera, MapPin } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import type { LocationObject } from 'expo-location'; // <-- type-only import
import { useUserStore } from '@/store/user-store';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: "Welcome to Farmer's Market Connect",
    description:
      'Track market prices, connect with buyers, and make informed decisions about your produce.',
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'profile',
    title: 'Create Your Profile',
    description: 'Tell us about yourself so buyers can find you and your products.',
  },
  {
    id: 'location',
    title: 'Set Your Location',
    description: 'We use your location to show you nearby markets and buyers.',
  },
  {
    id: 'complete',
    title: "You're All Set!",
    description: 'Start exploring market prices and connecting with buyers.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setProfile, setOnboarded } = useUserStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(1));

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [locationError, setLocationError] = useState('');

  const animateTransition = (forward: boolean) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: forward ? -width : width,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleNext = async () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      if (currentStep === 1 && !validateProfile()) {
        return;
      }
      if (currentStep === 2 && !location) {
        await requestLocation();
        if (!location) return;
      }
      animateTransition(true);
      setCurrentStep((prev) => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      animateTransition(false);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const validateProfile = () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return false;
    }
    return true;
  };

  const handleImagePick = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.length) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLocationError('');
    } catch (error) {
      setLocationError('Error getting location');
    }
  };

  const completeOnboarding = () => {
    setProfile({
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      profileImage,
      location
        ? {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }
        : undefined,
      productsOfInterest: [],
      isDataSharingEnabled: true,
      notificationsEnabled: true,
    });
    setOnboarded(true);
    router.replace('/');
  };

  const renderStep = () => {
    const step = ONBOARDING_STEPS[currentStep];

    return (
      <Animated.View
        style={[
          styles.stepContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {step.id === 'welcome' && (
          <View style={styles.welcomeStep}>
            <Image
              source={{ uri: step.image }}
              style={styles.welcomeImage}
              contentFit="cover"
              transition={500}
            />
            <View style={styles.overlay} />
            <View style={styles.welcomeContent}>
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.description}>{step.description}</Text>
            </View>
          </View>
        )}

        {step.id === 'profile' && (
          <View style={styles.formStep}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>

            <Pressable style={styles.imagePickerButton} onPress={handleImagePick}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View style={styles.imagePickerPlaceholder}>
                  <Camera size={32} color={Colors.primary} />
                  <Text style={styles.imagePickerText}>Add Photo</Text>
                </View>
              )}
            </Pressable>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={Colors.text.light}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email (Optional)</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={Colors.text.light}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone (Optional)</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Your phone number"
                placeholderTextColor={Colors.text.light}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        )}

        {step.id === 'location' && (
          <View style={styles.locationStep}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>

            <Pressable style={styles.locationButton} onPress={requestLocation}>
              <MapPin size={32} color={Colors.primary} />
              <Text style={styles.locationButtonText}>
                {location ? 'Location Set' : 'Set Location'}
              </Text>
            </Pressable>

            {locationError ? (
              <Text style={styles.errorText}>{locationError}</Text>
            ) : null}

            {location && (
              <Text style={styles.successText}>Location successfully captured!</Text>
            )}
          </View>
        )}

        {step.id === 'complete' && (
          <View style={styles.completeStep}>
            <View style={styles.successIcon}>
              <Text style={styles.successEmoji}>🎉</Text>
            </View>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  // Move paddingBottom calculation outside for clarity
  const footerPaddingBottom = Platform.OS === 'ios' ? 48 : 24;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: footerPaddingBottom }]}>
        <View style={styles.progressDots}>
          {ONBOARDING_STEPS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                currentStep === index && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttons}>
          {currentStep > 0 && (
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
          )}

          <Pressable
            style={[
              styles.nextButton,
              currentStep === 0 && styles.nextButtonWide,
            ]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === ONBOARDING_STEPS.length - 1
                ? 'Get Started'
                : 'Next'}
            </Text>
            <ArrowRight size={20} color="white" style={styles.nextButtonIcon} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  stepContainer: {
    flex: 1,
    padding: 24,
  },
  welcomeStep: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
  },
  welcomeContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  formStep: {
    flex: 1,
  },
  locationStep: {
    flex: 1,
    alignItems: 'center',
  },
  completeStep: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  imagePickerButton: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePickerPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.primary,
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
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text.primary,
  },
  locationButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    marginBottom: 16,
  },
  locationButtonText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 8,
  },
  successText: {
    fontSize: 14,
    color: Colors.success,
    textAlign: 'center',
    marginTop: 8,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successEmoji: {
    fontSize: 48,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  nextButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  nextButtonWide: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  nextButtonIcon: {
    marginLeft: 8,
  },
});