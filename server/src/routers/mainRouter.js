import express from 'express';

import authRouter from './authRouter.js';
import styRouter from './systemRouter.js';

const mainRouter = express.Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/system', styRouter);

mainRouter.get('/', (req, res) => {
   res.send('Server running ...');
});

export default mainRouter;
