import { Icon } from '@/components/ui/icon';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Redirect, Tabs } from 'expo-router';
import { HomeIcon, UserIcon } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';

export default function TabsLayout() {
  const isAuthenticated = useQuery(api.auth.isAuthenticated);

  // Redirect to sign-in if not authenticated
  if (isAuthenticated === false) {
    return <Redirect href="/sign-in" />;
  }

  // Show loading state
  if (isAuthenticated === undefined) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon as={HomeIcon} className="text-foreground" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon as={UserIcon} className="text-foreground" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
