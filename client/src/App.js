import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ChallengeList from './components/challenges/ChallengeList';
import ChallengeDetail from './components/challenges/ChallengeDetail';
import Profile from './components/user/Profile';
import Login from './components/user/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <div className="container">
                <h1>AI-Powered Code Education Platform</h1>
                <p>Learn to code with AI assistance</p>
                <div className="hero-buttons">
                  <a href="/challenges" className="btn btn-primary">Browse Challenges</a>
                  <a href="/profile" className="btn btn-secondary">My Progress</a>
                </div>
              </div>
            } />
            <Route path="/challenges" element={<ChallengeList />} />
            <Route path="/challenge/:id" element={<ChallengeDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;