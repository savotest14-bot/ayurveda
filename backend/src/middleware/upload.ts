import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ApiError } from '../utils/apiResponse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/jpg'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid image format. Allowed formats: JPG, PNG, WEBP, SVG'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter
});
