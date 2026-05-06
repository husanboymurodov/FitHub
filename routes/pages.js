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

const Activity = require('../models/activity');

router.get('/dashboard', async (req, res) => {
    if (!req.session.user_id) {
        return res.redirect('/');
    }
    
    try {
        const user = await User.findById(req.session.user_id);
        
        // Fetch today's activities
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const activitiesToday = await Activity.find({
            user: req.session.user_id,
            datetime: { $gte: startOfToday }
        });

        const stats = {
            count: activitiesToday.length,
            calories: activitiesToday.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0)
        };

        res.render('dashboard', { user, stats });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.redirect('/');
    }
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

module.exports = router;
