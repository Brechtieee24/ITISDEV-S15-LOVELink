const express = require('express');
const router = express.Router();
const membersDataModule = require('../model/membersController.js');
const activitiesDataModule = require('../model/activityParticipationsController');
const residencyDataModule = require('../model/residencyHoursController');

// GET /profile
router.get('/profile/', async (req, res) => {

  const email = "albrecht_abad@dlsu.edu.ph"; // update to user session
  const userData = await membersDataModule.getUser(email);
  const userActivities = await activitiesDataModule.getEventsOfUser(userData?._id || "6867bf48e8c956da7989a9c2"); // hardcoded yung id
 
  console.log("Looking for email:", email);

  res.render('pages/profile', {
    title: 'Profile',
    activePage: 'profile',
    styles: '<link rel="stylesheet" href="/css/Profile.css">',
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    committee: userData?.committee,
    aboutInfo: userData?.aboutInfo,
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
  res.render('pages/others-profile', {styles: '<link rel="stylesheet" href="/css/Profile.css">'}); 
});

module.exports = router;
