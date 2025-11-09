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

const SCREEN_OPTIONS = {
  title: 'Tasks',
  headerShown: true,
  headerRight: () => <ThemeToggle />,
};

export default function HomeScreen() {
  const tasks = useQuery(api.tasks.getTasks);
  const allUsers = useQuery(api.users.getAllUsers);


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

          {
            allUsers?.map(user => (
              <View className='flex-row'>
                <Avatar alt=''>
                  <AvatarFallback>
                    <Text>
                      {user.email?.charAt(0).toUpperCase() ?? "?"}
                    </Text>
                  </AvatarFallback>
                </Avatar>
                <View>
                  <Text>{user.email}</Text>
                  <Text>{user.online ? "Online" : "Offline"}</Text>
                </View>
              </View>
            ))
          }
          {/* All tasks */}
          <View className="w-full gap-4">
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
