import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container footer-content">
        <div className="footer-logo">
          <h3>CodeEdu<span className="highlight">AI</span></h3>
          <p>Learn to code with the power of AI</p>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">API</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div className="link-group">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CodeEduAI. All rights reserved.</p>
          <p>Built with Azure AI and GitHub Copilot</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;