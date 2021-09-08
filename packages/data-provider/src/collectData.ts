import { OnUpdateSportEvent, Match } from './types/ggbetAPI';
import { getCurrentMap, getLeadingTeamScore } from './dataProvider/utils';
import { getClient } from './dataProvider/client';
import { progressBarManager } from './progressBarManager';
import { matchDataManager } from './matchDataManager';
import { matchSubscriptionManager } from './matchSubscriptionManager';
import { matchListManager } from './matchListManager';

//https://stackoverflow.com/questions/51628752/how-do-i-implement-a-database-connection-select-close-using-rxjs-observables

// const [link, client] = getClient();
const [link] = getClient();

// client.onConnected((...args) => {
//   console.log('onConnected', ...args);
// });

// client.onDisconnected((...args) => {
//   console.log('onDisconnected', ...args);
// });

// setTimeout(() => {
//   client.close(true);

//   console.log('disconect');
// }, 10000);

const progressBar = progressBarManager();
const matchData = matchDataManager();
const matchSubscription = matchSubscriptionManager();
const matchList = matchListManager(link);

matchList.subscribe((matches) => {
  const newMatches = matches.filter((m) => !matchSubscription.getSubscriptionById(m.id));
  const finishedMatches = filterResultedMatches(matches);

  newMatches.forEach(subscribeToMatchUpdates);
  finishedMatches.forEach(matchSubscription.unsubscribeAll);
});

async function subscribeToMatchUpdates(match: Match) {
  createOrUpdateProgressBar(match);
  matchSubscription.subscribe(link, match, updateProgressBar);
  matchSubscription.subscribe(link, match, saveMatchUpdates);
}

function updateProgressBar({ data: { onUpdateSportEvent: match } }: OnUpdateSportEvent) {
  createOrUpdateProgressBar(match);
}

async function saveMatchUpdates({ data: { onUpdateSportEvent: match } }: OnUpdateSportEvent) {
  if (!matchData.getMatchById(match.id)) await matchData.loadMatchData(match);
  matchData.onUpdateSportEvent(match);
}

function createOrUpdateProgressBar(match: Match) {
  const currentMap = getCurrentMap(match.fixture.competitors);
  const leadingScore = getLeadingTeamScore(match, currentMap);
  progressBar.createOrUpdate(match.id, leadingScore, currentMap, match.slug);
}

function filterResultedMatches(updatedMatchList: Match[]) {
  const matchIds = updatedMatchList.map((m) => m.id);
  return matchSubscription.getSubscriptionIds().filter((id) => !matchIds.includes(id));
}
