import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthForms from '../components/AuthForms';
import { Navigate } from 'react-router-dom';

const AuthPage = () => {
  const { user, loading } = useAuth();

  // If user is already logged in and not loading, redirect to home
  // Removed redirection to allow authenticated users to access other protected routes directly
  // if (!loading && user) {
  //   return <Navigate to="/home" />;
  // }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Animated Noise Background */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none animate-noise bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZmlsdGVlciBpZD0ibm9pc2UiPgo8ZmVUcmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlZW5jeT0iMC43IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ibm9Db21tb25EYXRhIi8+CjwvZmlsdGVyPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgmajpub2lzZSkwIiBvcGFjaXR5PSIxIi8+Cjwvc3ZnPg==')]" style={{ backgroundSize: '100px 100px' }}></div>

      <AuthForms />
    </div>
  );
};

export default AuthPage;
 