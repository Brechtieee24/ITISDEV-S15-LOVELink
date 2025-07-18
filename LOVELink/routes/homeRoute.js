const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');

  const user = req.user || {};
  const photo = req.session.user.photo || '/default.png';

  console.log("User:", user);

  res.render('pages/home', {
    title: 'Home',
    styles: '<link rel="stylesheet" href="/css/home.css">',
    photo: photo
  });
}); 

module.exports = router;
