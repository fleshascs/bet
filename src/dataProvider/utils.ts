import { GetMatchesByFilters, MatchUpdates } from '../types/ggbetAPI';
const fs = require('fs');
const sanitize = require('sanitize-filename');

export function saveMatch(slug: string, match: MatchUpdates): void {
  const safeSlug = sanitize(slug);
  const matchData = JSON.stringify(match, null, 2);
  fs.writeFile(`./data/${safeSlug}.json`, matchData, function (err) {
    if (err) return console.log(err);
    console.log(`matchData saved to > ${safeSlug}.json`);
  });
}

export async function getSavedMatch(slug: string): Promise<MatchUpdates | null> {
  try {
    const safeSlug = sanitize(slug);
    return JSON.parse(await fs.promises.readFile(`./data/${safeSlug}.json`, 'utf8'));
  } catch (error) {
    return null;
  }
}

export function saveMatches(matches: GetMatchesByFilters['data']['matches']): void {
  const matchesData = JSON.stringify(matches, null, 2);
  fs.writeFile('./matches.json', matchesData, function (err) {
    if (err) return console.log(err);
    console.log('matchesData saved to > matches.json');
  });
}

// export function someParsing(response: OnUpdateSportEvent) {
//   const match = response.data.onUpdateSportEvent;
//   const market = match.markets.find((market) => market.name === 'Winner');
//   const oddsByCompetitorId = market.odds.reduce((odds, odd) => {
//     odds[odd.competitorId] = odd;
//     return odds;
//   }, {});

//   let totalMapsPlayed = countMapsPlayed(match.fixture.competitors);
//   const currentMap = totalMapsPlayed + 1;
//   if (!matchStats[match.slug]) {
//     matchStats[match.slug] = { maps: {} };
//   }

//   let mapStats = matchStats[match.slug].maps[currentMap];
//   if (!mapStats) mapStats = matchStats[match.slug].maps[currentMap] = [];

//   match.fixture.competitors.forEach((competitor) => {
//     competitor.score.forEach((score) => {
//       if (score.type !== 'map') return;
//       if (score.number === currentMap) {
//         oddsByCompetitorId[competitor.id].points = score.points;
//       }
//     });
//   });

//   mapStats.push(Object.values(oddsByCompetitorId));

// }
