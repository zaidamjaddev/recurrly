import { tabs } from "@/constants/data";
import { Redirect, Tabs } from "expo-router";
import { View, Image, ActivityIndicator } from "react-native";
import { colors, components } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import clsx from "clsx";
import { useAuth } from "@clerk/expo";
import { SubscriptionsProvider } from "@/app/context/SubscriptionsContext";

const tabBar = components.tabBar;

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  // Redirect unauthenticated users to sign-in
  if (!isSignedIn) {
    return <Redirect href="/(auth)/signIn" />;
  }

  const TabIcon = ({ focused, icon }: TabIconProps) => {
    return (
      <View className="tabs-icon">
        <View className={clsx("tabs-pill", focused && "tabs-active")}>
          <Image source={icon} className="tabs-glyph"></Image>
        </View>
      </View>
    );
  };
  return (
    <SubscriptionsProvider>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, tabBar.horizontalInset),
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
        },
        tabBarIconStyle: {
          width: tabBar.iconFrame,
          height: tabBar.iconFrame,
          alignItems: "center",
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            href: tab.hideTab ? null : undefined,
            tabBarIcon: ({ focused }) =>
              tab.icon ? <TabIcon focused={focused} icon={tab.icon} /> : null,
          }}
        />
      ))}
    </Tabs>
    </SubscriptionsProvider>
  );
};

export default TabLayout;
