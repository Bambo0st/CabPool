import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';

const createBooking = async (req, res) => {
    try {
        const { pickupLocation, dropoffLocation, rideDate, availableSeats } = req.body;

        const newBooking = new Booking({
            pickupLocation,
            dropoffLocation,
            rideDate,
            availableSeats,
            createdBy: req.user._id
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'open' }).populate('createdBy', 'name email');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const userBookings = await Booking.find({
            $or: [{ createdBy: req.user._id }, { passengers: req.user._id }]
        }).populate('createdBy', 'name email');
        res.status(200).json(userBookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createBooking, getAllBookings, getUserBookings };
