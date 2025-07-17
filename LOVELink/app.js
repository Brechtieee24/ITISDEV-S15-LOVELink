const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const membersDataModule = require('./model/membersController.js');

// Load environment variables
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sessions
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 2 * 60 * 60 * 1000 // 2 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serialize/deserialize user
passport.serializeUser((user, done) => done(null, user.email)); // Save only email
passport.deserializeUser(async (email, done) => {
  try {
    const user = await membersDataModule.getUser(email);
    user.photo = user.photo || '/default.png'; // fallback if needed
    done(null, user);
  } catch (err) {
    done(err);
  }
});


// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const existingUser = await membersDataModule.getUser(email);

    if (!existingUser) return done(null, false); 

    // Store essential user info in session
    req.session.user = {
      _id: existingUser._id,
      name: `${existingUser.firstName} ${existingUser.lastName}`,
      email: existingUser.email,
      photo: profile.photos?.[0]?.value || '/default.png'
    };

    return done(null, existingUser); // Call done properly
  } catch (err) {
    return done(err, false);
  }
}));


// View engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

hbs.registerHelper('eq', (a, b) => a === b);
hbs.registerHelper('concatClass', (baseClass, condition, conditionalClass) =>
  condition ? `${baseClass} ${conditionalClass}` : baseClass
);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/homeRoute'));
app.use('/', require('./routes/landingRoute'));
app.use('/', require('./routes/profileRoute'));
app.use('/', require('./routes/editProfileRoute'));
app.use('/', require('./routes/residencyRoute'));
app.use('/', require('./routes/organizationActivitiesRoute'));
app.use('/', require('./routes/authRoute'));


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// DB Connection
const mongoose = require('mongoose');
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas!");
    console.log("Database name:", mongoose.connection.name);
  })
  .catch(err => {
    console.error("MongoDB Atlas connection error:", err);
  });
