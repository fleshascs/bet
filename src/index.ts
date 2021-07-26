import express, { Application, Request, Response } from 'express';
const app: Application = express();

app.get('/', (_req: Request, res: Response) => {
  res.send('TS App is Running');
});
const PORT = 80;
app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
