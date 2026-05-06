const express = require('express');
const router = express.Router();
const User = require('../models/user');

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
};

router.get('/', (req, res) => {
    if (req.session && req.session.user_id) {
        res.redirect('/dashboard');
    } else {
        res.render('index');
    }
});

router.get('/dashboard', async (req, res) => {
    if (!req.session.user_id) {
        return res.redirect('/');
    }
    const user = await User.findById(req.session.user_id);
    res.render('dashboard', { user });
});

router.get('/progress', requireLogin, (req, res) => {
    res.render('progress');
});

router.get('/nutrition', requireLogin, (req, res) => {
    res.render('nutrition');
});

router.get('/reminders', requireLogin, (req, res) => {
    res.render('reminders');
});

router.get('/tracker', requireLogin, (req, res) => {
    // This will be handled in activities route but keeping the render here if needed
    // Actually, tracker logic is in index.js for now, will move to activity routes.
    res.redirect('/activities'); 
});

module.exports = router;
