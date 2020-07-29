import { useEffect, useRef, useCallback } from 'react';
import { Subscription } from 'rxjs';

export interface SubscriptionControl {
  /** Subscription to a stream */
  subscription: Subscription | null;

  /** Unsubscribe to the current subscription */
  unSubscribe: () => void;

  /** Change the subscription */
  setSubscription: (sub: Subscription) => void;
}

export function useSubscription(subscription: SubscriptionControl['subscription']) {
  const subscriptionRef = useRef<SubscriptionControl['subscription']>(subscription);

  /** Function to unscribe the current subscription */
  const unSubscribe = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
  }, []);

  /** Function to set the latest subscription */
  const setSubscription = useCallback(
    (subs) => {
      unSubscribe();
      subscriptionRef.current = subs;
    },
    [unSubscribe]
  );

  useEffect(() => {
    // unsubscribe the subscription on unmounting
    return () => {
      unSubscribe();
    };
  }, [unSubscribe]);

  return {
    setSubscription,
    unSubscribe,
    subscription: subscriptionRef.current,
  };
}
