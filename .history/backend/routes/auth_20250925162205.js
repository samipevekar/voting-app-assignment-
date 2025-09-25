import express from 'express';
import { login, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    User login
// @access  Public
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

export default router;