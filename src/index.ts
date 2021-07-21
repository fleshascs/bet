import { OnUpdateSportEvent, Match } from './types/ggbetAPI';
import { fixMatchSlug, getCurrentMap, getLeadingTeamScore } from './dataProvider/utils';
import { getMatchesByFilters } from './dataProvider/getMatchesByFilters';
import { getClient } from './dataProvider/client';
import { progressBarManager } from './progressBarManager';
import { matchDataManager } from './matchDataManager';
import { matchSubscriptionManager } from './matchSubscriptionManager';

const link = getClient(function (err, result) {
  startCollecting();
  if (err || result) {
    console.log(new Date().toLocaleString() + ' connectionCallback err: ', err, 'result: ', result);
  }
});

const progressBar = progressBarManager();
const matchData = matchDataManager();
const matchSubscription = matchSubscriptionManager();

async function startCollecting() {
  const matches = await getMatchesByFilters(link);
  matches.forEach(watchMatchUpdates);
}

async function watchMatchUpdates(match: Match) {
  await matchData.loadMatchData(match);
  const currentMap = getCurrentMap(match.fixture.competitors);
  const leadingScore = getLeadingTeamScore(match, currentMap);
  progressBar.create(match.slug, leadingScore, currentMap);
  matchSubscription.subscribe(link, match, onUpdateSportEventHandler);
}

function onUpdateSportEventHandler(response: OnUpdateSportEvent) {
  try {
    const match = fixMatchSlug(response.data.onUpdateSportEvent, matchData);
    const currentMap = getCurrentMap(match.fixture.competitors);
    const leadingScore = getLeadingTeamScore(match, currentMap);
    progressBar.update(match.slug, leadingScore, currentMap);
    matchData.onUpdateSportEvent(match);

    if (match.fixture.status === 'ENDED') {
      matchSubscription.unsubscribe(match.slug);
      //remove progressBar?
      // save match here instead of on every  update (but what if server crashes)?
      console.log('match ended', match.slug);
    }
  } catch (error) {
    console.log('onUpdateSportEventHandler', response.data.onUpdateSportEvent.slug);
    console.log('response', response);
    throw error;
  }
}
