import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Link } from "expo-router";
import React from "react";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Subscription Details with id : {id}</Text>
      <Link href='/'>Go Back</Link>
    </View>
  );
};

export default SubscriptionDetails;
