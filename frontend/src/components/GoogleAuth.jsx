import React from 'react';
import { useAuth } from '../context/AuthContext';

const GoogleAuth = () => {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {user ? (
        <div className="text-center">
          <p className="text-neon-blue text-xl font-orbitron mb-4 animate-pulse">
            Welcome, {user.email}
          </p>
          <button
            onClick={signOut}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-black font-bold rounded-lg px-6 py-3 shadow-lg hover:shadow-pink-500/50 animate-flicker-slow transition-all duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-lg px-6 py-3 shadow-[0_0_15px_#FF00FF,0_0_30px_#00FFFF] hover:scale-105 animate-pulse transition-all duration-300"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default GoogleAuth; 