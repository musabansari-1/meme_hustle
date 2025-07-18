import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExplorePage from './pages/ExplorePage';
import AuthPage from './pages/AuthPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import LeaderboardPage from './pages/LeaderboardPage';
import './index.css'; // Ensure Tailwind CSS is imported

function App() {
  return (
    <Router>
      <UserProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/home" element={
              <PrivateRoute>
                <ExplorePage />
              </PrivateRoute>
            } />
            <Route path="/leaderboard" element={
              <PrivateRoute>
                <LeaderboardPage />
              </PrivateRoute>
            } />
          </Routes>
        </AuthProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
