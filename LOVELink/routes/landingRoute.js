const express = require('express');
const router = express.Router();

router.get('/landing', (req, res) => {
  res.render('pages/landing', {
    title: 'Landing Page',
    styles: '<link rel="stylesheet" href="/css/landing.css">',
    hideNavbar: true // not sure kung bakit hindi nagana pero dapat walang navbar sa landing page
  });
});


module.exports = router;
