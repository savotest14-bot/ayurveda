import { Router } from 'express';
import { UploadController } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/single', authenticate, requireAdmin, upload.single('image'), UploadController.uploadSingle);
router.post('/multiple', authenticate, requireAdmin, upload.array('images', 8), UploadController.uploadMultiple);

export default router;
