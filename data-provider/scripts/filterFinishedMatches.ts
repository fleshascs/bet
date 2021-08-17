const glob = require('glob');
const fsp = require('fs').promises;
import { MatchUpdates } from '../src/types/ggbetAPI';
import { didMatchEnded } from '../src/dataProvider/utils';

glob('./data/**/*.json', null, async function (er, files: string[]) {
  const unfinished = [];

  const readTasks = files.map(async (filePath) => {
    const matchStats: MatchUpdates = JSON.parse(await fsp.readFile(filePath, 'utf8'));
    const hasMatchEnded = didMatchEnded(matchStats);
    if (!hasMatchEnded) {
      unfinished.push({
        filePath,
        startsAt: new Date(matchStats.match.fixture.startTime).toLocaleString()
      });
    }
  });

  await Promise.all(readTasks);

  console.log('unfinished', unfinished);
  console.log('unfinished matches', unfinished.length);
});
