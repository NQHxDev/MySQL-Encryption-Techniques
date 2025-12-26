import express from 'express';
import helmet from 'helmet';
import compression from 'compression';

import mainRouter from './routers/mainRouter.js';
import { initDatabase } from './services/databaseService.js';

const app = express();

// Init Database
await initDatabase();

// Init Middleware
app.use(helmet());
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Init Router
app.use('/', mainRouter);

export default app;
