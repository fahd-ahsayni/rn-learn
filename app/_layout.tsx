import '@/global.css';
import { Platform } from 'react-native';

import { api } from '@/convex/_generated/api';
import { NAV_THEME } from '@/lib/theme';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { ConvexReactClient, useQuery } from "convex/react";
import { Stack } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ActivityIndicator, View } from 'react-native';


const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ConvexAuthProvider client={convex} storage={Platform.OS === 'web' ? undefined : secureStorage}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <RootNavigator />
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}

function RootNavigator() {
  const { colorScheme } = useColorScheme();
  const isAuthenticated = useQuery(api.auth.isAuthenticated);

  if (isAuthenticated === undefined) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!isAuthenticated}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>
      </Stack>
      <PortalHost />
    </>
  );
}
