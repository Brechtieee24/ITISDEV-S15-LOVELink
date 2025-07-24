const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const membersDataModule = require('../model/membersController.js');
const residencyDataModule = require('../model/residencyHoursController.js');

// Residency Landing
router.get('/log-activity', async (req, res) =>  {
  if (!req.session.user) return res.redirect('/');

  if (req.session.timeIn) {
    return res.redirect('/residency-logged-in');
  }

  const email = req.session.user.email;
  const userData = await membersDataModule.getUser(email);
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

    req.session.scannedParticipants = []; // clear qr data

  res.render('pages/log-activity', {
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    committee: userData?.committee,
    latestTimeIn: formattedTimeIn,
    latestTimeOut: formattedTimeOut,
    duration: durationString,
    photo: req.session.user.photo,
    styles: `
      <link rel="stylesheet" href="/css/Profile.css">
      <link rel="stylesheet" href="/css/Residency.css">
    `
  });
});

router.post('/store-qr', (req, res) => {
  const { data } = req.body;
  if (!req.session.scannedQRs) req.session.scannedQRs = [];
  if (!req.session.scannedQRs.includes(data)) {
    req.session.scannedQRs.push(data);
  }
  res.sendStatus(200);
});


router.post('/log-activity-input', (req, res) => {
  const { ename, date } = req.body;
  const scannedData = req.session.scannedParticipants || [];

  console.log("Activity:", ename);
  console.log("Date:", date);
  console.log("Scanned Participants:", scannedData);

  res.send('Activity successfully logged!');
});


module.exports = router;

