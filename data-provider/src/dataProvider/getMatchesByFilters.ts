import { ApolloLink, execute, makePromise } from 'apollo-link';
import { GetMatchesByFilters, Match } from '../types/ggbetAPI';
import { buildOperation } from './queries/getMatchesByFilters';
import { retry } from './utils';

export async function getMatchesByFilters(link: ApolloLink): Promise<Match[]> {
  const matchesResponse = (await retry(() =>
    makePromise(execute(link, buildOperation()))
  )) as GetMatchesByFilters;

  const matches = matchesResponse?.data?.matches;

  if (!matches) {
    throw new Error('Failed to getMatchesByFilters:' + JSON.stringify(matchesResponse));
  }

  return matches;
}
