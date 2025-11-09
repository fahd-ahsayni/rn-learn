import { TaskForm } from '@/components/task-form';
import { TaskFormUpdate } from '@/components/task-update';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Stack } from 'expo-router';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { useGlobalPresence } from '@/hooks/use-presence';

const SCREEN_OPTIONS = {
  title: 'Tasks',
  headerShown: true,
  headerRight: () => <ThemeToggle />,
};

export default function HomeScreen() {
  const tasks = useQuery(api.tasks.getTasks);
  const allUsers = useQuery(api.users.getAllUsers);
  const currentUser = useQuery(api.users.viewer);

  // Only track presence if user is authenticated (currentUser exists)
  const shouldTrackPresence = currentUser !== null && currentUser !== undefined;
  const userName = currentUser?.name || currentUser?.email || "Anonymous User";
  
  // Set up presence tracking only if user is authenticated
  const presenceUsers = useGlobalPresence(
    shouldTrackPresence ? userName : ""
  );

  const deleteTaskById = useMutation(api.tasks.deleteTaskById);

  const handleDelete = async (taskId: Id<"tasks">) => {
    try {
      await deleteTaskById({ id: taskId });
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScrollView className="flex-1">
        <View className="items-center justify-center gap-8 p-4">
          <TaskForm />

          {/* All Users List with Presence Status */}
          {allUsers && allUsers.length > 0 && (
            <View className="w-full gap-2">
              <Text variant="h2">All Users</Text>
              <View className="gap-2">
                {allUsers.map(user => {
                  // Check if user is online by finding them in presenceUsers
                  const isOnline = presenceUsers?.some(p => p.userId === user._id) ?? false;
                  
                  return (
                    <View key={user._id} className='flex-row items-center gap-3 rounded-lg bg-card p-3'>
                      <Avatar alt=''>
                        <AvatarFallback>
                          <Text>
                            {user.email?.charAt(0).toUpperCase() ?? "?"}
                          </Text>
                        </AvatarFallback>
                      </Avatar>
                      <View className="flex-1">
                        <Text>{user.name || user.email || "Anonymous"}</Text>
                        <Text className={isOnline ? "text-green-500" : "text-gray-500"}>
                          {isOnline ? "Online" : "Offline"}
                        </Text>
                      </View>
                      {isOnline && (
                        <View className="h-3 w-3 rounded-full bg-green-500" />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* All tasks */}
          <View className="w-full gap-4">
            <Text variant="h2">Tasks</Text>
            {tasks?.map(task => (
              <Card key={task._id}>
                <CardContent>
                  <CardHeader>
                    <Text>{task._id}</Text>
                  </CardHeader>
                  <CardDescription>
                    <Text variant="h3">{task.text}</Text>
                  </CardDescription>
                  <CardFooter className="flex-row gap-2">
                    <Button
                      variant="destructive"
                      onPress={() => handleDelete(task._id)}
                    >
                      <Text>Delete</Text>
                    </Button>
                    <TaskFormUpdate id={task._id} />
                  </CardFooter>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? "light"]} className="size-5 text-background" />
    </Button>
  );
}
