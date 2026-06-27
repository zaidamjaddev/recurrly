import "@/global.css";
import { useSignUp, useAuth } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import { usePostHog } from "posthog-react-native";
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

export default function SignUpPage() {
  // Clerk v3 API: useSignUp returns { signUp, errors, fetchStatus }
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const posthog = usePostHog();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [code, setCode] = React.useState("");

  // Clerk v3 / Core 3 standard custom email/password flow
  const handleSubmit = async () => {
    try {
      // Pass email, password, and names directly into the unified password method
      const { error } = await signUp.password({
        emailAddress,
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });

      if (error) {
        console.error("Sign-up Error details:", JSON.stringify(error, null, 2));
        return;
      }

      // Send the 6-digit verification email code
      await signUp.verifications.sendEmailCode();

    } catch (error: any) {
      console.error("Unexpected Error:", JSON.stringify(error, null, 2));
    }
  };

  // Clerk v3: use signUp.verifications.verifyEmailCode() then signUp.finalize()
  const handleVerify = async () => {
    posthog.capture('email_verification_submitted');
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      posthog.capture('user_signed_up');
      await signUp.finalize({
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
      console.error("Sign-up not complete:", signUp.status);
    }
  };

  // If already signed in, render nothing (auth layout will redirect)
  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  // Verification screen: show when email needs verification
  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
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

                <Text className="auth-title">Verify Email</Text>
                <Text className="auth-subtitle">
                  {"We sent a code to your email.\nEnter it below to continue."}
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
                    <Text className="auth-button-text">
                      Verify & Continue
                    </Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => signUp.verifications.sendEmailCode()}
                  >
                    <Text className="auth-secondary-button-text">
                      Resend Code
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

  // Sign-up form
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

              <Text className="auth-title">Create Account</Text>
              <Text className="auth-subtitle">
                Track all your subscriptions in one place
              </Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">First Name</Text>
                  <TextInput
                    className="auth-input"
                    value={firstName}
                    placeholder="John"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Last Name</Text>
                  <TextInput
                    className="auth-input"
                    value={lastName}
                    placeholder="Doe"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Email Address</Text>
                  <TextInput
                    className={`auth-input ${errors?.fields?.emailAddress ? "auth-input-error" : ""}`}
                    value={emailAddress}
                    placeholder="john@example.com"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    onChangeText={setEmailAddress}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  {errors?.fields?.emailAddress && (
                    <Text className="auth-error">
                      {errors.fields.emailAddress.message}
                    </Text>
                  )}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className={`auth-input ${errors?.fields?.password ? "auth-input-error" : ""}`}
                    value={password}
                    placeholder="Min. 8 characters"
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
                  <Text className="auth-button-text">Create Account</Text>
                </Pressable>
              </View>

              <View className="auth-link-row">
                <Text className="auth-link-copy">
                  Already have an account?
                </Text>
                <Link href="/(auth)/signIn">
                  <Text className="auth-link">Sign In</Text>
                </Link>
              </View>

              {/* Required for Clerk bot protection */}
              <View nativeID="clerk-captcha" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}