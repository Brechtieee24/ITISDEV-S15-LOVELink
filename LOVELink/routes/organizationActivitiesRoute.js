const express = require('express');
const router = express.Router();

router.get('/organization-activities', (req, res) => {
  res.render('pages/view-organization-activities', {
    title: 'Organization Activities',
    styles: '<link rel="stylesheet" href="/css/Activities.css">'
  });
});


module.exports = router;
