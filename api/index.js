import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import requestRoutes from './routes/request.routes.js';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); //this for storing jwt token 

// Routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/requests', requestRoutes);

// Connect to MongoDB
const PORT = process.env.PORT || 3000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => console.log(err));
