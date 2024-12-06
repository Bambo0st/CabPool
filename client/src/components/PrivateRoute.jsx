import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const PrivateRoute = () => {
    const { user } = useUserContext();

    if (!user) {
        return <Navigate to="/signin" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
