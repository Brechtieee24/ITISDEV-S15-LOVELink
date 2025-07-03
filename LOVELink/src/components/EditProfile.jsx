import React from 'react';
import Navbar from './Navbar';
import './Profile.css';
import userAvatar from '/Images/user.png';

const EditProfile = () => {
  return (
    <div className="profile-container">
      <Navbar activePage="profile" />

      {/* Avatar and Name/Bio Section */}
      <div className="user-info-section">
        <div className="user-avatar-wrapper">
          <img className="user-avatar" src={userAvatar} alt="User" />
        </div>
        <div>
          <div className="profile-name">
            Jules Dela Cruz <span className="italic">(MAE)</span>
          </div>
          <textarea
            className="bio-textarea"
            defaultValue="Hi! My name is Jules."
          />
        </div>
      </div>

      {/* Bottom Content: Confirm Button, Residency & Activities */}
      <div className="info-sections-wrapper">
        <div className="left-column">
          {/* Confirm Button */}
          <div className="confirm-btn-wrapper">
            <div className="confirm-btn-text">Confirm Bio</div>
          </div>

          {/* Residency Hours */}
          <div className="residency-container">
            <div className="residency-label-wrapper">
              <div className="residency-label-text">Residency Hours</div>
            </div>
            <div className="residency-section">
              <div className="residency-month may">
                <span>May:</span> <span>8 hours and 10 Minutes</span>
              </div>
              <div className="residency-month june">
                <span>June:</span> <span>8 hours and 10 Minutes</span>
              </div>
              <div className="residency-month july">
                <span>July:</span> <span>8 hours and 10 Minutes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="right-column">
          {/* List of Activities */}
          <div className="activities-container">
            <div className="activities-label-wrapper">
              <div className="activities-label-text">List of Activities</div>
            </div>
            <div className="activities-section">
              <div className="activities-header">
                <div className="activities-title">Title</div>
                <div className="activities-date">Date</div>
              </div>
              <div className="activity-entries">
                <div className="activity-entry">
                  <span>Community Outreach</span>
                  <span>July 2, 2025</span>
                </div>
                <div className="activity-entry">
                  <span>Seminar</span>
                  <span>July 9, 2025</span>
                </div>
                <div className="activity-entry">
                  <span>Seminar</span>
                  <span>July 12, 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
