import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    errors: []
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 attempts per 15 min for auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login/registration attempts, please try again later',
    errors: []
  }
});
