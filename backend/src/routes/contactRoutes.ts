import { Router } from 'express';
import { ContactController } from '../controllers/contactController.js';
import { validate } from '../middleware/validate.js';
import { createContactSchema } from '../validators/contactValidators.js';

const router = Router();

router.post('/', validate(createContactSchema), ContactController.submit);

export default router;
