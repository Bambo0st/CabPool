import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchRide from './Homepage/SearchRide';
import Bookings from './Homepage/Bookings';
import AddBooking from './Homepage/AddBooking';

const Homepage = () => {
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('search');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [createdBooking, setCreatedBooking] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async (pickupLocation, dropoffLocation, startTime, endTime) => {
        setError('');
        setSuccess('');
        setBookings([]);

        const queryParams = new URLSearchParams({
            startTime: startTime,
            endTime: endTime,
            pickupLocation: pickupLocation,
            dropoffLocation: dropoffLocation,
        });

        try {
            const response = await fetch(`/api/bookings/filter?${queryParams}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || 'No bookings found for the selected criteria.');
                return;
            }

            const data = await response.json();
            setBookings(data);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Error fetching bookings. Please try again later.');
        }
    };

    const handleJoinBooking = (bookingId) => {
        navigate(`/bookings/join/${bookingId}`);
    };

    const handleBookingCreated = (booking, status, message = '') => {
        if (status === 'success') {
            setSuccess(message);
            setCreatedBooking(booking);
        } else {
            setError(message);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError(''); 
        setSuccess(''); 
        setCreatedBooking(null);  
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-indigo-600 text-white p-6 text-center">
                <h1 className="text-4xl font-extrabold">Welcome to CabPool</h1>
                <p className="mt-2 text-lg">Find rides and share with others</p>
            </div>

            <div className="container mx-auto p-6 space-y-6">
                <div className="flex justify-start space-x-6 border-b-2 border-gray-300">
                    <button
                        className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => handleTabChange('search')}
                    >
                        Search for a Cab
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
                        onClick={() => handleTabChange('add')}
                    >
                        Add Booking
                    </button>
                </div>

                {activeTab === 'search' && (
                    <div className="flex gap-12">
                        <SearchRide handleSearch={handleSearch} />
                        <Bookings bookings={bookings} handleJoinBooking={handleJoinBooking} />
                    </div>
                )}

                {activeTab === 'add' && (
                    <div className="flex gap-12">
                        <AddBooking handleBookingCreated={handleBookingCreated} />
                        <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
                            {!error && (
                                <div className="text-green-500">
                                    <p>{success}</p>
                                    {createdBooking && (
                                        <>
                                            <p className="mt-2 font-semibold">Booking Details:</p>
                                            <p>Pickup: {createdBooking.pickupLocation}</p>
                                            <p>Dropoff: {createdBooking.dropoffLocation}</p>
                                            <p>Departure Time: {new Date(createdBooking.departureTime).toLocaleString()}</p>
                                            <p>Arrival Time: {new Date(createdBooking.arrivalTime).toLocaleString()}</p>
                                            <p>Available Seats: {createdBooking.availableSeats}</p>
                                        </>
                                    )}
                                </div>
                            )}
                            {error && <div className="text-red-500">{error}</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Homepage;
