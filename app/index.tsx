import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const isAuthenticated = useQuery(api.auth.isAuthenticated);

  // Show loading state while checking authentication
  if (isAuthenticated === undefined) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect based on authentication status
  return <Redirect href={isAuthenticated ? '/(tabs)/' as any : '/sign-in'} />;
}
