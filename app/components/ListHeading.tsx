import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const ListHeading = ({ title, onViewPress }: { title: string, onViewPress?: () => void }) => {
  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>
      {onViewPress && (
        <TouchableOpacity className="list-action" onPress={onViewPress}>
          <Text className="list-action-text">View</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ListHeading;
