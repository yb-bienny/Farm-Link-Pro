import React from "react";
import { Tabs } from "expo-router";
import { Home, Map, Bell, Users, User } from "lucide-react-native";
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.light,
        tabBarStyle: {
          borderTopColor: Colors.border,
          backgroundColor: Colors.card,
        },
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTitleStyle: {
          color: Colors.text.primary,
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Market Prices",
          tabBarLabel: "Prices",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="markets"
        options={{
          title: "Markets",
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Price Alerts",
          tabBarLabel: "Alerts",
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="buyers"
        options={{
          title: "Buyers",
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}