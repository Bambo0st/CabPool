import express from 'express';
import { registerUser, loginUser, logoutUser, authenticateToken } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = express.Router();

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser);

router.post('/logout', logoutUser);

router.get('/me', authenticate, authenticateToken);
export default router;
