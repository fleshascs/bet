// import { Subscription } from 'rxjs';

export interface SubscriptionManager {
  add: (...subscriptions: Subscription[]) => void;
  unsubscribeAll: () => void;
}

interface Subscription {
  unsubscribe: () => void;
}

export function subscriptionManager(): SubscriptionManager {
  let subscriptions = [];
  return {
    add(...subscriptions: Subscription[]) {
      subscriptions = subscriptions.concat(subscriptions);
    },
    unsubscribeAll() {
      subscriptions.forEach((sub) => sub && sub.unsubscribe());
      subscriptions = [];
    }
  };
}
