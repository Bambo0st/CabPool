import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';

// Controller to create a new booking
const createBooking = async (req, res) => {
    try {
        const { pickupLocation, dropoffLocation, departureTime, arrivalTime, availableSeats } = req.body;

        // Ensure departureTime is in the future
        if (new Date(departureTime) < new Date()) {
            return res.status(400).json({ message: 'Departure time must be in the future' });
        }

        // Ensure available seats is a positive number
        if (availableSeats <= 0) {
            return res.status(400).json({ message: 'Available seats must be a positive number' });
        }

        // Ensure departureTime is before arrivalTime
        if (new Date(departureTime) >= new Date(arrivalTime)) {
            return res.status(400).json({ message: 'Departure time must be before arrival time' });
        }

        const newBooking = new Booking({
            pickupLocation,
            dropoffLocation,
            departureTime,
            arrivalTime,
            availableSeats,
            createdBy: req.user._id
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to get all open bookings
const getAllOpenBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'open' }).populate('createdBy', 'name email');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to get bookings between a specific time range (based on departureTime)
const getBookingsByDateAndTime = async (req, res) => {
    try {
        const { startTime, endTime } = req.query;

        // Check if required query parameters are provided
        if (!startTime || !endTime) {
            return res.status(400).json({ message: 'Start time and end time are required.' });
        }

        const startTimeObj = new Date(startTime);
        const endTimeObj = new Date(endTime);

        // Ensure that start time is before end time
        if (startTimeObj >= endTimeObj) {
            return res.status(400).json({ message: 'Start time must be before end time' });
        }

        // Find bookings where departureTime is within the specified time range
        const bookings = await Booking.find({
            departureTime: { $gte: startTimeObj, $lte: endTimeObj }
        })
        .populate('createdBy', 'name email');

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for the given time range.' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to get all bookings of a specific user (created or joined)
const getUserBookings = async (req, res) => {
    try {
        const userBookings = await Booking.find({
            $or: [{ createdBy: req.user._id }, { passengers: req.user._id }]
        })
        .populate('createdBy', 'name email');
        res.status(200).json(userBookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createBooking, getAllOpenBookings, getUserBookings, getBookingsByDateAndTime };
