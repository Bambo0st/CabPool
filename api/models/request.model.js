// models/Request.js
import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // User who is sending the request
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // User who is receiving the request (ride creator)
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },  // The booking this request is related to
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },  // Status of the request
    createdAt: { type: Date, default: Date.now }  // Timestamp of when the request was created
});

const Request = mongoose.model('Request', requestSchema);
export default Request;