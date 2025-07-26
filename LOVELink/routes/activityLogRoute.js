const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const membersDataModule = require('../model/membersController.js');
const residencyDataModule = require('../model/residencyHoursController.js');
const participationDataModule = require('../model/activityParticipationsController.js');

// Residency Landing
router.get('/log-activity', async (req, res) =>  {
  const successMessage = req.session.successMessage || null;
  const errorMessage = req.session.errorMessage || null;
  delete req.session.successMessage;

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
    successMessage,
    errorMessage,
    styles: `
      <link rel="stylesheet" href="/css/Profile.css">
      <link rel="stylesheet" href="/css/Residency.css">
    `
  });
});


// QR Related Routes
// Store each unique QR scan in session
router.post('/store-qr', (req, res) => {
  const { data } = req.body;

  if (!req.session.scannedQRs) {
    req.session.scannedQRs = [];
  }

  if (!req.session.scannedQRs.includes(data)) {
    req.session.scannedQRs.push(data);
  }

  res.sendStatus(200);
});

// Submit the activity and scanned participants
router.post('/log-activity-input', async (req, res) => {
  const { eid } = req.body;
  const scannedData = req.session.scannedQRs || [];

  console.log("Event ID:", eid);
  console.log("Scanned Participants:", scannedData);

    if (scannedData.length === 0) {
      req.session.errorMessage = "No participants were scanned. Please scan at least one QR code.";
      return res.redirect('/log-activity');
    }


  for (const memberId of scannedData) {
    try {
      await participationDataModule.addEventParticipation(memberId, eid);
    } catch (err) {
      console.error(`Error adding participation for ${memberId}:`, err);
    }
  }

  // Clear the session data after submission (optional, but recommended)
  req.session.scannedQRs = [];
  req.session.successMessage = "Activity and participants successfully logged!";

  // Redirect
  res.redirect('/log-activity');
});

module.exports = router;

