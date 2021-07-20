const schedule = require('node-schedule');
const cliProgress = require('cli-progress');
import { OnUpdateSportEvent, GetMatchesByFilters, Match, MatchUpdates } from './types/ggbetAPI';
import {
  getCurrentMap,
  getLeadingTeamScore,
  getSavedMatch,
  saveMatch,
  saveMatches
} from './dataProvider/utils';
// import { buildOperation as getMatchBySlug } from './dataProvider/queries/getMatchBySlug';
import { buildOperation as getCategorizer } from './dataProvider/queries/getCategorizer';
import { buildOperation as onUpdateSportEvent } from './dataProvider/queries/onUpdateSportEvent';
import { buildOperation as getMatchesByFilters } from './dataProvider/queries/getMatchesByFilters';
import { execute, makePromise } from 'apollo-link';
import { getClient } from './dataProvider/client';

const link = getClient();

const matchStats: Record<Match['slug'], MatchUpdates> = {};
const progressbars: Record<Match['slug'], unknown> = {};
const multibar = new cliProgress.MultiBar(
  {
    clearOnComplete: false,
    hideCursor: true,
    format: '[{bar}] {percentage}% | map: {map} | {value}/{total} | match: {slug}'
  },
  cliProgress.Presets.shades_grey
);

(async () => {
  const pingTask = schedule.scheduleJob('*/1 * * * *', async function () {
    execute(link, getCategorizer()); // do nothing with it
  });

  const matchesResponse = (await makePromise(
    execute(link, getMatchesByFilters())
  )) as GetMatchesByFilters;

  const matches = matchesResponse?.data?.matches;

  if (!matches) {
    throw new Error('Faild to getMatchesByFilters:' + JSON.stringify(matchesResponse));
  }

  //saveMatches(matches);

  matches.forEach(watchMatchUpdates);
})();

async function watchMatchUpdates(match: Match) {
  const savedMatchStats = await getSavedMatch(match.slug);

  matchStats[match.slug] = {
    match: match,
    onUpdateSportEvent: savedMatchStats?.onUpdateSportEvent ?? []
  };

  if (['NOT_STARTED', 'LIVE'].includes(match.fixture.status)) {
    const currentMap = getCurrentMap(match.fixture.competitors);
    const leadingScore = getLeadingTeamScore(match, currentMap);
    progressbars[match.slug] = multibar.create(16, leadingScore, {
      map: currentMap,
      slug: match.slug
    });
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
    //match id sometimes gets sent as a slug
    if (!matchStats[match.slug]) {
      const m = findMatchById(match.slug);
      if (!m) throw new Error('unable to find a match slug: ' + match.slug);
      match.slug = m.match.slug;
    }

    const currentMap = getCurrentMap(match.fixture.competitors);
    const leadingScore = getLeadingTeamScore(match, currentMap);
    progressbars[match.slug].update(leadingScore, { map: currentMap, slug: match.slug });

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

// const schedule = require('node-schedule');
// const startTime = new Date(match.fixture.startTime);
// const job = schedule.scheduleJob(startTime, function () {
//   startWatching(match);
// });
