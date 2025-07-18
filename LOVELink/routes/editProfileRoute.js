const express = require('express');
const router = express.Router();
const membersDataModule = require('../model/membersController.js');

// edit profile of user 
router.get('/edit-profile', async (req, res) => {
  
  const email = req.session.user.email; // update to user session
  const userData = await membersDataModule.getUser(email);

  console.log("Looking for email:", email);
  console.log(req.session.user.photo);
  
  res.render('pages/edit-profile', {
    title: 'Edit Profile',
    activePage: 'profile',
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    committee: userData?.committee,
    aboutInfo: userData?.aboutInfo,
    photo: req.session.user.photo,
    showNavBar: true,
    styles: '<link rel="stylesheet" href="/css/Profile.css">'
  });
});

// save updated bio 
router.post('/save-profile', async (req, res) => {
  try {
    const email = req.session.user.email; // get user from session
    const { aboutInfo } = req.body; // di pa naguupdate as of now

    console.log("BIO", aboutInfo);

    // Update in DB
    await membersDataModule.updateAboutInfo(email, aboutInfo);

    res.redirect('/profile'); // Redirect back to profile after saving
  } catch (err) {
    console.error('Error saving profile bio:', err);
    res.status(500).send('Failed to save bio');
  }
});


module.exports = router;
