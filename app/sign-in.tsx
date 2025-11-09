import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { api } from "@/convex/_generated/api";
import { THEME } from '@/lib/theme';
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { makeRedirectUri } from "expo-auth-session";
import { Link, Redirect } from 'expo-router';
import { openAuthSessionAsync } from "expo-web-browser";
import { Github } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
    const { colorScheme } = useColorScheme();
    const { signIn } = useAuthActions();
    const isAuthenticated = useQuery(api.auth.isAuthenticated);

    const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        email: "",
        password: "",
        code: "",
        newPassword: ""
    });

    const handleSignInGithub = async () => {
        try {
            // For Expo Go, use the dynamic IP-based redirect
            const redirectUri = makeRedirectUri({
                scheme: 'rn-learn'
            });

            console.log('Redirect URI:', redirectUri);

            // Get the GitHub OAuth URL from Convex
            const result = await signIn("github", { redirectTo: redirectUri });

            if (Platform.OS === "web") {
                // On web, the redirect happens automatically
                return;
            }

            // For Expo Go on iOS/Android
            if (result?.redirect) {
                const authResult = await openAuthSessionAsync(
                    result.redirect.toString(),
                    redirectUri
                );

                if (authResult.type === "success") {
                    const { url } = authResult;
                    const code = new URL(url).searchParams.get("code");

                    if (code) {
                        // Complete the OAuth flow with the code
                        await signIn("github", { code });
                    }
                }
            }
        } catch (error) {
            console.error("GitHub sign-in error:", error);
            Alert.alert("Error", "Failed to sign in with GitHub");
        }
    };

    const handleSignIn = async () => {
        setLoading(true);
        try {
            await signIn("password", {
                email: data.email,
                password: data.password,
                flow: "signIn"
            });
        } catch (error: any) {
            console.error('Sign in error:', error);

            // Check for specific error types
            if (error?.message?.includes('InvalidAccountId')) {
                Alert.alert('Email Not Found', 'No account exists with this email. Please sign up first.');
            } else if (error?.message?.includes('InvalidSecret')) {
                Alert.alert('Invalid Password', 'The password you entered is incorrect. Try again or use "Forgot Password".');
            } else {
                Alert.alert('Error', 'Sign in failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!data.email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        setLoading(true);
        try {
            await signIn("password", {
                email: data.email,
                flow: "reset"
            });
            setStep({ email: data.email });
        } catch (error: any) {
            console.error('Forgot password error:', error);

            // Check for specific error types
            if (error?.message?.includes('InvalidAccountId')) {
                Alert.alert(
                    'Email Not Found',
                    'No account exists with this email address. Please check your email or sign up.'
                );
            } else if (error?.message?.includes('SITE_URL')) {
                Alert.alert(
                    'Configuration Error',
                    'Password reset is not properly configured. Please contact support.'
                );
            } else if (error?.message?.includes('Could not send')) {
                Alert.alert(
                    'Resend API Error',
                    'Cannot send email. Please verify:\n\n1. Your Resend API key is valid\n2. Your email domain is verified in Resend\n3. The recipient email is verified (free tier)\n\nFor testing, consider implementing a different reset method.'
                );
            } else if (error?.message?.includes('AUTH_RESEND_KEY')) {
                Alert.alert(
                    'Email Service Error',
                    'Unable to send reset code. Email service is not configured. Please contact support.'
                );
            } else {
                Alert.alert('Error', `Failed to send reset code: ${error?.message || 'Unknown error'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!data.code || !data.newPassword) {
            Alert.alert('Error', 'Please enter code and new password');
            return;
        }

        if (data.newPassword.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            await signIn("password", {
                email: typeof step === 'object' ? step.email : data.email,
                code: data.code,
                newPassword: data.newPassword,
                flow: "reset-verification"
            });
            Alert.alert('Success', 'Password reset successfully!');
            setStep("signIn");
            setData({ ...data, code: "", newPassword: "" });
        } catch (error) {
            console.error('Reset password error:', error);
            Alert.alert('Error', 'Invalid code or failed to reset password');
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
                {step === "signIn" ? "Sign In" : "Reset Password"}
            </Text>
            <Card className="w-3/4 mt-4 p-4 gap-4">
                {step === "signIn" ? (
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
                        <Button variant="link" onPress={handleForgotPassword} disabled={loading}>
                            <Text>Forgot Password?</Text>
                        </Button>
                        <Button onPress={handleSignIn} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator size="small" color={THEME[colorScheme || 'dark'].background} />
                            ) : (
                                <Text>Sign In</Text>
                            )}
                        </Button>
                    </>
                ) : (
                    <>
                        <Text>Enter the code sent to {typeof step === 'object' ? step.email : ''}</Text>
                        <Input
                            placeholder="Reset Code"
                            value={data.code}
                            onChangeText={(text) => setData({ ...data, code: text })}
                            keyboardType="number-pad"
                        />
                        <Input
                            placeholder="New Password"
                            value={data.newPassword}
                            onChangeText={(text) => setData({ ...data, newPassword: text })}
                            secureTextEntry
                        />
                        <Button onPress={handleResetPassword} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator size="small" color={THEME[colorScheme || 'dark'].background} />
                            ) : (
                                <Text>Reset Password</Text>
                            )}
                        </Button>
                        <Button variant="outline" onPress={() => setStep("signIn")}>
                            <Text>Back to Sign In</Text>
                        </Button>
                    </>
                )}
                <View>
                    <Text>
                        Don't have an account?{' '}
                        <Link href="/sign-up" className='text-teal-500'>Sign Up</Link>
                    </Text>
                </View>
            </Card>
            <View className='mt-8 flex-row gap-4'>
                <Button variant="outline" onPress={handleSignInGithub}>
                    <Text>Github</Text>
                    <Icon as={Github} />
                </Button>
            </View>
        </SafeAreaView>
    );
}
