import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected to MongoDB")).catch((err) => console.log("Error connecting to MongoDB:", err));

const app = express();

app.use(express.json());
app.use(cookieParser()); //this for storing jwt token 


const PORT = process.env.PORT || 3000;

// Middleware

// Routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: err.status,
        error: errorMessage
    });
});

app.listen(PORT, () => {
    console.log("Server listening on port 3000");
})

export default app;