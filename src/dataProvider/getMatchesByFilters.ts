import { ApolloLink, execute, makePromise } from 'apollo-link';
import { GetMatchesByFilters } from '../types/ggbetAPI';
import { buildOperation } from './queries/getMatchesByFilters';

export async function getMatchesByFilters(link: ApolloLink) {
  const matchesResponse = (await makePromise(
    execute(link, buildOperation())
  )) as GetMatchesByFilters;

  const matches = matchesResponse?.data?.matches;

  if (!matches) {
    throw new Error('Faild to getMatchesByFilters:' + JSON.stringify(matchesResponse));
  }

  return matches;
}