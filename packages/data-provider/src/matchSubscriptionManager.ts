import { ApolloLink, execute } from 'apollo-link';
import { Match } from './types/ggbetAPI';
import { buildOperation as onUpdateSportEvent } from './dataProvider/queries/onUpdateSportEvent';
import { subscriptionManager, SubscriptionManager } from './subscriptionManager';
import { logger } from './logger';

interface MatchSubscriptionManager {
  unsubscribeAll: (id: Match['id']) => void;
  subscribe: (
    link: ApolloLink,
    match: Match,
    onUpdateSportEventHandler: (OnUpdateSportEvent) => void
  ) => void;
  getSubscriptionById: (id: Match['id']) => SubscriptionManager;
  getSubscriptionIds: () => Match['id'][];
}

export function matchSubscriptionManager(): MatchSubscriptionManager {
  const subscriptions: Record<Match['id'], SubscriptionManager> = {};
  return {
    unsubscribeAll: (id: Match['id']) => {
      subscriptions[id].unsubscribeAll();
      delete subscriptions[id];
    },
    subscribe: (
      link: ApolloLink,
      match: Match,
      onUpdateSportEventHandler: (OnUpdateSportEvent) => void
    ) => {
      const subscription = execute(link, onUpdateSportEvent(match.id)).subscribe({
        next: onUpdateSportEventHandler,
        error: (error) => logger.error(error, `${match.slug} -> onUpdateSportEvent received error`),
        complete: () => logger.info(`${match.slug} -> onUpdateSportEvent complete`)
      });

      if (!subscriptions[match.id]) {
        subscriptions[match.id] = subscriptionManager();
      }
      subscriptions[match.id].add(subscription);
    },
    getSubscriptionById: (id: Match['id']) => {
      return subscriptions[id];
    },
    getSubscriptionIds: () => {
      return Object.keys(subscriptions) as Match['id'][];
    }
  };
}
