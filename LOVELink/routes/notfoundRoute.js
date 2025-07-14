const express = require('express');
const router = express.Router();

router.get('/not-found', (req, res) => {
  res.status(404).render('not-found', {
    title: 'Not Found',
    styles: '/css/not-found.css'
  });
});

module.exports = router;
