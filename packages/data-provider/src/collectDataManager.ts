import { join } from 'path';
import { ChildProcess, fork } from 'child_process';
import { logger } from './logger';

interface CollectDataManager {
  start: () => void;
  kill: () => void;
}

export function collectDataManager(): CollectDataManager {
  let processes: AbortController[] = [];

  function startCollectingData() {
    const { controller, child } = forkProcess();
    const index = processes.push(controller) - 1;
    child.on('close', function (code) {
      logger.info('CollectData process exited with code ' + code);
      if (code === null) {
        logger.info('Not restarting, process aborted by parent');
        return;
      }
      logger.info('Restarting....');
      processes.splice(index, 1);
      startCollectingData();
    });
  }

  return {
    start: startCollectingData,
    kill: () => {
      processes.forEach((controller) => {
        controller.abort();
      });
      processes = [];
    }
  };
}

interface ForkProcess {
  controller: AbortController;
  child: ChildProcess;
}

function forkProcess(): ForkProcess {
  logger.info('Starting a collectData process');

  const controller = new AbortController();
  const { signal } = controller;

  const child = fork(join(__dirname, 'collectData.ts'), ['child'], { signal, detached: false });

  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
    logger.error(err, 'CollectDataProcess child error');
  });

  child.on('message', function (message) {
    logger.info('child process message ', message);
  });

  return {
    controller,
    child
  };
}
