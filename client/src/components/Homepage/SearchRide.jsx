/* eslint-disable react/prop-types */
import React, { useState } from 'react';

const SearchRide = ({ handleSearch, error }) => {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Ensure that all inputs have been filled before calling the search function
        if (!pickupLocation || !dropoffLocation || !startTime || !endTime) {
            return;
        }
        handleSearch(pickupLocation, dropoffLocation, startTime, endTime);
    };

    return (
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Search for a Cab</h2>
            <form onSubmit={handleFormSubmit}>
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
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md mt-4 hover:bg-indigo-700 focus:outline-none"
                >
                    Search
                </button>

                {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
        </div>
    );
};

export default SearchRide;
