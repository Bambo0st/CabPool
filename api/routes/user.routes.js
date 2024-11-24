import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/user.controller.js';

const router = express.Router();

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser);

router.post('/logout', logoutUser);

export default router;
