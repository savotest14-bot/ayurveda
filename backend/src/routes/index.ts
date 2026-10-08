import { Router } from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import blogRoutes from './blogRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import contactRoutes from './contactRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/blogs', blogRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/contact', contactRoutes);
router.use('/settings', settingsRoutes);
router.use('/upload', uploadRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Varsha Ayurveda Backend API'
  });
});

export default router;
