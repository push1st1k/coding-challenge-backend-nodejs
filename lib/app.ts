import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import {department, officer, task} from './routes';
import { NextFunction, Response, Request } from 'express';
import * as swagger from 'swagger-express-ts';

export const app: express.Application = express();

app.use( '/api-docs/swagger' , express.static( 'swagger' ) );
app.use( '/api-docs/swagger/assets' , express.static( 'node_modules/swagger-ui-dist' ) );
app.use(
  swagger.express({
      definition: {
          info: {
              title: 'API',
              version: '1.0',
          }
      },
  })
);

app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use('/v1/department', department);
app.use('/v1/officer', officer);
app.use('/v1/task', task);

app.use(function logErrors (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(`error during request ${req.method} ${req.path}`, err);
  next(err);
})
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  if (err && err.stack) {
      delete err.stack;
  }
  res.status(400).json({error: err.message});
});