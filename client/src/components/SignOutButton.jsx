import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const SignOutButton = () => {
    const [showModal, setShowModal] = useState(false);
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/users/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setUser(null);
                navigate('/');
            } else {
                console.error('Logout failed');
            }
        } catch (err) {
            console.error('Error occurred during logout:', err);
        }
    };

    return (
        <div>
            <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition duration-200"
            >
                Logout
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
                        <div className="flex justify-center items-center mb-6">
                            <h3 className="text-xl font-semibold text-black">Are you sure you want to sign out?</h3>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-200"
                            >
                                No
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignOutButton;
