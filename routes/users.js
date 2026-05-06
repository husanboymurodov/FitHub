const express = require('express');
const router = express.Router();
const User = require('../models/user');

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
};

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        req.session.user_id = user._id;
        res.redirect('/dashboard');
    } catch (err) {
        if (err.code === 11000) {
            res.render('register', { error: 'Email already registered. Please use a different email.' });
        } else {
            console.error('Registration error:', err);
            res.render('register', { error: 'An error occurred during registration. Please try again.' });
        }
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const foundUser = await User.findAndValidate(email, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/tracker');
    } else {
        res.render('login', { error: 'Invalid email or password.' });
    }
});

router.post('/login-guest', async (req, res) => {
    try {
        const guestUser = await User.findOne({ email: 'guest@fithub.app' });
        if (guestUser) {
            req.session.user_id = guestUser._id;
            res.redirect('/tracker');
        } else {
            // Create guest user if it doesn't exist
            const newGuest = new User({
                name: 'Guest User',
                email: 'guest@fithub.app',
                password: 'guestpassword123'
            });
            await newGuest.save();
            req.session.user_id = newGuest._id;
            res.redirect('/tracker');
        }
    } catch (error) {
        res.render('login', { error: 'Error logging in as guest.' });
    }
});

router.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/');
});

router.get('/profile', requireLogin, async (req, res) => {
    const user = await User.findById(req.session.user_id);
    res.render('profile', { user });
});

router.post('/profile', requireLogin, async (req, res) => {
    try {
        const { name, email, age, weight, height, gender } = req.body;
        const user = await User.findByIdAndUpdate(
            req.session.user_id,
            { name, email, age, weight, height, gender },
            { new: true, runValidators: true }
        );
        res.render('profile', { user, profileMessage: 'Profile updated successfully!' });
    } catch (err) {
        let profileError = 'An error occurred while updating your profile.';
        if (err.code === 11000) {
            profileError = 'Email already registered. Please use a different email.';
        }
        const user = await User.findById(req.session.user_id);
        res.render('profile', { user, profileError });
    }
});

router.get('/profile/data', requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.session.user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const { age, weight, height, gender } = user;
        res.json({ age, weight, height, gender });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch profile data" });
    }
});

router.post('/change-password', requireLogin, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.session.user_id);
        const isMatch = await user.constructor.findAndValidate(user.email, currentPassword);
        if (!isMatch) {
            return res.render('profile', { user, passwordError: 'Current password is incorrect.' });
        }
        user.password = newPassword;
        await user.save();
        res.render('profile', { user, passwordMessage: 'Password changed successfully!' });
    } catch (err) {
        const user = await User.findById(req.session.user_id);
        res.render('profile', { user, passwordError: 'An error occurred while changing your password.' });
    }
});

router.post('/delete-account', requireLogin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.session.user_id);
        req.session.user_id = null;
        res.redirect('/');
    } catch (err) {
        const user = await User.findById(req.session.user_id);
        res.render('profile', { user, error: 'Failed to delete account.' });
    }
});

module.exports = router;
