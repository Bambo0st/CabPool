import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';

const createBooking = async (req, res) => {
    try {
        const { pickupLocation, dropoffLocation, departureTime, arrivalTime, availableSeats } = req.body;

        // Ensure departureTime is in the future
        if (new Date(departureTime) < new Date()) {
            return res.status(400).json({ message: 'Departure time must be in the future' });
        }

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
            createdBy: req.user._id,
            passengers: [req.user._id] 
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllOpenBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'open' }).populate('createdBy', 'name email');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBookingsByDateAndTime = async (req, res) => {
    try {
        const { startTime, endTime } = req.query;

        if (!startTime || !endTime) {
            return res.status(400).json({ message: 'Start time and end time are required.' });
        }

        const startTimeObj = new Date(startTime);
        const endTimeObj = new Date(endTime);

        if (startTimeObj >= endTimeObj) {
            return res.status(400).json({ message: 'Start time must be before end time' });
        }

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

const joinBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'closed') {
            return res.status(400).json({ message: 'This booking is closed and cannot be joined' });
        }

        // Ensure the user is not already a passenger
        if (booking.passengers.includes(req.user._id)) {
            return res.status(400).json({ message: 'You have already joined this booking' });
        }

        // Ensure there are available seats
        if (booking.passengers.length >= booking.availableSeats) {
            return res.status(400).json({ message: 'No available seats for this booking' });
        }

        booking.passengers.push(req.user._id);

        booking.availableSeats -= 1;

        await booking.save();

        res.status(200).json({ message: 'You have successfully joined the booking', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export { createBooking, getAllOpenBookings, getUserBookings, getBookingsByDateAndTime,joinBooking };
