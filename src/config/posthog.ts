import PostHog from 'posthog-react-native';


const apiKey = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

const isPostHogConfigured = apiKey && apiKey.startsWith('phc_');

if (!isPostHogConfigured) {
  console.warn(
    'PostHog project token not found or misconfigured. Analytics are disabled. ' +
    'Make sure EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN is set in your .env file.'
  );
}

export const posthog = new PostHog(apiKey || 'placeholder_key', {
  host,
  disabled: !isPostHogConfigured,
  captureAppLifecycleEvents: true,
  flushAt: 1, 
  flushInterval: 1000,
});