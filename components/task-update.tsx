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
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { View } from 'react-native';
import { Switch } from './ui/switch';


export function TaskFormUpdate({ id }: { id: Id<"tasks">}) {
    
    const updateTaskById = useMutation(api.tasks.taskUpdate);
    const task = useQuery(api.tasks.getTaskById, { id });
    
    const [isCompleted, setIsCompleted] = useState(task ? task.isCompleted : false);
    const [text, setText] = useState(task ? task.text : '');

    const onCheckedChange = (checked: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsCompleted(checked);
    }

    const handleChangeText = (value: string) => {
        setText(value);
    }
    const handleSave = async () => {
        try {
            await updateTaskById({ isCompleted, text, id: id });
        } catch (error) {
            console.error("Error updating task:", error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Text>Update</Text>
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
                        <Input id="name-1" defaultValue="Pedro Duarte" value={text} onChangeText={handleChangeText} />
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