import React from 'react';
import './Navbar.css';
//import userAvatar from '/Images/user.png';

const Navbar = ({ activePage = 'profile' }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="profile-navbar-icon-wrapper">
          <img className="profile-navbar-icon" src='Images/user.png' alt="Avatar" />
        </div>
        <div className={`navbar-link ${activePage === 'home' ? 'active' : ''}`}>Home</div>
        <div className={`navbar-link ${activePage === 'profile' ? 'active' : ''}`}>Profile</div>
        <div className={`navbar-link ${activePage === 'residency' ? 'active' : ''}`}>Residency</div>
        <div className={`navbar-link ${activePage === 'about' ? 'active' : ''}`}>About</div>
      </div>
      <div className="navbar-link logout">Log Out</div>
    </div>
  );
};

export default Navbar;
