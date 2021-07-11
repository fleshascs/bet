import { OnUpdateSportEvent, GetMatchesByFilters, Competitor } from './types/ggbetAPI';
import { buildOperation as getMatchBySlug } from './queries/getMatchBySlug';
import { buildOperation as onUpdateSportEvent } from './queries/onUpdateSportEvent';
import { buildOperation as getMatchesByFilters } from './queries/getMatchesByFilters';
import { execute, makePromise } from 'apollo-link';
import { getClient } from './dataProvider/client';
const fs = require('fs');

const link = getClient();

const matchStats = {};

function onUpdateSportEventHandler(response: OnUpdateSportEvent) {
  const match = response.data.onUpdateSportEvent;
  const market = match.markets.find((market) => market.name === 'Winner');
  const oddsByCompetitorId = market.odds.reduce((odds, odd) => {
    odds[odd.competitorId] = odd;
    return odds;
  }, {});

  let totalMapsPlayed = countMapsPlayed(match.fixture.competitors);
  const currentMap = totalMapsPlayed + 1;
  if (!matchStats[match.slug]) {
    matchStats[match.slug] = { maps: {} };
  }

  let mapStats = matchStats[match.slug].maps[currentMap];
  if (!mapStats) mapStats = matchStats[match.slug].maps[currentMap] = [];

  match.fixture.competitors.forEach((competitor) => {
    competitor.score.forEach((score) => {
      if (score.type !== 'map') return;
      if (score.number === currentMap) {
        oddsByCompetitorId[competitor.id].points = score.points;
      }
    });
  });

  mapStats.push(Object.values(oddsByCompetitorId));

  const testData = JSON.stringify(mapStats, null, 2);
  fs.writeFile(`./data/${match.slug}.json`, testData, function (err) {
    if (err) return console.log(err);
    console.log(`matchStats > ${match.slug}.json`);
  });
}

(async () => {
  // const matchesResponse = await makePromise(
  //   execute(link, getMatchBySlug('g2-vs-complexity-18-06'))
  // );
  // fs.writeFile('g2-vs-complexity.json', JSON.stringify(matchesResponse, null, 2), function (err) {
  //   if (err) return console.log(err);
  //   console.log('response > response.json');
  // });

  const matchesResponse = (await makePromise(
    execute(link, getMatchesByFilters())
  )) as GetMatchesByFilters;
  if (!matchesResponse?.data?.matches) {
    console.log('matchesResponse ERROR');
    throw new Error(JSON.stringify(matchesResponse));
  }

  matchesResponse.data.matches.forEach((match) => {
    if (match.fixture.status !== 'LIVE') return;
    if (match.slug !== 'gambit-vs-natus-vincere-04-07') return;

    fs.writeFile(
      'gambit-vs-natus-vincere-04-07.json',
      JSON.stringify(match, null, 2),
      function (err) {
        if (err) return console.log(err);
        console.log('response > response.json');
      }
    );
    console.log('listening for:', match.slug);

    execute(link, onUpdateSportEvent(match.id)).subscribe({
      next: onUpdateSportEventHandler,
      error: (error) => console.log(`received error ${error}`),
      complete: () => console.log(`complete`)
    });
  });
})();

function countMapsPlayed(competitors: Competitor[]) {
  return competitors.reduce<number>((totalMapsPlayed, competitor) => {
    const competitorScore = competitor.score.find((score) => score.id === 'total');
    return totalMapsPlayed + parseInt(competitorScore.points);
  }, 0);
}
