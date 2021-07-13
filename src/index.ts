import { OnUpdateSportEvent, GetMatchesByFilters, Match, MatchUpdates } from './types/ggbetAPI';
import { getSavedMatch, saveMatch, saveMatches } from './dataProvider/utils';
// import { buildOperation as getMatchBySlug } from './dataProvider/queries/getMatchBySlug';
import { buildOperation as onUpdateSportEvent } from './dataProvider/queries/onUpdateSportEvent';
import { buildOperation as getMatchesByFilters } from './dataProvider/queries/getMatchesByFilters';
import { execute, makePromise } from 'apollo-link';
import { getClient } from './dataProvider/client';

const link = getClient();

const matchStats: Record<Match['slug'], MatchUpdates> = {};

(async () => {
  const matchesResponse = (await makePromise(
    execute(link, getMatchesByFilters())
  )) as GetMatchesByFilters;

  const matches = matchesResponse?.data?.matches;

  if (!matches) {
    throw new Error('Faild to getMatchesByFilters:' + JSON.stringify(matchesResponse));
  }

  saveMatches(matches);

  matches.forEach(watchMatchUpdates);
})();

async function watchMatchUpdates(match: Match) {
  const savedMatchStats = await getSavedMatch(match.slug);

  matchStats[match.slug] = {
    match: match,
    onUpdateSportEvent: savedMatchStats?.onUpdateSportEvent ?? []
  };

  if (['NOT_STARTED', 'LIVE'].includes(match.fixture.status)) {
    startWatching(match);
  }
}

function startWatching(match: Match) {
  execute(link, onUpdateSportEvent(match.id)).subscribe({
    next: onUpdateSportEventHandler,
    error: (error) => console.log(`${match.slug} -> onUpdateSportEvent received error ${error}`),
    complete: () => console.log(`${match.slug} -> onUpdateSportEvent complete`)
  });
}

function onUpdateSportEventHandler(response: OnUpdateSportEvent) {
  try {
    const match = response.data.onUpdateSportEvent;
    if (!matchStats[match.slug]) {
      console.log('matchStats[match.slug] dont exist: ' + match.slug);
      const m = findMatchById(match.slug);
      if (!m) throw new Error('unable to find a match slug: ' + match.slug);
      match.slug = m.match.slug;
    }
    matchStats[match.slug].onUpdateSportEvent.push(match);
    saveMatch(match.slug, matchStats[match.slug]);
  } catch (error) {
    console.log('onUpdateSportEventHandler', response.data.onUpdateSportEvent.slug);
    console.log('response', response);
    throw error;
  }
}

function findMatchById(id: Match['slug']) {
  return Object.values(matchStats).find((m) => m.match.id === id);
}
