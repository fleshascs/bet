// import { createServer } from 'http'
// import { parse } from 'url'
// import next from 'next'

// const port = parseInt(process.env.PORT || '3000', 10)
// const dev = process.env.NODE_ENV !== 'production'
// const app = next({ dev })
// const handle = app.getRequestHandler()

// app.prepare().then(() => {
//   createServer((req, res) => {
//     const parsedUrl = parse(req.url!, true)
//     handle(req, res, parsedUrl)
//   }).listen(port)

//   // tslint:disable-next-line:no-console
//   console.log(
//     `> Server listening at http://localhost:${port} as ${
//       dev ? 'development' : process.env.NODE_ENV
//     }`
//   )
// })

import express from 'express';
import next from 'next';

// https://levelup.gitconnected.com/set-up-next-js-with-a-custom-express-server-typescript-9096d819da1c

// const port = parseInt(process.env.PORT, 10) || 3000;
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`server is running on PORT ${port}`);
  });
});
