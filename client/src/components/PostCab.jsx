import React, { useState } from 'react';

const PostCab = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availableSeats, setAvailableSeats] = useState(1);

  const handlePost = () => {
    console.log({ pickupLocation, dropoffLocation, startTime, endTime, availableSeats });
    // Send the data to the backend (use fetch or axios)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Post a Cab</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-sm text-gray-600">Pickup Location</label>
            <input
              type="text"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md"
              placeholder="Enter pickup location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600">Dropoff Location</label>
            <input
              type="text"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md"
              placeholder="Enter dropoff location"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600">Start Time</label>
            <input
              type="datetime-local"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600">End Time</label>
            <input
              type="datetime-local"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600">Available Seats</label>
            <input
              type="number"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(e.target.value)}
              min="1"
            />
          </div>

          <button
            onClick={handlePost}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md mt-4"
          >
            Post Cab
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostCab;
