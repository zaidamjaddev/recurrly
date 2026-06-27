import "@/global.css";
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import clsx from "clsx";
import dayjs from "dayjs";
import { getSubscriptionIcon } from "@/app/libs/subscriptionIcons";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

type SubscriptionCategory = (typeof CATEGORIES)[number];
type SubscriptionFrequency = "Monthly" | "Yearly";

const CATEGORY_COLORS: Record<SubscriptionCategory, string> = {
  Entertainment: "#f5a8a8",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#b8e8d0",
  Cloud: "#a8d4f5",
  Music: "#d4b8e8",
  Other: "#e8e0d0",
};

const FREQUENCIES: SubscriptionFrequency[] = ["Monthly", "Yearly"];

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
}

function createSubscriptionId(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${slug || "subscription"}-${Date.now()}`;
}

function isValidPrice(value: string): boolean {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0;
}

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) => {
  const insets = useSafeAreaInsets();

  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [frequency, setFrequency] =
    React.useState<SubscriptionFrequency>("Monthly");
  const [category, setCategory] =
    React.useState<SubscriptionCategory>("Entertainment");

  const resetForm = React.useCallback(() => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
  }, []);

  const handleClose = React.useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const isSubmitDisabled = !name.trim() || !isValidPrice(price);

  const handleSubmit = () => {
    if (isSubmitDisabled) return;

    const now = dayjs();
    const startDate = now.toISOString();
    const renewalDate =
      frequency === "Monthly"
        ? now.add(1, "month").toISOString()
        : now.add(1, "year").toISOString();

    onCreate({
      id: createSubscriptionId(name),
      name: name.trim(),
      price: Number.parseFloat(price),
      frequency,
      category,
      status: "active",
      startDate,
      renewalDate,
      icon: getSubscriptionIcon(name.trim(), category),
      billing: frequency,
      color: CATEGORY_COLORS[category],
      currency: "USD",
    });

    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          className="modal-overlay"
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          onPress={handleClose}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            className="modal-container"
            style={{ paddingBottom: insets.bottom }}
          >
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable
                className="modal-close"
                onPress={handleClose}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="modal-body">
                <View className="auth-field">
                  <Text className="auth-label">Name</Text>
                  <TextInput
                    className="auth-input"
                    value={name}
                    placeholder="Netflix, Spotify, etc."
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Price</Text>
                  <TextInput
                    className="auth-input"
                    value={price}
                    placeholder="9.99"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Frequency</Text>
                  <View className="picker-row">
                    {FREQUENCIES.map((option) => {
                      const isActive = frequency === option;

                      return (
                        <Pressable
                          key={option}
                          className={clsx(
                            "picker-option",
                            isActive && "picker-option-active",
                          )}
                          onPress={() => setFrequency(option)}
                        >
                          <Text
                            className={clsx(
                              "picker-option-text",
                              isActive && "picker-option-text-active",
                            )}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Category</Text>
                  <View className="category-scroll">
                    {CATEGORIES.map((option) => {
                      const isActive = category === option;

                      return (
                        <Pressable
                          key={option}
                          className={clsx(
                            "category-chip",
                            isActive && "category-chip-active",
                          )}
                          onPress={() => setCategory(option)}
                        >
                          <Text
                            className={clsx(
                              "category-chip-text",
                              isActive && "category-chip-text-active",
                            )}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <Pressable
                  className={clsx(
                    "auth-button",
                    isSubmitDisabled && "auth-button-disabled",
                  )}
                  onPress={handleSubmit}
                  disabled={isSubmitDisabled}
                >
                  <Text className="auth-button-text">Add Subscription</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
