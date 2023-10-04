import express, { Express } from 'express';
import { setMongoose } from './config/db';
import apiRouter from './routes/apiRoute';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { options, serve, setup, swaggerSpec } from './config/swagger'
import { throttle } from './config/throttle';
import { Swagger } from 'express-swagger-generator';


dotenv.config();

// import { createServer } from "http";

const app: Express = express();
const port = process.env.PORT;
// const httpServer = createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.disable('x-powered-by');
app.use('/docs', serve, setup(swaggerSpec));

// Swagger(app)(options);

app.use('/api', throttle);
app.use(`/api`, apiRouter);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  setMongoose();
});

