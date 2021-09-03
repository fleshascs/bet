import { join } from 'path';
import { fork } from 'child_process';

const controller = new AbortController();
const { signal } = controller;

const child = fork(join(__dirname, 'collectData.ts'), ['child'], { signal });

child.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
});

// controller.abort(); // Stops the child process

child.on('close', function (code) {
  console.log('child process exited with code ' + code);
});

child.on('message', function (message) {
  console.log('child process message ', message);
});

// How to useforkfunctioninchild_process
// https://www.tabnine.com/code/javascript/functions/child_process/fork
// https://sebhastian.com/nodejs-fork/
