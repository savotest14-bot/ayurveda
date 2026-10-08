import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AdminDashboardController } from '../controllers/adminDashboardController.js';
import { ProductController } from '../controllers/productController.js';
import { CategoryController } from '../controllers/categoryController.js';
import { BlogController } from '../controllers/blogController.js';
import { OrderController } from '../controllers/orderController.js';
import { ContactController } from '../controllers/contactController.js';
import { SettingsController } from '../controllers/settingsController.js';

import { createProductSchema, updateProductSchema } from '../validators/productValidators.js';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidators.js';
import { createBlogSchema, updateBlogSchema } from '../validators/blogValidators.js';
import { updateOrderStatusSchema } from '../validators/orderValidators.js';
import { updateContactStatusSchema } from '../validators/contactValidators.js';
import { updateSettingsSchema } from '../validators/settingsValidators.js';

const router = Router();

// Apply admin authentication to all routes here
router.use(authenticate, requireAdmin);

// Dashboard & Customers
router.get('/dashboard', AdminDashboardController.getDashboard);
router.get('/customers', AdminDashboardController.getCustomers);
router.put('/customers/:id/status', AdminDashboardController.toggleCustomerStatus);

// Products
router.get('/products', ProductController.adminGetAll);
router.get('/products/:id', ProductController.getById);
router.post('/products', validate(createProductSchema), ProductController.create);
router.put('/products/:id', validate(updateProductSchema), ProductController.update);
router.delete('/products/:id', ProductController.delete);

// Categories
router.get('/categories', CategoryController.getAll);
router.post('/categories', validate(createCategorySchema), CategoryController.create);
router.put('/categories/:id', validate(updateCategorySchema), CategoryController.update);
router.delete('/categories/:id', CategoryController.delete);

// Blogs
router.get('/blogs', BlogController.getAll);
router.get('/blogs/:id', BlogController.getById);
router.post('/blogs', validate(createBlogSchema), BlogController.create);
router.put('/blogs/:id', validate(updateBlogSchema), BlogController.update);
router.delete('/blogs/:id', BlogController.delete);

// Orders
router.get('/orders', OrderController.adminGetAll);
router.get('/orders/:id', OrderController.getById);
router.put('/orders/:id/status', validate(updateOrderStatusSchema), OrderController.updateStatus);

// Contact Messages
router.get('/contact-messages', ContactController.adminGetAll);
router.put('/contact-messages/:id', validate(updateContactStatusSchema), ContactController.updateStatus);

// Settings
router.get('/settings', SettingsController.getSettings);
router.put('/settings', validate(updateSettingsSchema), SettingsController.updateSettings);

export default router;
