import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useUser } from './UserContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setUserProfile } = useUser();

  useEffect(() => {
    const handleAuthChange = async (session) => {
      if (session) {
        setUser(session.user);
        try {
          const response = await axios.post(
            `${BASE_URL}/api/users/ensure`,
            {},
            {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            }
          );
          setUserProfile(response.data);
          // Removed automatic navigation to /home to allow users to stay on their intended route after authentication
          // navigate('/home');
        } catch (error) {
          console.error('Error ensuring user profile:', error);
          await supabase.auth.signOut();
          setUser(null);
          setUserProfile(null);
          navigate('/');
        }
      } else {
        setUser(null);
        setUserProfile(null);
        navigate('/');
      }
      setLoading(false);
    };

    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      handleAuthChange(session);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          handleAuthChange(session);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe(); // ✅ FIXED
    };
  }, [navigate, setUserProfile]);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
    return { data, error };
  };

  const signInWithPassword = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
    setUser(null);
    setUserProfile(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signInWithPassword, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
