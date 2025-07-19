const express = require('express');
const router = express.Router();
const membersDataModule = require('../model/membersController.js');

router.get('/home', async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');

  const email = req.session.user.email;
  const userData = await membersDataModule.getUser(email);
  const photo = req.session.user.photo || '/default.png';

  console.log("User:", userData);

  res.render('pages/home', {
    title: 'Home',
    styles: '<link rel="stylesheet" href="/css/home.css">',
    photo: photo,
    user: userData
  });
}); 

module.exports = router;
