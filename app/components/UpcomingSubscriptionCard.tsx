import { Text, View, Image } from "react-native";
import React from "react";
import { formatCurrency } from "../libs/utils";

import dayjs from "dayjs";

const UpcomingSubscriptionCard = ({
  name, price, renewalDate, icon , currency
}: UpcomingSubscription) => {
  const daysLeft = dayjs(renewalDate).startOf("day").diff(dayjs().startOf("day"), "day");

  let daysLeftMessage = "";
  if (daysLeft > 1) {
    daysLeftMessage = `${daysLeft} days left`;
  } else if (daysLeft === 1) {
    daysLeftMessage = `1 day left`;
  } else if (daysLeft === 0) {
    daysLeftMessage = `Last day!`;
  } else {
    daysLeftMessage = `Overdue`;
  }

  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon"/>
        <View>
          <Text className="upcoming-price">{formatCurrency(price, currency)}</Text>
          <Text className="upcoming-meta" numberOfLines={1}>{daysLeftMessage}</Text>
        </View>
      </View>
      <Text className="upcoming-name">{name}</Text>
    </View>
  );
};

export default UpcomingSubscriptionCard;
