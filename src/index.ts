import express, { Express } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import apiRouter from './routes/apiRoute';
import { setMongoose } from './config/db';

dotenv.config();

// import { createServer } from "http";


const app: Express = express();
const port = process.env.PORT;
// const httpServer = createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(`/api`, apiRouter);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  setMongoose();
});

