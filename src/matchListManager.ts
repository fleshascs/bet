import { ApolloLink } from 'apollo-link';
import { Match } from './types/ggbetAPI';
import { getMatchesByFilters } from './dataProvider/getMatchesByFilters';
import { repeat, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, Subscription, timer } from 'rxjs';

const interval = 30 * 1000;

interface MatchListManager {
  subscribe: (next: (matches: Match[]) => void) => Subscription;
  stopPolling: () => void;
}

export function matchListManager(link: ApolloLink): MatchListManager {
  const subject = new Subject();

  const matches$ = timer(interval).pipe(
    startWith(() => getMatchesByFilters(link)),
    switchMap(() => getMatchesByFilters(link)),
    repeat(),
    takeUntil(subject),
    share()
  );

  // matches$.subscribe({
  //   next: (next) => console.log('next', next),
  //   error: (error) => console.log(` -> onUpdateSportEvent received error:`, error),
  //   complete: () => console.log(` -> onUpdateSportEvent complete`)
  // });

  const stopPolling = () => {
    subject.next(null);
  };

  return {
    subscribe: (...args) => matches$.subscribe(...args),
    stopPolling
  };
}
