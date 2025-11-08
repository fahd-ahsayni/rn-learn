import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { View } from 'react-native';
import { Switch } from './ui/switch';


export function TaskForm() {
    const [isCompleted, setIsCompleted] = useState(false);
    const [text, setText] = useState('');

    const addTask = useMutation(api.tasks.addTask);

    const onCheckedChange = (checked: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsCompleted(checked);
    }

    const handleChangeText = (value: string) => {
        setText(value);
    }

    const handleSave = async () => {
        try {
            await addTask({ text, isCompleted });
        } catch (error) {
            console.error("Error adding task:", error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Text>Open Dialog</Text>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <View className="grid gap-4">
                    <View className="grid gap-3">
                        <Label htmlFor="name-1">text</Label>
                        <Input id="name-1" defaultValue="Pedro Duarte" onChangeText={handleChangeText} />
                    </View>
                    <View className="grid gap-3">
                        <Switch
                            checked={isCompleted}
                            onCheckedChange={onCheckedChange}
                            id="airplane-mode"
                            nativeID="airplane-mode"
                        />
                        <Label nativeID="airplane-mode" htmlFor="airplane-mode">
                            Airplane Mode
                        </Label>
                    </View>
                </View>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">
                            <Text>Cancel</Text>
                        </Button>
                    </DialogClose>
                    <Button onPress={handleSave}>
                        <Text>Save changes</Text>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}