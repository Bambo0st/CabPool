import Request from '../models/request.model.js';
import Booking from '../models/booking.model.js';

const sendRequest = async (req, res) => {
    try {
        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.passengers.includes(req.user._id)) {
            return res.status(400).json({ message: 'You have already joined this booking' });
        }

        if (booking.passengers.length >= booking.availableSeats) {
            return res.status(400).json({ message: 'No available seats for this booking' });
        }

        const newRequest = new Request({
            fromUser: req.user._id,
            toUser: booking.createdBy,
            booking: bookingId
        });

        await newRequest.save();
        res.status(201).json({ message: 'Request sent successfully', request: newRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const respondToRequest = async (req, res) => {
    try {
        const { requestId, response } = req.body;

        const request = await Request.findById(requestId).populate('booking');
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.toUser.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        request.status = response;
        await request.save();

        if (response === 'accepted') {
            const booking = request.booking;
            booking.passengers.push(request.fromUser);
            if (booking.passengers.length >= booking.availableSeats) {
                booking.status = 'closed';
            }
            await booking.save();
        }

        res.status(200).json({ message: `Request ${response} successfully`, request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { sendRequest, respondToRequest };
