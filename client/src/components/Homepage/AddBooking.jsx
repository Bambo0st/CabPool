import React, { useState } from 'react';

const AddBooking = ({ handleBookingCreated }) => {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [availableSeats, setAvailableSeats] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const newBooking = {
            pickupLocation,
            dropoffLocation,
            departureTime: new Date(departureTime),
            arrivalTime: new Date(arrivalTime),
            availableSeats
        };

        if (!pickupLocation || !dropoffLocation || !departureTime || !arrivalTime || !availableSeats) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBooking),
                credentials: 'include',
            });

            if (response.ok) {
                const res = await response.json();
                handleBookingCreated(res.booking, 'success', 'Booking created successfully');
            } else {
                const data = await response.json();
                handleBookingCreated(null, 'fail', data.message);
                setError(data.message || 'Error creating booking');
            }
        } catch (err) {
            setError('Error creating booking. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Add Booking</h2>
            <form onSubmit={handleSubmit}>
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
                        <label className="block text-sm text-gray-600">Departure Time</label>
                        <input
                            type="datetime-local"
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                            value={departureTime}
                            onChange={(e) => setDepartureTime(e.target.value)}
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-sm text-gray-600">Arrival Time</label>
                        <input
                            type="datetime-local"
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                            value={arrivalTime}
                            onChange={(e) => setArrivalTime(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-gray-600">Available Seats</label>
                    <input
                        type="number"
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md"
                        value={availableSeats}
                        onChange={(e) => setAvailableSeats(e.target.value)}
                        placeholder="Enter available seats"
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full py-3 bg-indigo-600 text-white font-semibold rounded-md mt-4 hover:bg-indigo-700 ${loading ? 'bg-indigo-300 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Creating Booking...' : 'Create Booking'}
                </button>
            </form>
        </div>
    );
};

export default AddBooking;
