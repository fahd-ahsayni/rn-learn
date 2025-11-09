import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { api } from '@/convex/_generated/api';
import { useSignOutWithPresence } from '@/hooks/use-presence';
import { useQuery } from 'convex/react';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const isAuthenticated = useQuery(api.auth.isAuthenticated);
  const { signOut } = useSignOutWithPresence();

  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated === undefined) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Profile', headerShown: true }} />
      <SafeAreaView className='flex-1 p-4'>
        <View className="gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Text variant="h2">Profile</Text>
              </CardTitle>
              <CardDescription>
                <Text>Your account information</Text>
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-4">
              {isAuthenticated ? (
                <>
                  <View className="gap-2">
                    <Text variant="muted">Status</Text>
                    <Text variant="h3">Authenticated</Text>
                  </View>
                  <View className="gap-2">
                    <Text variant="muted">Account</Text>
                    <Text>You are signed in successfully</Text>
                  </View>
                </>
              ) : (
                <Text>Not authenticated</Text>
              )}
            </CardContent>
          </Card>

          <Button
            variant="destructive"
            onPress={handleSignOut}
            className="w-full"
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text>Sign Out</Text>}
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
}
