const express = require('express');
const router = express.Router();

router.get('/edit-profile', (req, res) => {
  res.render('pages/edit-profile', {
    title: 'Edit Profile',
    activePage: 'profile',
    showNavBar: true,
    styles: '<link rel="stylesheet" href="/css/Profile.css">'
  });
});

module.exports = router;
