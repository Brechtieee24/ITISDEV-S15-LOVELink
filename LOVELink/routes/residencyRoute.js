const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const membersDataModule = require('../model/membersController.js');
const residencyDataModule = require('../model/residencyHoursController.js');
const activitiesDataModule = require('../model/activityParticipationsController');

// Residency Landing
router.get('/residency', async (req, res) =>  {
  if (!req.session.user) return res.redirect('/');

  if (req.session.timeIn) {
    return res.redirect('/residency-logged-in');
  }

  const email = req.session.user.email;
  const userData = await membersDataModule.getUser(email);
  const qrDataUrl = await QRCode.toDataURL(userData._id.toString());
  const latestResidency = await residencyDataModule.getLatestMemberResidency(userData?._id);

  let formattedTimeIn = 'N/A';
  let formattedTimeOut = 'N/A';
  let durationString = 'N/A';

  if (latestResidency && latestResidency.timeIn && latestResidency.timeOut) {
    const timeIn = new Date(latestResidency.timeIn);
    const timeOut = new Date(latestResidency.timeOut);

    formattedTimeIn = timeIn.toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    formattedTimeOut = timeOut.toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const diffMs = timeOut - timeIn;
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    durationString = `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  res.render('pages/residency', {
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    committee: userData?.committee,
    latestTimeIn: formattedTimeIn,
    latestTimeOut: formattedTimeOut,
    duration: durationString,
    photo: req.session.user.photo,
    qrCode: qrDataUrl,
    styles: `
      <link rel="stylesheet" href="/css/Profile.css">
      <link rel="stylesheet" href="/css/Residency.css">
    `
  });
});


//Residency Logged In
// include session for temporary storage of time in
router.get('/residency-logged-in', async (req, res) => {
  
  if (!req.session.user) return res.redirect('/');
  const email = req.session.user.email; // update to user session
  const userData = await membersDataModule.getUser(email);
  const qrDataUrl = await QRCode.toDataURL(userData._id.toString()); // qr code generator
  
  const timeIn = new Date();

  if (req.session.timeIn == null) {
    req.session.timeIn = timeIn;
  }


  const formattedTimeIn = new Date(req.session.timeIn).toLocaleString('en-PH', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});

  res.render('pages/residency-logged-in', {
    title: 'Residency Logged In', 
    activePage: 'Residency',
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    committee: userData?.committee,
    qrCode: qrDataUrl, 
    photo: req.session.user.photo,
    timeIn: formattedTimeIn,
    showNavBar: true,
    styles: `
      <link rel="stylesheet" href="/css/Profile.css">
      <link rel="stylesheet" href="/css/Residency.css">
    `
  });
});

// log out route
router.get('/residency-logged-out', async (req, res) => {
  
  if (!req.session.user) return res.redirect('/');
  const email = req.session.user.email; // update to user session
  const userData = await membersDataModule.getUser(email);
  const qrDataUrl = await QRCode.toDataURL(userData._id.toString()); // qr code generator
  

  const residencyValue = await residencyDataModule.createNewResidency(req.session.timeIn, new Date(), userData._id)
  console.log(residencyValue);

  const latestResidency = await residencyDataModule.getLatestMemberResidency(userData?._id); 
  const formattedTimeIn = new Date(latestResidency.timeIn).toLocaleString('en-PH', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});

  const formattedTimeOut = new Date(latestResidency.timeOut).toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // Calculate duration
  const timeIn = new Date(latestResidency.timeIn);
  const timeOut = new Date(latestResidency.timeOut);

  const diffMs = timeOut - timeIn;
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const durationString = `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;

  await membersDataModule.addTotalActivityTime(email, diffMs); 
  await membersDataModule.formatTotalActivityTime(email);

  delete req.session.timeIn; // clear upon save

  res.render('pages/residency', {
  firstName: userData?.firstName,
  lastName: userData?.lastName,
  committee: userData?.committee,
  latestTimeIn: formattedTimeIn,
  latestTimeOut: formattedTimeOut,
  photo: req.session.user.photo,
  duration: durationString,
  qrCode: qrDataUrl,
  styles: `
      <link rel="stylesheet" href="/css/Profile.css">
      <link rel="stylesheet" href="/css/Residency.css">
    `});
});

// residency history table
router.get('/api/residency-history', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const email = req.session.user.email;
    const userData = await membersDataModule.getUser(email);
    const residencyRecords = await residencyDataModule.getMemberResidency(userData._id);

    const formattedRecords = residencyRecords.map(record => {
    const timeIn = new Date(record.timeIn);
    const timeOut = new Date(record.timeOut);
    const durationMs = timeOut - timeIn;

    const totalSeconds = Math.floor(durationMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      date: timeIn.toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' }),
      timeIn: timeIn.toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Manila'
      }),
      timeOut: timeOut.toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Manila'
      }),
      total: `${hours} hrs ${minutes} mins ${seconds} secs`
    };
  });

    res.json(formattedRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// activity history table
router.get('/api/activity-history', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const email = req.session.user.email;
    const userData = await membersDataModule.getUser(email);
    const activityRecords = await activitiesDataModule.getEventsOfUser(userData?._id);

    res.json(activityRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

