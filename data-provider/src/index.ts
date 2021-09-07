import { logger } from './logger';
import schedule from 'node-schedule';
import { collectDataManager } from './collectDataManager';

// utc = -3hrs from lithuania time (GMT+3)

const collectData = collectDataManager();

// 11 morning at Vilnius
schedule.scheduleJob(getUTCDate(8), function () {
  logger.info('11 morning at Vilnius, starting to collect Data');
  collectData.kill();
  collectData.start();
});

// 1 morning at Vilnius
schedule.scheduleJob(getUTCDate(22), function () {
  logger.info('1 morning at Vilnius, stoping to collect Data');
  collectData.kill();
});

const currentUTCHour = new Date().getUTCHours();
if (currentUTCHour > 8 && currentUTCHour < 22) {
  collectData.start();
}

// How to useforkfunctioninchild_process
// https://www.tabnine.com/code/javascript/functions/child_process/fork
// https://sebhastian.com/nodejs-fork/

function getUTCDate(hour: number) {
  const rule = new schedule.RecurrenceRule();
  rule.hour = hour;
  rule.tz = 'Etc/UTC';
  return rule;
}
