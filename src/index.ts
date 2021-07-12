const schedule = require('node-schedule');
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

  // saveMatches(matches);

  matches.forEach(watchMatchUpdates);
})();

async function watchMatchUpdates(match: Match) {
  const savedMatchStats = await getSavedMatch(match.slug);

  matchStats[match.slug] = {
    match: match,
    onUpdateSportEvent: savedMatchStats?.onUpdateSportEvent ?? []
  };

  if (match.fixture.status === 'NOT_STARTED') {
    scheduleWatching(match);
    return;
  }

  if (match.fixture.status === 'LIVE') {
    startWatching(match);
  }
}

function scheduleWatching(match: Match) {
  const startTime = new Date(match.fixture.startTime);
  const job = schedule.scheduleJob(startTime, function () {
    startWatching(match);
  });
}

function startWatching(match: Match) {
  execute(link, onUpdateSportEvent(match.id)).subscribe({
    next: onUpdateSportEventHandler,
    error: (error) => console.log(`${match.slug} -> onUpdateSportEvent received error ${error}`),
    complete: () => console.log(`${match.slug} -> onUpdateSportEvent complete`)
  });
}

function onUpdateSportEventHandler(response: OnUpdateSportEvent) {
  const match = response.data.onUpdateSportEvent;
  matchStats[match.slug].onUpdateSportEvent.push(match);
  saveMatch(match.slug, matchStats[match.slug]);
}
