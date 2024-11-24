import express from 'express';
import { sendRequest, respondToRequest } from '../controllers/request.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/requests
router.post('/', authenticate, sendRequest);

// POST /api/requests/respond
router.post('/respond', authenticate, respondToRequest);

export default router;
