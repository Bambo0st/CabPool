import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState('');
    const [selectedTrip, setSelectedTrip] = useState(null); // Selected trip for modal
    const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserTrips = async () => {
            try {
                const response = await fetch('/api/bookings/user', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    const data = await response.json();
                    setError(data.message || 'Error fetching trips.');
                    return;
                }

                const data = await response.json();
                setTrips(data);
            } catch (err) {
                setError('Error fetching trips. Please try again later.');
            }
        };

        fetchUserTrips();
    }, []);

    const handleLeaveTrip = async (bookingId) => {
        try {
            const response = await fetch(`/api/bookings/join`, {
                method: 'PATCH',
                body: JSON.stringify({ bookingId }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setTrips(trips.filter(trip => trip._id !== bookingId));
            } else {
                const data = await response.json();
                setError(data.message || 'Error leaving the trip');
            }
        } catch (err) {
            setError('Error leaving the trip. Please try again later.');
        }
    };

    const openModal = (trip) => {
        setSelectedTrip(trip);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTrip(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-indigo-600 text-white p-6 text-center">
                <h1 className="text-4xl font-extrabold">My Trips</h1>
                <p className="mt-2 text-lg">View all your trips and manage your bookings</p>
            </div>

            <div className="container mx-auto p-6">
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.length > 0 ? (
                        trips.map((trip) => (
                            <div key={trip._id} className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    {trip.pickupLocation} to {trip.dropoffLocation}
                                </h3>
                                <p className="text-sm text-gray-600">Departure: {new Date(trip.departureTime).toLocaleString()}</p>
                                <p className="text-sm text-gray-600">Arrival: {new Date(trip.arrivalTime).toLocaleString()}</p>
                                <p className="text-sm text-gray-600">Available Seats: {trip.availableSeats}</p>
                                <div className="mt-4 flex justify-between">
                                    <button
                                        onClick={() => openModal(trip)}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        View Details
                                    </button>
                                    {trip.passengers.includes(trip.createdBy._id) && (
                                        <button
                                            onClick={() => handleLeaveTrip(trip._id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        >
                                            Leave Trip
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center col-span-full">
                            <p>No trips found</p>
                        </div>
                    )}
                </div>

                {/* Modal for trip details */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Trip Details</h3>
                            <p className="text-sm text-gray-600">Pickup: {selectedTrip.pickupLocation}</p>
                            <p className="text-sm text-gray-600">Dropoff: {selectedTrip.dropoffLocation}</p>
                            <p className="text-sm text-gray-600">Departure Time: {new Date(selectedTrip.departureTime).toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Arrival Time: {new Date(selectedTrip.arrivalTime).toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Available Seats: {selectedTrip.availableSeats}</p>

                            <h4 className="text-lg font-semibold mt-4">Passengers:</h4>
                            <ul>
                                {selectedTrip.passengers.length > 0 ? (
                                    selectedTrip.passengers.map((passenger) => (
                                        <li key={passenger._id} className="text-sm text-gray-600">
                                            {passenger.name} ({passenger.email})
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-600">No passengers joined yet.</p>
                                )}
                            </ul>

                            <div className="mt-4 flex justify-between">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTrips;
