import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = 3001;

app.get('/', (req: Request, res: Response) => {
  res.json({ hi: "hi" })
});

app.listen(port, () => {
  console.log(`https://localhost:${port}`);
});

/**
 * TODO
 */