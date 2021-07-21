import { matchDataManager } from '../matchDataManager';
import { Competitor, GetMatchesByFilters, Match, MatchUpdates } from '../types/ggbetAPI';
const fs = require('fs');
const sanitize = require('sanitize-filename');

export function saveMatch(slug: string, match: MatchUpdates): void {
  const safeSlug = sanitize(slug);
  const matchData = JSON.stringify(match, null, 2);
  fs.writeFile(`./data/${safeSlug}.json`, matchData, function (err) {
    if (err) return console.log(err);
    // console.log(`matchData saved to > ${safeSlug}.json`);
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

export function getCurrentMap(competitors: Competitor[]) {
  const mapsPlayed = countMapsPlayed(competitors);
  const totalMaps = competitors[0].score.reduce<number>((totalMaps, map) => {
    map.type === 'map' && totalMaps++;
    return totalMaps;
  }, 0);
  return Math.min(totalMaps, mapsPlayed + 1);
}

function countMapsPlayed(competitors: Competitor[]) {
  return competitors.reduce<number>((totalMapsPlayed, competitor) => {
    const competitorScore = competitor.score.find((score) => score.id === 'total');
    return totalMapsPlayed + parseInt(competitorScore.points);
  }, 0);
}

export function getLeadingTeamScore(match: Match, mapNumber: number) {
  let leadingScore: number = 0;
  match.fixture.competitors.forEach((competitor) => {
    competitor.score.forEach((score) => {
      if (score.type !== 'map') return;
      if (score.number !== mapNumber) return;
      const roundsWon = parseInt(score.points);
      if (roundsWon > leadingScore) {
        leadingScore = roundsWon;
      }
    });
  });
  return leadingScore;
}

export function didMatchEnded(match: MatchUpdates) {
  return match.onUpdateSportEvent?.some((update) => update.fixture.status === 'ENDED');
}

export function fixMatchSlug(match: Match, data: ReturnType<typeof matchDataManager>) {
  //match id sometimes gets sent as a slug
  if (!data.getMatchBySlug(match.slug)) {
    const m = data.findMatchById(match.slug);
    if (!m) throw new Error('unable to find a match slug: ' + match.slug);
    match.slug = m.match.slug;
  }
  return match;
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
