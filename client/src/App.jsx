import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import SignInPage from './components/SignInPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import BookingPage from './components/BookingPage.jsx';
// import DashboardPage from './components/DashboardPage.jsx'; 
import Navbar from './components/Navbar.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Group all private routes inside a PrivateRoute wrapper */}
          <Route element={<PrivateRoute />}>
            <Route path="/bookings" element={<BookingPage />} />
            {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
