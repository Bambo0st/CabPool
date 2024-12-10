import Booking from '../models/booking.model.js';
import logger from '../logger.js';

const createBooking = async (req, res) => {
    try {
        const { pickupLocation, dropoffLocation, departureTime, arrivalTime, availableSeats } = req.body;

        if (new Date(departureTime) < new Date()) {
            logger.warn(`Invalid departure time: ${departureTime}`);
            return res.status(400).json({ message: 'Departure time must be in the future' });
        }

        if (availableSeats <= 0) {
            logger.warn(`Invalid available seats: ${availableSeats}`);
            return res.status(400).json({ message: 'Available seats must be a positive number' });
        }

        if (new Date(departureTime) >= new Date(arrivalTime)) {
            logger.warn(`Departure time is not before arrival time: ${departureTime} >= ${arrivalTime}`);
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
        logger.info(`Booking created by user ${req.user._id}: ${JSON.stringify(newBooking)}`);
        res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        logger.error(`Error creating booking: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const getAllOpenBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: 'open' }).populate('createdBy', 'name email');
        logger.info(`Fetched all open bookings: ${bookings.length} bookings retrieved`);
        res.status(200).json(bookings);
    } catch (error) {
        logger.error(`Error fetching open bookings: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const getBookingsByDateAndTime = async (req, res) => {
    try {
        const { startTime, endTime, pickupLocation, dropoffLocation } = req.query;

        if (!startTime || !endTime) {
            logger.warn('Start time or end time missing in query');
            return res.status(400).json({ message: 'Start time and end time are required.' });
        }

        const startTimeObj = new Date(startTime);
        const endTimeObj = new Date(endTime);

        if (startTimeObj >= endTimeObj) {
            logger.warn(`Invalid time range: Start time (${startTime}) >= End time (${endTime})`);
            return res.status(400).json({ message: 'Start time must be before end time' });
        }

        const query = {
            departureTime: { $gte: startTimeObj, $lte: endTimeObj }
        };

        if (pickupLocation) {
            query.pickupLocation = { $regex: pickupLocation, $options: 'i' };
        }

        if (dropoffLocation) {
            query.dropoffLocation = { $regex: dropoffLocation, $options: 'i' };
        }

        const bookings = await Booking.find(query).populate('createdBy', 'name email');

        if (bookings.length === 0) {
            logger.info('No bookings found for the given criteria');
            return res.status(404).json({ message: 'No bookings found for the given criteria.' });
        }

        logger.info(`Found ${bookings.length} bookings for the given criteria`);
        res.status(200).json(bookings);
    } catch (error) {
        logger.error(`Error fetching bookings by date and time: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const userBookings = await Booking.find({
            $or: [{ createdBy: req.user._id }, { passengers: req.user._id }]
        })
            .populate('createdBy', 'name email')
            .populate('passengers', 'name email');

        logger.info(`Fetched ${userBookings.length} bookings for user ${req.user._id}`);
        res.status(200).json(userBookings);
    } catch (error) {
        logger.error(`Error fetching user bookings: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const joinBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            logger.warn(`Booking not found: ${bookingId}`);
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'closed') {
            logger.warn(`Attempt to join a closed booking: ${bookingId}`);
            return res.status(400).json({ message: 'This booking is closed and cannot be joined' });
        }

        if (booking.passengers.includes(req.user._id)) {
            logger.warn(`User ${req.user._id} already joined booking: ${bookingId}`);
            return res.status(400).json({ message: 'You have already joined this booking' });
        }

        if (booking.passengers.length >= booking.availableSeats) {
            logger.warn(`No available seats for booking: ${bookingId}`);
            return res.status(400).json({ message: 'No available seats for this booking' });
        }

        booking.passengers.push(req.user._id);
        booking.availableSeats -= 1;

        await booking.save();
        logger.info(`User ${req.user._id} joined booking: ${bookingId}`);
        res.status(200).json({ message: 'You have successfully joined the booking', booking });
    } catch (error) {
        logger.error(`Error joining booking: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

export {
    createBooking,
    getAllOpenBookings,
    getUserBookings,
    getBookingsByDateAndTime,
    joinBooking
};
