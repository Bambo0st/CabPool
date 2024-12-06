import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // Import UserProvider
import SignInPage from './components/SignInPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
// import ProfilePage from './components/ProfilePage.jsx';
import Homepage from './components/homepage.jsx';
import MyTrips from './components/MyTrips.jsx';
import Header from './components/Header.jsx';
import PrivateRoute from './components/PrivateRoute.jsx'; // PrivateRoute component

const App = () => {
  return (
    <UserProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route element={<PrivateRoute />}>
          { }
          {/* <Route path="/bookings" element={<BookingPage />} /> */}
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
          <Route path="/my-trips" element={<MyTrips />} />
        </Route>
      </Routes>
    </UserProvider>
  );
};

export default App;
