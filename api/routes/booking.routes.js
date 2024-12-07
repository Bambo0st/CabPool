import express from 'express';
import { createBooking, getAllOpenBookings, getUserBookings, joinBooking, getBookingsByDateAndTime } from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, createBooking);

router.get('/', getAllOpenBookings);

router.get('/user', authenticate, getUserBookings);

router.get('/filter', getBookingsByDateAndTime);
router.patch('/join', authenticate, joinBooking);

export default router;
