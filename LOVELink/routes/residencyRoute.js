const express = require('express');
const router = express.Router();

// Residency Landing

router.get('/residency', (req, res) => {
  res.render('pages/residency', {
  styles: `
      <link rel="stylesheet" href="/css/Profile.css">
      <link rel="stylesheet" href="/css/Residency.css">
    `});
});

//Residency Logged In

router.get('/residency-logged-in', (req, res) => {
  res.render('pages/residency-logged-in', {
    title: 'Residency Logged In', 
    activePage: 'Residency', 
    styles: `
      <link rel="stylesheet" href="/css/Profile.css">
      <link rel="stylesheet" href="/css/Residency.css">
    `
  });
});

module.exports = router;

