import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = async () => {
        setError('');

        const queryParams = new URLSearchParams({
            startTimeWindow: startTime,
            endTimeWindow: endTime,
        });

        if (pickupLocation) queryParams.append('pickupLocation', pickupLocation);
        if (dropoffLocation) queryParams.append('dropoffLocation', dropoffLocation);

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
            setError('Error fetching bookings. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-indigo-600 text-white p-4 text-center">
                <h1 className="text-3xl font-bold">Welcome to CabPool</h1>
                <p className="mt-2">Find rides and share with others</p>
            </div>

            <div className="container mx-auto p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Search for a Cab</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600">Pickup Location</label>
                        <input
                            type="text"
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            placeholder="Enter pickup location"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-gray-600">Dropoff Location</label>
                        <input
                            type="text"
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                            value={dropoffLocation}
                            onChange={(e) => setDropoffLocation(e.target.value)}
                            placeholder="Enter dropoff location"
                        />
                    </div>

                    <div className="mb-4 flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-600">Start Time</label>
                            <input
                                type="datetime-local"
                                className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-600">End Time</label>
                            <input
                                type="datetime-local"
                                className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSearch}
                        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md mt-4 hover:bg-indigo-700 focus:outline-none"
                    >
                        Search
                    </button>

                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </form>

                <div className="mt-8">
                    {bookings.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Bookings</h2>
                            <ul>
                                {bookings.map((booking) => (
                                    <li key={booking._id} className="mb-4 p-4 border-b border-gray-300">
                                        <div className="flex justify-between">
                                            <span className="font-semibold">
                                                {booking.pickupLocation} to {booking.dropoffLocation}
                                            </span>
                                            <span>{new Date(booking.startTime).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">{booking.availableSeats} available seats</p>
                                        <button
                                            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                            onClick={() => navigate(`/bookings/${booking._id}`)}
                                        >
                                            View Details
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Homepage;
