import express from 'express';

import { verifyAdmin } from '../validators/authAdmin.js';
import SystemController from '../controllers/systemController.js';

const styRouter = express.Router();
const sysController = new SystemController();

styRouter.post('/backup', verifyAdmin, sysController.backupDatabase);
styRouter.post('/restore', verifyAdmin, sysController.restoreDatabase);

export default styRouter;
