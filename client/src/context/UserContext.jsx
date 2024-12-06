/* eslint-disable react/prop-types */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Make a request to `/api/users/me` to check if the user is authenticated
        const checkUserLoggedIn = async () => {
            const response = await fetch('/api/users/me', {
                method: 'GET',
                credentials: 'include', // This will send the `httpOnly` cookies along with the request
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        };

        checkUserLoggedIn();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
