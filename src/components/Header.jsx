import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logoutUser } from '../store/slices/authSlice';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/auth');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <h1 className="brand-name">Hackathod</h1>
        </div>

        {user ? (
          // Authenticated user - show menu
          <nav className="header-nav">
            <button
              className="mobile-menu-btn"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
            </button>

            <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
              <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={() => {
                    closeMenu();
                    // Add about page navigation here
                    console.log('About clicked');
                  }}
                >
                  About
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={() => {
                    closeMenu();
                    // Add pricing page navigation here
                    console.log('Pricing clicked');
                  }}
                >
                  Pricing
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link logout-btn"
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        ) : (
          // Unauthenticated user - show only brand name
          <div className="header-auth">
            <span className="auth-text">Welcome</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
