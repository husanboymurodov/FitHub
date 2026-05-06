require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');

// Import Routes
const pageRoutes = require('./routes/pages');
const userRoutes = require('./routes/users');
const activityRoutes = require('./routes/activities');

// MongoDB connection
const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitHub';
mongoose.connect(dbUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error.message));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
};
app.use(session(sessionOptions));

// Use Routes
app.use('/', pageRoutes);
app.use('/', userRoutes);
app.use('/tracker', activityRoutes);

app.listen(port, () => {
    console.log(`Server has started and App is listening on port ${port}`);
});
