const express = require('express');
const router = express.Router();
const membersDataModule = require('../model/membersController.js');
const activitiesDataModule = require('../model/activityParticipationsController');
const residencyDataModule = require('../model/residencyHoursController');

// GET /profile
router.get('/profile/', async (req, res) => {
   if (!req.isAuthenticated()) return res.redirect('/');

  const email = req.session.user.email; // update to user session
  const userData = await membersDataModule.getUser(email);
  const userActivities = await activitiesDataModule.getEventsOfUser(userData?._id); 
 
  console.log("Looking for email:", email);
  console.log(req.session.user.photo);

  res.render('pages/profile', {
    title: 'Profile',
    activePage: 'profile',
    styles: '<link rel="stylesheet" href="/css/Profile.css">',
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    committee: userData?.committee,
    aboutInfo: userData?.aboutInfo,
    photo: req.session.user.photo,
    showNavBar: true,
    residency: {
      may: '8 hours and 10 Minutes',
      june: '8 hours and 10 Minutes',
      july: '8 hours and 10 Minutes'
    },
    activities: userActivities
  });
});

// Other profile page
router.get('/others-profile', async (req, res) => {
   if (!req.isAuthenticated()) return res.redirect('/');
   
  res.render('pages/others-profile', {styles: '<link rel="stylesheet" href="/css/Profile.css">'}); 
});

module.exports = router;
