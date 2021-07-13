import { MatchUpdates } from '../types/ggbetAPI';
const fs = require('fs');
const fsp = require('fs').promises;

export function saveMatch(slug: string, match: MatchUpdates) {
  const matchData = JSON.stringify(match, null, 2);
  fs.writeFile(`./data/${slug}.json`, matchData, function (err) {
    if (err) return console.log(err);
    console.log(`matchData saved to > ${slug}.json`);
  });
}

export async function getSavedMatch(slug: string): Promise<MatchUpdates | null> {
  try {
    return JSON.parse(await fsp.readFile(`./data/${slug}.json`, 'utf8'));
  } catch (error) {
    return null;
  }
}

export function saveMatches(matches: any) {
  const matchesData = JSON.stringify(matches, null, 2);
  fs.writeFile(`./matches.json`, matchesData, function (err) {
    if (err) return console.log(err);
    console.log(`matchesData saved to > matches.json`);
  });
}
