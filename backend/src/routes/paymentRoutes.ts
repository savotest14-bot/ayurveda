import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController.js';
import { validate } from '../middleware/validate.js';
import { verifyPaymentSchema } from '../validators/paymentValidators.js';

const router = Router();

router.post('/razorpay/verify', validate(verifyPaymentSchema), PaymentController.verifyRazorpay);
router.post('/razorpay/webhook', PaymentController.razorpayWebhook);

export default router;
