import "@/global.css";
import { Text, View, Image, FlatList, Pressable } from "react-native";
import { Link } from "expo-router";
import { Show, useUser, useClerk } from "@clerk/expo";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";

import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import images from "@/constants/images";
import { icons } from "@/constants/icons";
import { formatCurrency } from "../libs/utils";
import UpcomingSubscriptionCard from "@/app/components/UpcomingSubscriptionCard";
import dayjs from "dayjs";
import SubscriptionCard from "@/app/components/SubscriptionCard";
import ListHeading from "@/app/components/ListHeading";

import React from "react";
const SafeAreaView = styled(RNSafeAreaView);

export default function HomeScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [expandedSubscriptionId, setExpandedSubscriptionId] = React.useState<
    string | null
  >(null);

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
    : "User";

  const avatarUri = user?.imageUrl;

  const renderHeader = () => (
    <>
      <View className="home-header">
        <Show when="signed-in">
          <View className="home-user">
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} className="home-avatar" />
            ) : (
              <Image source={images.user} className="home-avatar" />
            )}
            <View style={{ marginLeft: 12 }}>
              <Text className="home-user-name">{displayName}</Text>
              <Pressable onPress={() => signOut()}>
                <Text className="auth-link" style={{ marginLeft: 0 }}>
                  Sign out
                </Text>
              </Pressable>
            </View>
          </View>
        </Show>
        <Show when="signed-out">
          <View className="home-user" style={{ gap: 12 }}>
            <Link href="/(auth)/signIn" asChild>
              <Pressable className="auth-secondary-button" style={{ paddingHorizontal: 16 }}>
                <Text className="auth-secondary-button-text">Sign in</Text>
              </Pressable>
            </Link>
            <Link href="/(auth)/signUp" asChild>
              <Pressable className="auth-button" style={{ paddingHorizontal: 16, paddingVertical: 10, marginTop: 0 }}>
                <Text className="auth-button-text">Sign up</Text>
              </Pressable>
            </Link>
          </View>
        </Show>
        <Image source={icons.add} className="home-add-icon" />
      </View>

      <View className="home-balance-card">
        <Text className="home-balance-label">Balance</Text>
        <View className="home-balance-row">
          <Text className="home-balance-amount">
            {formatCurrency(HOME_BALANCE.amount)}
          </Text>
          <Text className="home-balance-date">
            {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
          </Text>
        </View>
      </View>

      <View>
        <ListHeading title="Upcoming" />
        <FlatList
          data={UPCOMING_SUBSCRIPTIONS}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
          ListEmptyComponent={
            <Text className="home-empty-state">
              No upcoming subscriptions yet!
            </Text>
          }
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
        />
      </View>

      <ListHeading title="All Subscriptions" />
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        extraData={expandedSubscriptionId}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions yet!</Text>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 100,
        }}
      />
    </SafeAreaView>
  );
}
