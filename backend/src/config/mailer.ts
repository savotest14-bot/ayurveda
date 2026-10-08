import nodemailer from 'nodemailer';
import { ENV } from './env.js';

export const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: ENV.SMTP_PORT,
  secure: ENV.SMTP_PORT === 465,
  auth: ENV.SMTP_USER ? {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASSWORD
  } : undefined
});
