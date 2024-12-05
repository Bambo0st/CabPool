// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    startTime: { type: Date, required: true },  // Start of the pickup time window
    endTime: { type: Date, required: true },    // End of the pickup time window
    availableSeats: { type: Number, required: true, min: 1 },    
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Passengers who have joined this booking
    status: { type: String, enum: ['open', 'closed'], default: 'open' },  // Whether the booking is still open for more passengers
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }  // User who created the booking
});


const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;