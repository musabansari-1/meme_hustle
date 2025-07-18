import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

function LeaderboardPage() {
  console.log('LeaderboardPage rendered.');
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/leaderboard?top=10`); // Adjust this based on your API service structure
        setMemes(response.data);
      } catch (err) {
        setError('Failed to fetch leaderboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleBackToExplore = () => {
    navigate('/home'); // Assuming '/explore' is your explore page route
  };

  return (
    <div className="min-h-screen bg-black text-white font-orbitron px-4 md:px-10 py-8 relative overflow-hidden">
      {/* Animated Noise Background */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none animate-noise bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZmlsdGVlciBpZD0ibm9pc2UiPgo8ZmVUcmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjciIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJub0NvbW1vbkRhdGEiLz4KPC9maWx0ZXI+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkwIiBvcGFjaXR5PSIxIi8+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkwIiBvcGFjaXR5PSIxIi8+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkwIiBvcGFjaXR5PSIxIi8+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkwIiBvcGFjaXR5PSIxIi8+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkwIiBvcGFjaXR5PSIxIi8+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkwIiBvcGFjaXR5PSIxIi8+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkwIiBvcGFjaXR5PSIxIi8+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkwIiBvcGFjaXR5PSIxIi8+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkwIiBvcGFjaXR5PSIxIi8+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkwIiBvcGFjaXR5PSIxIi8+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkwIiBvcGFjaXR5PSIxIi8+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkwIiBvcGFjaXR5PSIxIi8+Cjwvc3ZnPg==\')]\" style={{ backgroundSize: '100px 100px' }}></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-mono font-bold text-pink-500 whitespace-nowrap overflow-hidden border-r-4 border-neon-green animate-typing mx-auto w-fit mb-12">
          🏆 Top 10 Memes
        </h1>

        {loading && (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neon-purple"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 text-lg">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {memes.length === 0 ? (
              <div className="text-center text-gray-400 text-lg">No memes on the leaderboard yet.</div>
            ) : (
              memes.map((meme, index) => (
                <div
                  key={meme.id}
                  className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center space-x-4 border-2 border-neon-green transform transition duration-300 hover:scale-105 relative overflow-hidden"
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-neon-pink opacity-0 animate-glitch-overlay-btn"></span>
                  <div className="text-3xl font-bold font-tech text-neon-yellow w-12 text-center relative z-10">
                    #{index + 1}
                  </div>
                  <img
                    src={meme.image_url}
                    alt={meme.title}
                    className="w-24 h-24 object-cover rounded-md border border-neon-blue relative z-10"
                  />
                  <div className="flex-1 relative z-10">
                    <h2 className="text-2xl font-semibold font-orbitron text-neon-pink drop-shadow-neon-sm">
                      {meme.title}
                    </h2>
                    <p className="text-gray-300 text-sm">
                      Owner: {meme.owner_id || 'Unknown User'}
                    </p>
                  </div>
                  <div className="text-right relative z-10">
                    <p className="text-3xl font-bold font-tech text-neon-purple">
                      {meme.upvotes}
                    </p>
                    <p className="text-gray-400 text-sm">Upvotes</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={handleBackToExplore}
            className="mt-6 ml-4 px-6 py-2 bg-neon-green text-white font-bold rounded-lg shadow-neon-green-glow hover:shadow-neon-pink-glow animate-flicker-slow transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
          >
            <span className="relative z-10">Back to Explore</span>
            <span className="absolute top-0 left-0 w-full h-full bg-neon-pink opacity-0 animate-glitch-overlay-btn"></span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
