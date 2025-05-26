import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/colors';

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.primary,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="market/[id]" 
          options={{ 
            title: "Market Details",
            presentation: "card",
          }} 
        />
        <Stack.Screen 
          name="product/[id]" 
          options={{ 
            title: "Product Details",
            presentation: "card",
          }} 
        />
        <Stack.Screen 
          name="buyer/[id]" 
          options={{ 
            title: "Buyer Details",
            presentation: "card",
          }} 
        />
        <Stack.Screen 
          name="onboarding" 
          options={{ 
            headerShown: false,
            presentation: "fullScreenModal",
          }} 
        />
      </Stack>
    </>
  );
}