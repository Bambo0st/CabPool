import React from 'react';

const Bookings = ({ bookings, handleJoinBooking }) => {
    return (
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Bookings</h2>
            <ul>
                {bookings.map((booking) => (
                    <li key={booking._id} className="mb-6 p-4 border-b border-gray-300">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col w-4/5">
                                <span className="font-semibold text-lg">
                                    {booking.pickupLocation} to {booking.dropoffLocation}
                                </span>
                                <span className="text-sm text-gray-600">{new Date(booking.departureTime).toLocaleString()}</span>
                                <p className="text-xl text-green-600 mt-2">{booking.availableSeats} available seats</p>
                                <div className="text-sm text-gray-600 mt-2">
                                    <p className="font-semibold">Created by:</p>
                                    <p className="text-gray-600">{booking.createdBy.name} ({booking.createdBy.email})</p>
                                </div>
                            </div>
                            <button
                                className="mt-2 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                onClick={() => handleJoinBooking(booking._id)}
                            >
                                Join Booking
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Bookings;
