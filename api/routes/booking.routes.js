import express from 'express';
import { createBooking, getAllBookings, getUserBookings } from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/bookings
router.post('/', authenticate, createBooking);

// GET /api/bookings
router.get('/', authenticate, getAllBookings);

// GET /api/bookings/user
router.get('/user', authenticate, getUserBookings);

export default router;
