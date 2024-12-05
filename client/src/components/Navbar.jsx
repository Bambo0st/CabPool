import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-indigo-600 p-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <Link to="/" className="text-white text-xl font-semibold">CabPool</Link>
                <div>
                    <Link to="/signin" className="text-white px-4 py-2">Sign In</Link>
                    <Link to="/signup" className="text-white px-4 py-2">Sign Up</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
