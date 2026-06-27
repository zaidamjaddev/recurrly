import "@/global.css";
import { useSignIn } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signIn.password({ emailAddress, password });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.push(url as Href);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      // MFA enabled – not handled in this flow
      console.error("MFA required but not implemented in this flow.");
    } else if (signIn.status === "needs_client_trust") {
      // Client Trust is enabled – send email verification code
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor: any) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error("Sign-in not complete:", signIn.status);
    }
  };

  // Handle client trust verification
  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.push(url as Href);
        },
      });
    } else {
      console.error("Sign-in not complete after verification:", signIn.status);
    }
  };

  // Client trust verification screen
  if (signIn.status === "needs_client_trust") {
    return (
      <SafeAreaView className="auth-safe-area">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="auth-screen"
        >
          <ScrollView
            className="auth-scroll"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="auth-content">
              <View className="auth-brand-block">
                <View className="auth-logo-wrap">
                  <View className="auth-logo-mark">
                    <Text className="auth-logo-mark-text">R</Text>
                  </View>
                  <View>
                    <Text className="auth-wordmark">Recurrly</Text>
                    <Text className="auth-wordmark-sub">
                      Subscription Tracker
                    </Text>
                  </View>
                </View>

                <Text className="auth-title">Verify Account</Text>
                <Text className="auth-subtitle">
                  {"We sent a verification code to your email.\nEnter it below to sign in."}
                </Text>
              </View>

              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Verification Code</Text>
                    <TextInput
                      className={`auth-input ${errors?.fields?.code ? "auth-input-error" : ""}`}
                      value={code}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor="rgba(0,0,0,0.35)"
                      onChangeText={setCode}
                      keyboardType="number-pad"
                    />
                    {errors?.fields?.code && (
                      <Text className="auth-error">
                        {errors.fields.code.message}
                      </Text>
                    )}
                  </View>

                  <Pressable
                    className={`auth-button ${fetchStatus === "fetching" ? "auth-button-disabled" : ""}`}
                    onPress={handleVerify}
                    disabled={fetchStatus === "fetching"}
                  >
                    <Text className="auth-button-text">Verify & Sign In</Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => signIn.mfa.sendEmailCode()}
                  >
                    <Text className="auth-secondary-button-text">
                      Resend Code
                    </Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => signIn.reset()}
                  >
                    <Text className="auth-secondary-button-text">
                      Start Over
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-content">
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurrly</Text>
                  <Text className="auth-wordmark-sub">
                    Subscription Tracker
                  </Text>
                </View>
              </View>

              <Text className="auth-title">Welcome Back</Text>
              <Text className="auth-subtitle">
                Sign in to manage your subscriptions
              </Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Email Address</Text>
                  <TextInput
                    className={`auth-input ${errors?.fields?.identifier ? "auth-input-error" : ""}`}
                    value={emailAddress}
                    placeholder="john@example.com"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    onChangeText={setEmailAddress}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  {errors?.fields?.identifier && (
                    <Text className="auth-error">
                      {errors.fields.identifier.message}
                    </Text>
                  )}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className={`auth-input ${errors?.fields?.password ? "auth-input-error" : ""}`}
                    value={password}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  {errors?.fields?.password && (
                    <Text className="auth-error">
                      {errors.fields.password.message}
                    </Text>
                  )}
                </View>

                <Pressable
                  className={`auth-button ${
                    !emailAddress || !password || fetchStatus === "fetching"
                      ? "auth-button-disabled"
                      : ""
                  }`}
                  onPress={handleSubmit}
                  disabled={
                    !emailAddress ||
                    !password ||
                    fetchStatus === "fetching"
                  }
                >
                  <Text className="auth-button-text">Sign In</Text>
                </Pressable>
              </View>

              <View className="auth-link-row">
                <Text className="auth-link-copy">
                  {"Don't have an account?"}
                </Text>
                <Link href="/(auth)/signUp">
                  <Text className="auth-link">Sign Up</Text>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}