import "@/global.css";
import { Text, View, FlatList, TextInput } from "react-native";
import React from "react";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import SubscriptionCard from "@/app/components/SubscriptionCard";
import { usePostHog } from "posthog-react-native";

const SafeAreaView = styled(RNSafeAreaView);

function matchesSearch(subscription: Subscription, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    subscription.name,
    subscription.category,
    subscription.plan,
    subscription.billing,
    subscription.status,
    subscription.paymentMethod,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

export default function SubscriptionsScreen() {
  const posthog = usePostHog();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = React.useState<
    string | null
  >(null);

  const filteredSubscriptions = React.useMemo(
    () => HOME_SUBSCRIPTIONS.filter((sub) => matchesSearch(sub, searchQuery)),
    [searchQuery],
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        extraData={[expandedSubscriptionId, searchQuery]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListHeaderComponent={
          <>
            <Text className="settings-page-title">Subscriptions</Text>
            <TextInput
              className="subs-search"
              placeholder="Search subscriptions..."
              placeholderTextColor="rgba(0, 0, 0, 0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </>
        }
        ListEmptyComponent={
          <Text className="home-empty-state">
            {searchQuery.trim()
              ? "No subscriptions match your search."
              : "No subscriptions yet!"}
          </Text>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => {
              const isExpanding = expandedSubscriptionId !== item.id;
              if (isExpanding) {
                alert("Triggered!");
                posthog.capture("subscription_card_expanded", {
                  subscription_name: item.name,
                  billing: item.billing,
                  category: item.category ?? null,
                  source: "subscriptions_screen",
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
