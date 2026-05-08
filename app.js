require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');

// Route definitions
const pageRoutes = require('./routes/pages');
const userRoutes = require('./routes/users');
const activityRoutes = require('./routes/activities');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

// Application configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

// Core middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session management
const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'fithub_dev_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionOptions));

// Route mounting
app.use('/', pageRoutes);
app.use('/', userRoutes);
app.use('/tracker', activityRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    if (req.xhr || req.path.startsWith('/api')) {
        return res.status(err.status || 500).json({
            error: err.message || 'Internal Server Error'
        });
    }
    
    res.status(err.status || 500).send('An unexpected error occurred.');
});

module.exports = app;
