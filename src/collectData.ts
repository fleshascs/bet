import { OnUpdateSportEvent, Match } from './types/ggbetAPI';
import { fixMatchSlug, getCurrentMap, getLeadingTeamScore } from './dataProvider/utils';
import { getClient } from './dataProvider/client';
import { progressBarManager } from './progressBarManager';
import { matchDataManager } from './matchDataManager';
import { matchSubscriptionManager } from './matchSubscriptionManager';
import { Subscription } from 'rxjs';
import { matchListManager } from './matchListManager';

const link = getClient(function (err, result) {
  if (err || result) {
    console.log(new Date().toLocaleString() + ' connectionCallback err: ', err, 'result: ', result);
  }
  startCollecting();
});

const progressBar = progressBarManager();
const matchData = matchDataManager();
const matchSubscription = matchSubscriptionManager();

let matchListSubscription: Subscription;

async function startCollecting() {
  const matchList = matchListManager(link);
  if (matchListSubscription) {
    matchListSubscription.unsubscribe();
  }
  matchListSubscription = matchList.subscribe((matches) => {
    matches.forEach(watchMatchUpdates);
  });
}

async function watchMatchUpdates(match: Match) {
  if (!matchData.getMatchBySlug(match.slug)) {
    await matchData.loadMatchData(match);
  }
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
    }
  } catch (error) {
    console.log('onUpdateSportEventHandler', response.data.onUpdateSportEvent.slug);
    console.log('response', response);
    throw error;
  }
}
