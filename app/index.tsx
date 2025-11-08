import { TaskForm } from '@/components/task-form';
import { TaskFormUpdate } from '@/components/task-update';
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
import { View } from 'react-native';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const SCREEN_OPTIONS = {
  title: 'React Native Reusables',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

export default function Screen() {
  const tasks = useQuery(api.tasks.getTasks)
  const taskWithId = useQuery(api.tasks.getTaskById, {
    id: "j57dkdsc6taq87fv7vyxe556qn7tyy91" as Id<"tasks">
  })

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
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <TaskForm />
        {/* Single task by ID */}
        {taskWithId && (
          <Card key={taskWithId._id}>
            <CardContent>
              <CardHeader>
                <Text>Single Task: {taskWithId._id}</Text>
              </CardHeader>
              <CardDescription>
                <Text variant="h3">{taskWithId.text}</Text>
                <Text>Completed: {taskWithId.isCompleted ? 'Yes' : 'No'}</Text>
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {/* All tasks */}
        <View>
          {
            tasks?.map(task => (
              <Card key={task._id}>
                <CardContent>
                  <CardHeader>
                    <Text>{task._id}</Text>
                  </CardHeader>
                  <CardDescription>
                    <Text variant="h3">{task.text}</Text>
                  </CardDescription>
                  <CardFooter>
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
            ))
          }
        </View>
      </View>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [checked, setChecked] = React.useState(false);
  function onCheckedChange(checked: boolean) {
    setChecked(checked);
  }



  return (
    <>
      <Button
        onPressIn={toggleColorScheme}
        size="icon"
        className="ios:size-9 rounded-full web:mx-4">
        <Icon as={THEME_ICONS[colorScheme ?? "light"]} className="size-5 text-background" />
      </Button>
    </>
  );
}
