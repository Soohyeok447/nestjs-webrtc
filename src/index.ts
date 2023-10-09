import express, { Express } from 'express';
// import { createServer } from "http";
import { setMongoose } from './config/db';
import apiRouter from './routes/apiRoute';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import { serve, setup, swaggerSpec } from './config/swagger'
import { throttle } from './config/throttle';

const environment = process.env.NODE_ENV || 'development';

dotenv.config({
  path: `.env.${environment}`,
});


const app: Express = express();
const port = process.env.PORT;
// const httpServer = createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.disable('x-powered-by');
environment === 'development'
  ? app.use(cors({
    origin: `http://localhost:${[port]}`,
  }))
  : ({});
app.use('/docs', serve, setup(swaggerSpec));

// Swagger(app)(options);

app.use('/api', throttle);
app.use(`/api`, apiRouter);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  setMongoose();
});

