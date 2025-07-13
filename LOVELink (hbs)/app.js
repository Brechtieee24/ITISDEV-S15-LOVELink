const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
