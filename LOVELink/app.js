const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

// DB Related
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
require('dotenv').config(); // Loads variables from .env
const DB_URI = process.env.DB_URI;

// Session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true, // Save new sessions
    cookie: { 
        secure: false,
        maxAge: 2 * 60 * 60 * 1000 // 2 hours in milliseconds
     } 
}));

// Set view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Register partials
hbs.registerPartials(path.join(__dirname, 'views/partials'));

hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

hbs.registerHelper('concatClass', function(baseClass, condition, conditionalClass) {
  return condition ? `${baseClass} ${conditionalClass}` : baseClass;
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const profileRoute = require('./routes/profileRoute');
app.use('/', profileRoute);

const editProfileRoute = require('./routes/editProfileRoute');
app.use('/', editProfileRoute);

const residencyRoute = require('./routes/residencyRoute');
app.use('/', residencyRoute);

const activitiesRoute = require('./routes/organizationActivitiesRoute');
app.use('/', activitiesRoute);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas!");
    console.log("Database name:", mongoose.connection.name);
  })
  .catch(err => {
    console.error("MongoDB Atlas connection error:", err);
  });