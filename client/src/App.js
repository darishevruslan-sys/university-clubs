import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
import CreateClub from './pages/CreateClub';
import EditClub from './pages/EditClub';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClubsProvider } from './context/ClubsContext';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/profile" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/profile" /> : <Register />}
          />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/clubs/:id" element={<ClubDetail />} />
          <Route
            path="/create-club"
            element={user ? <CreateClub /> : <Navigate to="/login" />}
          />
          <Route
            path="/clubs/:id/edit"
            element={user ? <EditClub /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ClubsProvider>
        <AppContent />
      </ClubsProvider>
    </AuthProvider>
  );
}

export default App;
