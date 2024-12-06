import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import SignOutButton from './SignOutButton';

const Header = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  return (
    <header className="bg-indigo-600 p-4 text-white">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-semibold">CabPool</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span>{user?.name[0]}</span>
              </div>
              <Link to="/profile" className="text-white">Profile</Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link to="/signin" className="text-white">Sign In</Link>
              <Link to="/signup" className="text-white">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
