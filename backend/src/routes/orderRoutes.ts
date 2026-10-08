import { Router } from 'express';
import { OrderController } from '../controllers/orderController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema } from '../validators/orderValidators.js';

const router = Router();

router.post('/cod-whatsapp', optionalAuthenticate, validate(createOrderSchema), OrderController.createCodWhatsapp);
router.post('/create-razorpay', optionalAuthenticate, validate(createOrderSchema), OrderController.createRazorpay);
router.post('/create', optionalAuthenticate, validate(createOrderSchema), OrderController.createRazorpay);

router.get('/my-orders', authenticate, OrderController.getMyOrders);
router.get('/number/:orderNumber', OrderController.getByNumber);
router.get('/:id', authenticate, OrderController.getById);

export default router;
