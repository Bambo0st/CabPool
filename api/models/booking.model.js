// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    rideDate: { type: Date, required: true },
    availableSeats: { type: Number, required: true },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Passengers who have joined this booking
    status: { type: String, enum: ['open', 'closed'], default: 'open' },  // Whether the booking is still open for more passengers
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }  // User who created the booking
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;