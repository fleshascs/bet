import { ApolloLink } from 'apollo-link';
import { Match } from './types/ggbetAPI';
import { getMatchesByFilters } from './dataProvider/getMatchesByFilters';
import {
  delayWhen,
  repeat,
  retryWhen,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { Subject, Subscription, timer } from 'rxjs';
import { logger } from './logger';

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
    retryWhen((errors) =>
      errors.pipe(
        // log error message
        tap((error) => logger.error(error, 'matchListManager caught an error')),
        // restart in 5 seconds
        delayWhen((_val) => timer(5 * 1000))
      )
    ),
    takeUntil(subject),
    share()
  );

  // matches$.subscribe({
  //   next: (next) => console.log('getMatchesByFilters: ', next.length),
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
