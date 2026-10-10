import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { ENV } from './config/env.js';

import { openApiSpec, getSwaggerHtml } from './utils/openapi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust reverse proxy (Nginx) for secure cookies and accurate rate-limiting IPs
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS setup
const allowedOrigins = [
  ENV.FRONTEND_URL,
  ENV.ADMIN_URL,
  'https://vershaayurveda.com',
  'https://www.vershaayurveda.com',
  'https://admin.vershaayurveda.com',
  'http://vershaayurveda.com',
  'http://www.vershaayurveda.com',
  'http://admin.vershaayurveda.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
].filter(Boolean).map(url => (url ? url.replace(/\/+$/, '') : ''));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow dev environments flexibly
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-razorpay-signature']
}));

// Body parsing with raw body capture for webhooks
app.use(express.json({
  verify: (req: any, _res, buf) => {
    if (req.url.includes('/webhook')) {
      req.rawBody = buf.toString();
    }
  }
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting on API routes
app.use('/api', apiLimiter);

// Static uploads directory
const uploadsDir = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));
app.use('/images', express.static(uploadsDir)); // fallback mapping

// API Documentation routes
app.get('/api/docs', (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(getSwaggerHtml());
});
app.get('/api/docs/openapi.json', (_req, res) => {
  res.json(openApiSpec);
});

// API Root Router
app.use('/api', routes);

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
