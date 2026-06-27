import React from "react";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";

interface SubscriptionsContextValue {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
}

const SubscriptionsContext =
  React.createContext<SubscriptionsContextValue | null>(null);

export function SubscriptionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [subscriptions, setSubscriptions] =
    React.useState<Subscription[]>(HOME_SUBSCRIPTIONS);

  const addSubscription = React.useCallback((subscription: Subscription) => {
    setSubscriptions((current) => [subscription, ...current]);
  }, []);

  const value = React.useMemo(
    () => ({ subscriptions, addSubscription }),
    [subscriptions, addSubscription],
  );

  return (
    <SubscriptionsContext.Provider value={value}>
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const context = React.useContext(SubscriptionsContext);
  if (!context) {
    throw new Error(
      "useSubscriptions must be used within SubscriptionsProvider",
    );
  }
  return context;
}
