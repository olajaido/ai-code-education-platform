import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <h1>CodeEdu<span className="highlight">AI</span></h1>
        </Link>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/challenges">Challenges</Link></li>
            <li><Link to="/profile">My Progress</Link></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <button className="btn-login">Login</button>
        </div>
      </div>
    </header>
  );
};

export default Header;