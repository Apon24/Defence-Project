import express from 'express';
import { signup, login, getMe, forgotPassword, verifyEmail } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/verify-email', verifyEmail);

export default router;

