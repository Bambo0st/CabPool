import React, { useState } from 'react';

const Bookings = ({ bookings, updateBookingSeats }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const openModal = (bookingId) => {
        setSelectedBookingId(bookingId);
        setError('');
        setSuccess('');
        setIsModalOpen(true);
    };

    const handleConfirmJoin = async () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            const response = await fetch('/api/bookings/join', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: selectedBookingId }),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                updateBookingSeats(selectedBookingId);
                setSuccess(data.message || 'Successfully joined the booking.');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to join the booking.');
            }
        } catch (err) {
            setError('An error occurred while joining the booking. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Bookings</h2>
            {bookings.length > 0 ? (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking._id} className="mb-6 p-4 border-b border-gray-300">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col w-4/5">
                                    <span className="font-semibold text-lg">
                                        {booking.pickupLocation} to {booking.dropoffLocation}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {new Date(booking.departureTime).toLocaleString()}
                                    </span>
                                    {booking.availableSeats !== 0 ? (
                                        <p className="text-xl text-green-600 mt-2">
                                            {booking.availableSeats} available seats
                                        </p>
                                    ) : (
                                        <p className="text-xl text-red-600 mt-2">
                                            {booking.availableSeats} available seats
                                        </p>
                                    )}
                                    <div className="text-sm text-gray-600 mt-2">
                                        <p className="font-semibold">Created by:</p>
                                        <p className="text-gray-600">
                                            {booking.createdBy.name} ({booking.createdBy.email})
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="mt-2 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    onClick={() => openModal(booking._id)}
                                >
                                    Join Booking
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-red-500 text-center mt-4">No bookings available</p>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Are you sure you want to join this booking?</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {success && <p className="text-green-500 mb-4">{success}</p>}
                        <div className="flex justify-end gap-4">
                            {!success && (
                                <>
                                    <button
                                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-white rounded-md ${isLoading
                                                ? 'bg-indigo-300 cursor-not-allowed'
                                                : 'bg-indigo-600 hover:bg-indigo-700'
                                            }`}
                                        onClick={handleConfirmJoin}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Joining...' : 'Yes, Join'}
                                    </button>
                                </>
                            )}
                            {success && (
                                <button
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
