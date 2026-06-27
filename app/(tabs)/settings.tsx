import "@/global.css";
import {
  Text,
  View,
  Image,
  ScrollView,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useUser, useClerk, useAuth } from "@clerk/expo";
import { HOME_USER } from "@/constants/data";

const SafeAreaView = styled(RNSafeAreaView);

export default function SettingsScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);
          try {
            await signOut();
          } catch (err) {
            console.error("Sign out error:", err);
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  if (!isSignedIn) {
    return (
      <SafeAreaView className="flex-1 bg-background p-5">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text className="settings-section-title">Not signed in</Text>
          <Text className="settings-helper" style={{ marginTop: 8 }}>
            Please sign in to access settings.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Correctly require local asset directly
  const localAvatar = require('@/assets/images/user.jpeg');
  const emailAddress = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text className="settings-page-title">Settings</Text>

        {/* Profile Card */}
        <View className="settings-profile-card">
          {/* Passed the required local file resource straight to source */}
          <Image source={localAvatar} className="settings-avatar" />
          
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text className="settings-profile-name">
              {user?.firstName
                ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
                : HOME_USER.name}
            </Text>
            <Text className="settings-profile-email">{emailAddress}</Text>
          </View>
        </View>

        {/* Account Section */}
        <Text className="settings-section-title">Account Information</Text>

        <View className="settings-card">
          <View className="auth-field">
            <Text className="auth-label">Email Address</Text>
            <View className="settings-readonly-field">
              <Text className="settings-readonly-text">{emailAddress}</Text>
            </View>
            <Text className="settings-helper">
              Account credentials managed securely via Clerk.
            </Text>
          </View>
        </View>

        {/* Logout Section */}
        <Text className="settings-section-title">Session</Text>

        <View className="settings-card">
          <Pressable
            className="settings-logout-button"
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color="#dc2626" />
            ) : (
              <Text className="settings-logout-text">Sign Out</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}