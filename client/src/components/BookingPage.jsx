import React, { useState, useEffect } from 'react';

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings/user', { credentials: 'include' });
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Bookings</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p>No open bookings available.</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">{booking.pickupLocation} to {booking.dropoffLocation}</h3>
                <p>{booking.startTime}</p>
                <button className="bg-indigo-600 text-white py-2 px-4 rounded-md mt-2">Join Booking</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BookingPage;
