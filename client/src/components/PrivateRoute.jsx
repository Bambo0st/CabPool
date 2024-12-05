import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Use Outlet to render child routes
import { useUserContext } from '../context/UserContext'; // Access user context

const PrivateRoute = () => {
    const { user } = useUserContext(); // Access user data from context

    // If the user is not logged in, redirect to the SignInPage
    if (!user) {
        return <Navigate to="/signin" />;
    }

    // If user is logged in, render child routes (e.g., BookingPage, DashboardPage)
    return <Outlet />;
};

export default PrivateRoute;
