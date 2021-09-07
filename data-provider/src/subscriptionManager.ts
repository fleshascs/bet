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
    add(...subs: Subscription[]) {
      subscriptions = subscriptions.concat(subs);
    },
    unsubscribeAll() {
      subscriptions.forEach((sub) => sub && sub.unsubscribe());
      subscriptions = [];
    }
  };
}
