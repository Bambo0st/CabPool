// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // Store hashed password directly
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]  // References to bookings made by the user
});

const User = mongoose.model('User', userSchema);
export default User;