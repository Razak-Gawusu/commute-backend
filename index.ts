import cors from 'cors';
import debugFn from 'debug';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { dbConnect } from '@/config';
import { ErrorController } from '@/controllers';

import 'dotenv/config';

dotenv.config();

process.on('uncaughtException', (err) => {
  console.error('uncaughtException');
  console.error(err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
const debug = debugFn('commute:startup');
const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'working' });
});

app.all('*', (req, res, next) => {
  const err = new ErrorController(
    `Can't find ${req.originalUrl} on the server`,
    404,
  );
  next(err);
});

app.use(ErrorController.globalErrorhandler);
dbConnect();

const server = app.listen(PORT, () =>
  debug(`successfully connected to PORT: ${PORT}`),
);

process.on('unhandledRejection', (err: Error) => {
  console.log('unhandledRejection');
  console.error(err);
  server.close(() => process.exit(1));
});
