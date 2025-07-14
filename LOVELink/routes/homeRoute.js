const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => {
  res.render('pages/home', {
    title: 'Home',
    styles: '<link rel="stylesheet" href="/css/home.css">',
  });
}); 


module.exports = router;
