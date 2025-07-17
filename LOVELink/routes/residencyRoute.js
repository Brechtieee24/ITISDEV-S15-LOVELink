const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const membersDataModule = require('../model/membersController.js');
const residencyDataModule = require('../model/residencyHoursController.js');

// Residency Landing

router.get('/residency', async (req, res) =>  {
  
  const email = "albrecht_abad@dlsu.edu.ph"; // update to user session
  const userData = await membersDataModule.getUser(email);
  const qrDataUrl = await QRCode.toDataURL(userData._id.toString()); // qr code generator
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


  res.render('pages/residency', {
  firstName: userData?.firstName,
  lastName: userData?.lastName,
  committee: userData?.committee,
  latestTimeIn: formattedTimeIn,
  latestTimeOut: formattedTimeOut,
  duration: durationString,
  qrCode: qrDataUrl,
  styles: `
      <link rel="stylesheet" href="/css/Profile.css">
      <link rel="stylesheet" href="/css/Residency.css">
    `});
});

//Residency Logged In
// include session for temporary storage of time in
router.get('/residency-logged-in', async (req, res) => {
  
  const email = "albrecht_abad@dlsu.edu.ph"; // update to user session
  const userData = await membersDataModule.getUser(email);
  const qrDataUrl = await QRCode.toDataURL(userData._id.toString()); // qr code generator


  res.render('pages/residency-logged-in', {
    title: 'Residency Logged In', 
    activePage: 'Residency',
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    committee: userData?.committee,
    qrCode: qrDataUrl, 
    showNavBar: true,
    styles: `
      <link rel="stylesheet" href="/css/Profile.css">
      <link rel="stylesheet" href="/css/Residency.css">
    `
  });
});

module.exports = router;

