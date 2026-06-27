<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for **Recurrly**, an Expo/React Native subscription tracker using Clerk for authentication. The integration uses `posthog-react-native` with `expo-constants` for config, a `PostHogProvider` wrapped around the app's navigation stack, and manual screen tracking via expo-router's `usePathname`. Users are identified by their Clerk user ID on session restore/login, and `posthog.reset()` is called on sign-out.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user completes registration after email verification | `app/(auth)/signUp.tsx` |
| `email_verification_submitted` | User submits the 6-digit email verification code during sign-up | `app/(auth)/signUp.tsx` |
| `user_signed_in` | An existing user successfully signs in with email and password | `app/(auth)/signIn.tsx` |
| `user_signed_out` | User intentionally signs out from the Settings screen | `app/(tabs)/settings.tsx` |
| `subscription_card_expanded` | User taps a subscription card on the home screen to reveal its details | `app/(tabs)/index.tsx` |
| `subscription_details_viewed` | User navigates to the full detail page for a specific subscription | `app/(tabs)/subscriptions/[id].tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/488554/dashboard/1768775)
- [New Sign-ups (wizard)](https://us.posthog.com/project/488554/insights/M2yzxMCD)
- [Daily Sign-ins (wizard)](https://us.posthog.com/project/488554/insights/XAi1rYmT)
- [Sign-up Conversion Funnel (wizard)](https://us.posthog.com/project/488554/insights/TfrCzhFu)
- [Subscription Card Engagements (wizard)](https://us.posthog.com/project/488554/insights/AFWLNLcI)
- [Churn Signal: Sign-outs (wizard)](https://us.posthog.com/project/488554/insights/rZ6kZySc)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `app/index.tsx` identifies via Clerk `user.id` on load, but verify this fires correctly for users who open the app while already signed in.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
