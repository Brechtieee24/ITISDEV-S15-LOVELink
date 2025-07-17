const express = require('express');
const passport = require('passport');
const router = express.Router();

// Redirect to Google for authentication
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback from Google
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/not-found',
    successRedirect: '/home'
  })
);

// email not found in the database
router.get('/not-found', (req, res) => {
  res.status(404).render('pages/not-found', {
    title: 'Not Found',
    showNavBar: false,
    styles: '/css/not-found.css'
  });
});

// logout function
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(err => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.redirect('/home'); // fallback if session can't be destroyed
      }
      res.clearCookie('connect.sid'); // clears the session cookie
      res.redirect('/');
    });
  });
});

// middlewares/auth.js
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = { ensureAuthenticated };


module.exports = router;
