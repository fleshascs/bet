const glob = require('glob');
const fsp = require('fs').promises;
import { didMatchEnded } from '../src/dataProvider/utils';
import { MatchUpdates, Odd } from '../src/types/ggbetAPI';

glob('./data/**/*.json', null, async function (er, files: string[]) {
  let myProfit = 0;
  let totalBets = 0;
  let totalWon = 0;
  let totalLoss = 0;
  let totalWonMoney = [];
  let totalLostMoney = [];

  const readTasks = files.map(async (filePath) => {
    try {
      const matchStats: MatchUpdates = JSON.parse(await fsp.readFile(filePath, 'utf8'));
      const hasMatchEnded = didMatchEnded(matchStats);

      if (!hasMatchEnded) return;
      const lowestOdds = getPreMatchLowestOdds(matchStats); // 1.54 eur.
      // const lowestOdds = findOddsBetween(matchStats, 1.1, 1.2); // -1.6 eur.
      // const lowestOdds = findOddsBetween(matchStats, 1.02, 1.05); // -1.0 eur.
      // const lowestOdds = findOddsBetween(matchStats, 1.05, 1.1); // -0.4 eur.
      // const lowestOdds = findOddsBetween(matchStats, 1.7, 1.8); // 3.5 eur.
      // const lowestOdds = findOddsBetween(matchStats, 1.3, 1.7); //  1.0 eur.

      const matchResuts = matchStats.onUpdateSportEvent?.find(
        (update) => update.fixture.status === 'ENDED'
      );
      const matchEndOdds = matchResuts.markets.find((market) => market.id === '1');
      const myOdds = matchEndOdds.odds.find((odds) => odds.name === lowestOdds.name);
      if (myOdds.status === 'WIN') {
        myProfit += parseFloat(lowestOdds.value);
        totalWonMoney.push(parseFloat(lowestOdds.value));
        totalWon++;
      } else if (myOdds.status === 'LOSS') {
        totalLostMoney.push(parseFloat(lowestOdds.value));
        // nothing happens
        totalLoss++;
      } else {
        throw new Error('no results for the match');
      }
      myProfit -= 1; // I'm betting 1 eur every match
      totalBets++;
    } catch (error) {
      console.log(filePath, ' error', error);
    }
  });

  await Promise.all(readTasks);
  console.log(
    'totalWonMoney',
    totalWonMoney,
    totalWonMoney.reduce((a, b) => a + b, 0)
  );
  console.log('totalLostMoney', totalLostMoney, totalLostMoney.length);
  console.log('total bets', totalBets);
  console.log('total matches won', totalWon);
  console.log('total matches lost', totalLoss);
  console.log('my profit', myProfit);
});

function getPreMatchLowestOdds(matchStats: MatchUpdates) {
  const beginingOfTheMatch = matchStats.onUpdateSportEvent[0].markets.find(
    (market) => market.id === '1'
  );
  const lowestOdd = beginingOfTheMatch.odds.reduce<Odd>((lowestOdds, odds) => {
    if (parseFloat(odds.value) < parseFloat(lowestOdds.value)) {
      lowestOdds = odds;
    }
    return lowestOdds;
  }, beginingOfTheMatch.odds[0]);

  if (matchStats.onUpdateSportEvent[0].fixture.status === 'NOT_STARTED') {
    return lowestOdd;
  }
  throw new Error('match already started');
}

function findOddsBetween(matchStats: MatchUpdates, odd1: number, odd2: number) {
  const min = Math.min(odd1, odd2);
  const max = Math.max(odd1, odd2);
  for (const match of matchStats.onUpdateSportEvent) {
    const market = match.markets.find((market) => market.id === '1');
    for (const odd of market.odds) {
      const value = parseFloat(odd.value);
      if (value > min && value < max) {
        return odd;
      }
    }
  }
}
