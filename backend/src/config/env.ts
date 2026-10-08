import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_for_jwt_varsha_ayurveda',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_VarshaAyurvedaDemoKey',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_demo_9876543210',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_key_12345',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:5174',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER || '919907303284',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  SMTP_FROM: process.env.SMTP_FROM || 'Varsha Ayurveda <info@varshaayurveda.in>'
};
