const glob = require('glob');
const fsp = require('fs').promises;
import { MatchUpdates } from '../src/types/ggbetAPI';

glob('./data/**/*.json', null, async function (er, files: string[]) {
  const unfinished = [];

  const readTasks = files.map(async (filePath) => {
    const matchStats: MatchUpdates = JSON.parse(await fsp.readFile(filePath, 'utf8'));
    const hasMatchEnded = matchStats.onUpdateSportEvent?.some(
      (update) => update.fixture.status === 'ENDED'
    );
    if (!hasMatchEnded) {
      unfinished.push({
        filePath,
        startsAt: new Date(matchStats.match.fixture.startTime).toLocaleString()
      });
    }
  });

  await Promise.all(readTasks);

  console.log('unfinished', unfinished);
});
