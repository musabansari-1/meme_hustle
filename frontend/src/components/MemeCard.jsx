import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { BASE_URL } from '../utils/constants';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

const socket = io(BASE_URL);

const MemeCard = ({ meme: initialMeme }) => {
  const [meme, setMeme] = useState(initialMeme);
  const [userVote, setUserVote] = useState(null); // 'up' or 'down'
  const [isBidding, setIsBidding] = useState(false); // New state for bid submission loading
  const { userProfile } = useUser();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (userProfile) {
      // Check if the current user has already voted on this meme
      const existingVote = userProfile.votes?.find(vote => vote.meme_id === meme.id);
      if (existingVote) {
        setUserVote(existingVote.type);
      }
    }
  }, [userProfile, meme.id]);

  useEffect(() => {
    socket.on('bidUpdate', (updatedBid) => {
      if (updatedBid.meme_id === meme.id) {
        setMeme(prevMeme => ({ ...prevMeme, highestBid: updatedBid.newHighestBid, highestBidder: updatedBid.newHighestBidder }));
      }
    });

    return () => {
      socket.off('bidUpdate');
    };
  }, [meme.id]);

  // Ensure local state `meme` is updated if `initialMeme` changes from parent (ExplorePage)
  useEffect(() => {
    setMeme(initialMeme);
  }, [initialMeme]);

  const handleVote = async (type) => {
    if (!userProfile) {
      alert('Please log in to vote.');
      return;
    }
    // Allow changing vote from up to down or vice-versa, but not re-voting same type
    if (userVote === type) {
      alert(`You have already ${type}voted this meme.`);
      return;
    }

    const originalUserVote = userVote; // Store original user vote for potential revert
    const originalUpvotes = meme.upvotes;

    let newUpvotes = originalUpvotes;
    if (type === 'up') {
      newUpvotes = originalUpvotes + (userVote === 'down' ? 2 : 1); // If changing from down, add 2
    } else { // type === 'down'
      newUpvotes = originalUpvotes - (userVote === 'up' ? 2 : 1); // If changing from up, subtract 2
    }

    // Optimistic UI update
    setMeme(prevMeme => ({ ...prevMeme, upvotes: newUpvotes }));
    setUserVote(type);

    try {
      await axios.post(`${BASE_URL}/api/vote`, {
        meme_id: meme.id,
        user_id: userProfile.id,
        type,
      });
    } catch (error) {
      console.error('Error submitting vote:', error);
      // Revert UI on error
      setMeme(prevMeme => ({ ...prevMeme, upvotes: originalUpvotes }));
      setUserVote(originalUserVote);
      alert('Failed to cast vote. Please try again.');
    }
  };

  const handleBid = async () => {
    if (!user) {
      alert('Please log in to place a bid.');
      return;
    }

    if (authLoading) {
      alert('Authentication in progress, please wait.');
      return;
    }

    const creditsInput = prompt("Enter your bid amount (credits):");
    if (creditsInput === null || creditsInput.trim() === '') {
      return; // User cancelled or entered empty string
    }

    const credits = parseFloat(creditsInput);
    if (isNaN(credits) || credits <= 0) {
      alert('Please enter a valid positive number for your bid.');
      return;
    }

    if (credits <= (meme.highestBid || 0)) {
        alert(`Your bid must be higher than the current highest bid of ${meme.highestBid || 0} credits.`);
        return;
    }

    setIsBidding(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/bid`, {
        meme_id: meme.id,
        user_id: userProfile.id,
        credits: credits,
      });

      console.log('response', response);

      if (response.status === 201) {
        // Assuming backend sends back the new highest bid and bidder
        setMeme(prevMeme => ({ 
            ...prevMeme, 
            highestBid: response.data.newHighestBid || credits, 
            highestBidder: response.data.highestBidder || userProfile.id // Update with actual bidder info
        }));
        alert('Bid placed successfully!');
        // Optional: Emit real-time update if not handled by backend already publishing to 'bidUpdate'
        // socket.emit('newBid', { meme_id: meme.id, newHighestBid: credits, newHighestBidder: userProfile.id });
      } else {
        alert('Failed to place bid. Please try again.');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      alert(`Error placing bid: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsBidding(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-black via-zinc-900 to-black border-2 border-neon-blue rounded-xl shadow-[0_0_20px_#00f0ff] hover:shadow-[0_0_30px_#ff00ff] transition-all duration-300 transform hover:scale-[1.03] group overflow-hidden pb-4">

      {/* Glitchy Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none animate-glitch-overlay z-0 opacity-5" />

      {/* Image at the very top, no gap */}
      <img
        src={meme.image_url}
        alt={meme.title}
        className="w-full h-48 object-cover border-neon-purple"
      />

      {/* Title */}
      <h2 className="relative z-10 text-xl font-tech uppercase tracking-wide text-neon-pink mt-2 mb-1 text-center">
        <span className="glitch-text" data-text={meme.title}>{meme.title}</span>
      </h2>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-1 z-10 relative justify-center px-2">
        {meme.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-0.5 bg-neon-blue text-white text-xs font-mono rounded-full shadow-glow animate-flicker"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* AI Caption */}
      <p className="text-neon-purple text-sm font-mono mb-0.5 whitespace-nowrap overflow-hidden animate-terminal-type border-l-2 border-neon-pink pl-2 mx-2">
        {meme.ai_caption}
      </p>

      {/* Vibe */}
      <p className="text-neon-pink text-xs font-mono mb-2 italic text-center">Vibe: {meme.ai_vibe}</p>

      {/* Upvotes & Bid Info */}
      <div className="flex items-center justify-between px-3 mb-2">
        <div className="flex gap-1">
          <button
            onClick={() => handleVote('up')}
            disabled={userVote === 'up'}
            className={`px-3 py-1.5 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition ${userVote === 'up' ? 'opacity-50 cursor-not-allowed' : ''} ${meme.upvotes !== initialMeme.upvotes ? 'animate-flicker-short' : ''}`}
          >
            ↑ Upvote {meme.upvotes}
          </button>
          <button
            onClick={() => handleVote('down')}
            disabled={userVote === 'down'}
            className={`px-3 py-1.5 bg-red-500 text-black font-bold rounded-full hover:bg-red-800 transition ${userVote === 'down' ? 'opacity-50 cursor-not-allowed' : ''} ${meme.upvotes !== initialMeme.upvotes ? 'animate-flicker-short' : ''}`}
          >
            ↓ Downvote
          </button>
        </div>
        <p className="text-neon-gold font-bold text-sm animate-pulse tracking-wide">
          💰 {meme.highestBid || 0} credits
        </p>
      </div>

      {/* Bid Now Button */}
      <button
        onClick={handleBid}
        disabled={isBidding}
        className={`w-[90%] mx-auto block py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-black font-bold rounded-lg shadow-lg hover:shadow-pink-500/50 animate-flicker-slow transition-all duration-300 ${isBidding ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isBidding ? 'Bidding...' : '⚡ Bid Now'}
      </button>
    </div>
  );
};

export default MemeCard;

