import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthForms = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup

  const { signUp, signInWithPassword, signOut, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (isLogin) {
      // Login
      const { error } = await signInWithPassword(email, password);
      if (error) {
        setMessage(`Login failed: ${error.message}`);
      } else {
        // Success message handled by AuthContext redirect
      }
    } else {
      // Signup
      const { error } = await signUp(email, password);
      if (error) {
        setMessage(`Signup failed: ${error.message}`);
      } else {
        setMessage('Check your email for the verification link!');
        setEmail('');
        setPassword('');
        setIsLogin(true); // Switch to login form after successful signup
      }
    }
  };

  return (
    <div className="bg-black p-8 rounded-xl border-2 border-neon-purple shadow-[0_0_20px_#00f0ff] max-w-md mx-auto my-10 animate-fade-in">
      <h2 className="text-3xl text-neon-purple font-orbitron text-neon-pink text-center mb-6 animate-pulse">
        {isLogin ? 'Log In' : 'Sign Up'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-neon-blue text-sm font-bold mb-1">Email</label>
          <input
            type="email"
            id="email"
            className="w-full p-3 rounded bg-zinc-900 border border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-pink text-white font-mono placeholder-zinc-500 transition-all duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-neon-blue text-sm font-bold mb-1">Password</label>
          <input
            type="password"
            id="password"
            className="w-full p-3 rounded bg-zinc-900 border border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-pink text-white font-mono placeholder-zinc-500 transition-all duration-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {message && (
          <p className={`text-center font-mono ${message.includes('failed') ? 'text-red-500' : 'text-neon-green'} animate-flicker`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-lg shadow-[0_0_15px_#FF00FF,0_0_30px_#00FFFF] hover:scale-105 animate-pulse transition-all duration-300"
        >
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <p className="text-center text-neon-purple text-sm mt-6">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage(''); // Clear message on form switch
            setEmail('');
            setPassword('');
          }}
          className="text-neon-green cursor-pointer hover:underline animate-flicker-slow"
        >
          {isLogin ? 'Sign Up' : 'Log In'}
        </span>
      </p>

      {user && (
        <div className="text-center mt-8">
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
      )}
    </div>
  );
};

export default AuthForms; 