import express from 'express';

import AuthController from '../controllers/authController.js';
import AuthValidation from '../validators/authValidationRequest.js';
import RateLimit from '../middlewares/rateLimiter.js';

const authRouter = express.Router();
const authController = new AuthController();
const rateLimit = new RateLimit();

authRouter.post(
   '/register',
   rateLimit.registerLimiter,
   AuthValidation.register(),
   authController.register
);
authRouter.post('/login', rateLimit.loginLimiter, AuthValidation.login(), authController.login);

export default authRouter;
