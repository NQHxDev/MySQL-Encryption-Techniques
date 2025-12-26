import rateLimit from 'express-rate-limit';

class RateLimit {
   registerLimiter = rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 5,
      message: {
         success: false,
         message: 'Quá nhiều yêu cầu đăng ký trong thời gian ngắn! Vui lòng thử lại sau 10 phút!',
      },
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false,
      keyGenerator: (req) => {
         return `${req.ip}-${req.body.email || ''}`;
      },
   });

   loginLimiter = rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 10,
      message: {
         success: false,
         message: 'Quá nhiều lần đăng nhập thất bại! Vui lòng thử lại sau 10 phút!',
      },
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true,
      keyGenerator: (req) => {
         return `${req.ip}-${req.body.email || ''}`;
      },
   });
}

export default RateLimit;
