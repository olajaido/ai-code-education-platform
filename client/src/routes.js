import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import the actual components we've created
import ChallengeList from './components/challenges/ChallengeList';
import ChallengeDetail from './components/challenges/ChallengeDetail';
import Profile from './components/user/Profile';
import Login from './components/user/Login';

// Home page component
const HomePage = () => (
  <div className="container">
    <h1>AI-Powered Code Education Platform</h1>
    <p>Learn to code with AI assistance</p>
    <div className="hero-buttons">
      <a href="/challenges" className="btn btn-primary">Browse Challenges</a>
      <a href="/profile" className="btn btn-secondary">My Progress</a>
    </div>
  </div>
);

// Define our routes using the real components
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/challenges" element={<ChallengeList />} />
      <Route path="/challenge/:id" element={<ChallengeDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;