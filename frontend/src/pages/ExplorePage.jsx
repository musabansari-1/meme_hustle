import React, { useEffect, useState } from 'react';
import { getMemes } from '../services/api';
import MemeCard from '../components/MemeCard';
import CreateMemeForm from '../components/CreateMemeForm';
import io from 'socket.io-client';
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useRef } from 'react'; // Import useRef

const socket = io(BASE_URL);

const ExplorePage = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // State for profile menu visibility
  const navigate = useNavigate();
  const { user, signOut } = useAuth(); // Destructure user and signOut from useAuth
  const profileMenuRef = useRef(); // Ref for detecting clicks outside the profile menu

  useEffect(() => {
    const fetchMemes = async () => {
      setLoading(true);
      const data = await getMemes();
      setMemes(data);
      setLoading(false);
    };
    fetchMemes();

    socket.on('voteUpdate', (updatedVote) => {
      console.log('📡 Global vote update received:', updatedVote);
      setMemes(prevMemes =>
        prevMemes.map(meme =>
          meme.id === updatedVote.meme_id
            ? { ...meme, upvotes: updatedVote.newUpvoteCount }
            : meme
        )
      );
    });

    // Close profile menu when clicking outside
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      socket.off('voteUpdate');
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    setShowProfileMenu(false);
  };

  const handleProfileClick = () => {
    // Navigate to profile page (assuming '/profile' route exists)
    // You might want to create a dedicated profile page later
    navigate('/profile');
    setShowProfileMenu(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-orbitron px-4 md:px-10 py-8 relative overflow-hidden">
      {/* Noise background */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none animate-noise bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZmlsdGVlciBpZD0ibm9pc2UiPgo8ZmVUcmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjciIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJub0NvbW1vbkRhdGEiLz4KPC9maWx0ZXI+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkwIiBvcGFjaXR5PSIxIi8+Cjwvc3ZnPg==\')]\" style={{ backgroundSize: '100px 100px' }}></div>

      {/* Heading and Buttons */}
      <div className="relative z-10 text-center mb-6">
        <h1 className="mb-4 text-2xl md:text-3xl lg:text-4xl font-mono font-bold text-pink-500 whitespace-nowrap overflow-hidden border-r-4 border-neon-green animate-typing mx-auto w-fit">
          🔥 Explore the Meme Multiverse
        </h1>
        <div className="mt-4 flex justify-center items-center gap-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-8 py-2 bg-neon-blue text-black font-bold rounded-lg shadow-neon-blue-glow hover:shadow-neon-pink-glow animate-flicker-slow transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
          >
            <span className="relative z-10">{showCreateForm ? 'View Memes' : 'Create New Meme'}</span>
            <span className="absolute top-0 left-0 w-full h-full bg-neon-pink opacity-0 animate-glitch-overlay-btn"></span>
          </button>

          <button
            onClick={() => {
              console.log('Navigating to leaderboard...');
              navigate('/leaderboard');
            }}
            className="mt-0 ml-4 px-6 py-2 bg-neon-green text-white font-bold rounded-lg shadow-neon-green-glow hover:shadow-neon-pink-glow animate-flicker-slow transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
          >
            <span className="relative z-10">View Leaderboard</span>
            <span className="absolute top-0 left-0 w-full h-full bg-neon-pink opacity-0 animate-glitch-overlay-btn"></span>
          </button>

          {/* Profile Icon and Dropdown */}
          {user && ( // Only show if user is logged in
            <div className="fixed top-8 right-8 ml-4 z-[100]" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2 rounded-full bg-gray-800 text-neon-blue hover:text-neon-pink focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-opacity-75 transition duration-300"
                aria-expanded={showProfileMenu ? "true" : "false"}
                aria-haspopup="true"
              >
                {/* Simple SVG for a user icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-[100] border-2 border-neon-green">
                  <div className="block px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                    Signed in as: <span className="font-bold text-neon-pink">{user.email || 'User'}</span>
                  </div>
                  <a
                    href="#"
                    onClick={handleProfileClick}
                    className="block px-4 py-2 text-sm text-neon-blue hover:bg-gray-700 hover:text-neon-yellow transition duration-200"
                  >
                    Profile
                  </a>
                  <a
                    href="#"
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-neon-red hover:bg-gray-700 hover:text-red-500 transition duration-200"
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showCreateForm ? (
        <CreateMemeForm />
      ) : (
        loading ? (
          <div className="relative z-10 flex justify-center items-center min-h-[300px]">
            <p className="text-[#00FFFF] text-xl font-mono animate-terminal-type border-l-4 border-neon-green pl-4">
              Loading dank memes...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 relative z-10">
            {memes.map((meme) => (
              <MemeCard key={meme.id} meme={meme} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default ExplorePage;
