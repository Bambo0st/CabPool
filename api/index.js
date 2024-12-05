import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import cookieParser from 'cookie-parser';
console.log('Current working directory:', process.cwd());

dotenv.config();
console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected to MongoDB"));

const app = express();

app.use(express.json());
app.use(cookieParser()); //this for storing jwt token 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server listening on port 3000");
})

// Middleware

// Routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

