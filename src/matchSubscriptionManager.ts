import { ApolloLink, execute } from 'apollo-link';
import { Match } from './types/ggbetAPI';
import { ZenObservable } from 'zen-observable-ts';
import { buildOperation as onUpdateSportEvent } from './dataProvider/queries/onUpdateSportEvent';

interface MatchSubscriptionManager {
  unsubscribe: (slug: Match['slug']) => void;
  subscribe: (
    link: ApolloLink,
    match: Match,
    onUpdateSportEventHandler: (OnUpdateSportEvent) => void
  ) => void;
}

export function matchSubscriptionManager(): MatchSubscriptionManager {
  const subscriptions: Record<Match['slug'], ZenObservable.Subscription> = {};
  return {
    unsubscribe: (slug: Match['slug']) => {
      subscriptions[slug].unsubscribe();
    },
    subscribe: (
      link: ApolloLink,
      match: Match,
      onUpdateSportEventHandler: (OnUpdateSportEvent) => void
    ) => {
      const subscription = execute(link, onUpdateSportEvent(match.id)).subscribe({
        next: onUpdateSportEventHandler,
        error: (error) => console.log(`${match.slug} -> onUpdateSportEvent received error:`, error),
        complete: () => console.log(`${match.slug} -> onUpdateSportEvent complete`)
      });
      if (subscriptions[match.slug]) {
        subscriptions[match.slug].unsubscribe();
      }
      subscriptions[match.slug] = subscription;
    }
  };
}
