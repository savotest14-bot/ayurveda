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

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS setup
const allowedOrigins = [
  ENV.FRONTEND_URL,
  ENV.ADMIN_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
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
