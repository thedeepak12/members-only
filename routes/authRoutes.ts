import { Router } from 'express';
import { validateSignup } from '../middleware/validateForm.js';
import { postSignup } from '../controllers/authController.js';

const router = Router();

router.post('/signup', validateSignup, postSignup);

export default router;
