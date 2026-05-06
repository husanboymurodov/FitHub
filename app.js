require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');

// Import Routes
const pageRoutes = require('./routes/pages');
const userRoutes = require('./routes/users');
const activityRoutes = require('./routes/activities');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

// MongoDB connection
const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitHub';
const seedDemoAccounts = require('./seed');

mongoose.connect(dbUrl)
    .then(async () => {
        if (process.env.NODE_ENV !== 'test') {
            console.log('Connected to MongoDB');
        }
        await seedDemoAccounts();
    })
    .catch((error) => console.error('Error connecting to MongoDB:', error.message));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Add this for API requests
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
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

module.exports = app;
