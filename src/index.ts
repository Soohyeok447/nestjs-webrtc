import express, { Express } from 'express';
import { setMongoose } from './config/db';
import apiRouter from './routes/apiRoute';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

dotenv.config();

// import { createServer } from "http";


const app: Express = express();
const port = process.env.PORT;
// const httpServer = createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.disable('x-powered-by');

const throttle = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    message: '최대 요청 횟수를 초과했습니다. 잠시후 다시 시도해주세요.'
  }
});

app.use('/api', throttle);
app.use(`/api`, apiRouter);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  setMongoose();
});

