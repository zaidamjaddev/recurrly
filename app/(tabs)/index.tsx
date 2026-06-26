import "@/global.css";
import { View, Image, Text, FlatList } from "react-native";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import ListHeading from "@/app/components/ListHeading";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import images from "@/constants/images";
import { icons } from "@/constants/icons";
import { formatCurrency } from "../libs/utils";
import UpcomingSubscriptionCard from "@/app/components/UpcomingSubscriptionCard";
import dayjs from "dayjs";
import SubscriptionCard from "@/app/components/SubscriptionCard";
import React from "react";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = React.useState<
    string | null
  >(null);

  const renderHeader = () => (
    <>
      <View className="home-header">
        <View className="home-user">
          <Image source={images.user} className="home-avatar" />
          <Text className="home-user-name">{HOME_USER.name}</Text>
        </View>
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
