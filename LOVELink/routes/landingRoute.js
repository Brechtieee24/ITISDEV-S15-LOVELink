const express = require('express');
const router = express.Router();

// Redirect root to landing page
router.get('/', (req, res) => {
  res.render('pages/landing', {
    title: 'Landing Page',
    styles: '<link rel="stylesheet" href="/css/landing.css">',
    showNavBar: false 
  });
});

module.exports = router;
