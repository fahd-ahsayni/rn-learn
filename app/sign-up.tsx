import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { api } from '@/convex/_generated/api';
import { THEME } from '@/lib/theme';
import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { Link, Redirect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
    const { signIn } = useAuthActions();
    const { colorScheme } = useColorScheme();
    const isAuthenticated = useQuery(api.auth.isAuthenticated);
    
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"signUp" | { email: string }>("signUp");
    const [data, setData] = useState({
        email: "",
        password: "",
        code: ""
    });

    const handleSignUp = async () => {
        if (!data.email || !data.password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (data.password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            // Sign up with email verification
            await signIn("password", { 
                email: data.email, 
                password: data.password, 
                flow: "signUp" 
            });
            // Move to verification step
            setStep({ email: data.email });
        } catch (error: any) {
            console.error('Sign up error:', error);
            Alert.alert('Error', error?.message || 'Sign up failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!data.code) {
            Alert.alert('Error', 'Please enter the verification code');
            return;
        }

        setLoading(true);
        try {
            await signIn("password", {
                email: typeof step === 'object' ? step.email : data.email,
                code: data.code,
                flow: "email-verification"
            });
            // Successfully verified and signed in
        } catch (error: any) {
            console.error('Verification error:', error);
            Alert.alert('Error', 'Invalid code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Redirect to home if already authenticated
    if (isAuthenticated === true) {
        return <Redirect href="/" />;
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
        <SafeAreaView className='flex-1 justify-center items-center'>
            <Text variant="h3">
                {step === "signUp" ? "Sign Up" : "Verify Email"}
            </Text>
            <Card className="w-3/4 mt-4 p-4 gap-4">
                {step === "signUp" ? (
                    <>
                        <Input
                            placeholder="Email"
                            value={data.email}
                            onChangeText={(text) => setData({ ...data, email: text })}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <Input
                            placeholder="Password"
                            value={data.password}
                            onChangeText={(text) => setData({ ...data, password: text })}
                            secureTextEntry
                        />
                        <Button onPress={handleSignUp} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator size="small" color={THEME[colorScheme || 'dark'].background} />
                            ) : (
                                <Text>Sign Up</Text>
                            )}
                        </Button>
                    </>
                ) : (
                    <>
                        <Text>
                            Enter the verification code sent to {typeof step === 'object' ? step.email : ''}
                        </Text>
                        <Input
                            placeholder="Verification Code"
                            value={data.code}
                            onChangeText={(text) => setData({ ...data, code: text })}
                            keyboardType="number-pad"
                        />
                        <Button onPress={handleVerifyCode} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator size="small" color={THEME[colorScheme || 'dark'].background} />
                            ) : (
                                <Text>Verify & Continue</Text>
                            )}
                        </Button>
                        <Button variant="outline" onPress={() => setStep("signUp")}>
                            <Text>Back</Text>
                        </Button>
                    </>
                )}
                <View>
                    <Text>
                        Already have an account?{' '}
                        <Link href="/sign-in" className='text-teal-500'>Sign In</Link>
                    </Text>
                </View>
            </Card>
        </SafeAreaView>
    );
}
