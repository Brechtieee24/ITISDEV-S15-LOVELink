const express = require('express');
const router = express.Router();

// Redirect root to profile
router.get('/', (req, res) => {
  res.redirect('/profile');
});

// GET /profile
router.get('/profile', (req, res) => {
  res.render('pages/profile', {
    title: 'Profile',
    activePage: 'profile',
    styles: '<link rel="stylesheet" href="/css/Profile.css">',
    user: {
      name: 'Jules Dela Cruz',
      nickname: 'MAE',
      bio: 'Hi! My name is Jules.'
    },
    residency: {
      may: '8 hours and 10 Minutes',
      june: '8 hours and 10 Minutes',
      july: '8 hours and 10 Minutes'
    },
    activities: [
      { title: 'Community Outreach', date: 'July 2, 2025' },
      { title: 'Seminar', date: 'July 9, 2025' }
    ]
  });
});

// Other profile page
router.get('/others-profile', (req, res) => {
  res.render('pages/others-profile', {styles: '<link rel="stylesheet" href="/css/Profile.css">'}); 
});

module.exports = router;
