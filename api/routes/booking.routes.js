import express from 'express';
import { createBooking, getAllOpenBookings, getUserBookings, joinBooking } from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/bookings
router.post('/', authenticate, createBooking);

// GET /api/bookings
router.get('/', getAllOpenBookings);

// GET /api/bookings/user
router.get('/user', authenticate, getUserBookings);

//GET /api/bookings/join
router.get('/join', authenticate, joinBooking);

export default router;
