import PostHog from "posthog-react-native";
import Constants from "expo-constants";

type PostHogExtra = {
  posthogProjectToken?: string;
  posthogHost?: string;
};

const extra = Constants.expoConfig?.extra as PostHogExtra | undefined;

const apiKey =
  extra?.posthogProjectToken ??
  process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN ??
  "";
const host =
  extra?.posthogHost ??
  process.env.EXPO_PUBLIC_POSTHOG_HOST ??
  "https://us.i.posthog.com";

const isPostHogConfigured = Boolean(apiKey && apiKey.startsWith("phc_"));

if (__DEV__) {
  console.log("[PostHog] status:", {
    configured: isPostHogConfigured,
    host,
    tokenPresent: Boolean(apiKey),
  });

  if (!isPostHogConfigured) {
    console.warn(
      "[PostHog] Analytics disabled. Set EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN in .env.local and restart Expo.",
    );
  }
}

export const posthog = new PostHog(apiKey || "placeholder_key", {
  host,
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
  flushAt: 1,
  flushInterval: 10000,
});

export const isPostHogEnabled = isPostHogConfigured;
