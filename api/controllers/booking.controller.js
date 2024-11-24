import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';

const createBooking = async (req, res) => {
    try {
        const { pickupLocation, dropoffLocation, rideDate, availableSeats, startTimeWindow, endTimeWindow } = req.body;

        if (new Date(rideDate) < new Date()) {
            return res.status(400).json({ message: 'Ride date must be in the future' });
        }

        if (availableSeats <= 0) {
            return res.status(400).json({ message: 'Available seats must be a positive number' });
        }

        if (new Date(startTimeWindow) >= new Date(endTimeWindow)) {
            return res.status(400).json({ message: 'Start time must be before end time' });
        }

        const newBooking = new Booking({
            pickupLocation,
            dropoffLocation,
            rideDate,
            availableSeats,
            startTimeWindow,
            endTimeWindow,
            createdBy: req.user._id
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getOpenAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'open' }).populate('createdBy', 'name email');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBookingsByDateAndTime = async (req, res) => {
    try {
        const { rideDate, startTimeWindow, endTimeWindow } = req.query;

        if (!rideDate || !startTimeWindow || !endTimeWindow) {
            return res.status(400).json({ message: 'Ride date, start time window, and end time window are required.' });
        }

        const rideDateObj = new Date(rideDate); //copy karo
        const startTimeWindowObj = new Date(startTimeWindow);
        const endTimeWindowObj = new Date(endTimeWindow);

        const normalizedRideDate = new Date(rideDateObj.setHours(0, 0, 0, 0)); // Set time to 00:00:00

        const bookings = await Booking.find({
            rideDate: { $gte: normalizedRideDate, $lt: new Date(normalizedRideDate.getTime() + 24 * 60 * 60 * 1000) },  // Same day, ignore time
            startTimeWindow: { $gte: startTimeWindowObj },  
            endTimeWindow: { $lte: endTimeWindowObj }  
        }).populate('createdBy', 'name email');

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for the given date and time range.' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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

export { createBooking, getOpenAllBookings, getUserBookings, getBookingsByDateAndTime };
