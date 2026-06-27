import "@/global.css";
import { Text, View, Image, FlatList, Pressable } from "react-native";
import { useUser } from "@clerk/expo";
import { usePostHog } from "posthog-react-native";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
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
import CreateSubscriptionModal from "@/app/components/CreateSubscriptionModal";

import React from "react";
const SafeAreaView = styled(RNSafeAreaView);

export default function HomeScreen() {
  const { user } = useUser();
  const posthog = usePostHog();

  const [subscriptions, setSubscriptions] =
    React.useState<Subscription[]>(HOME_SUBSCRIPTIONS);
  const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);
  const [expandedSubscriptionId, setExpandedSubscriptionId] = React.useState<
    string | null
  >(null);

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
    : "User";

  const avatarSource = user?.hasImage
    ? { uri: user.imageUrl }
    : require("@/assets/images/user.jpeg");

  const renderHeader = () => (
    <>
      <View className="home-header">
        <View className="home-user">
          {avatarSource ? (
            <Image source={avatarSource} className="home-avatar" />
          ) : (
            <Image source={images.user} className="home-avatar" />
          )}
          <View style={{ marginLeft: 12 }}>
            <Text className="home-user-name">{HOME_USER.name}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => setIsCreateModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Add subscription"
        >
          <Image source={icons.add} className="home-add-icon" />
        </Pressable>
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
        <ListHeading
          title="Upcoming"
          onViewPress={() => console.log("View All Pressed")}
        />
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

      <ListHeading
        title="All Subscriptions"
        onViewPress={() => console.log("View All Pressed")}
      />
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <CreateSubscriptionModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={(subscription) => {
          setSubscriptions((current) => [subscription, ...current]);
          posthog.capture("subscription_created", {
            subscription_name: subscription.name,
            billing: subscription.billing,
            category: subscription.category ?? null,
          });
        }}
      />
      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        extraData={[expandedSubscriptionId, subscriptions]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions yet!</Text>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => {
              const isExpanding = expandedSubscriptionId !== item.id;
              if (isExpanding) {
                posthog.capture('subscription_card_expanded', {
                  subscription_name: item.name,
                  billing: item.billing,
                  category: item.category ?? null,
                });
              }
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              );
            }}
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
