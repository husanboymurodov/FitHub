const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Activity = require('../models/activity');

// Middleware to check if user is logged in AND is an admin
const requireAdmin = async (req, res, next) => {
    if (!req.session.user_id) {
        if (req.xhr || req.path.startsWith('/api') || req.path.startsWith('/stats') || req.path.startsWith('/users')) {
            return res.status(401).json({ error: "Unauthorized. Please login." });
        }
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(req.session.user_id);
        if (user && user.isAdmin) {
            next();
        } else {
            if (req.xhr || req.path.startsWith('/api') || req.path.startsWith('/stats') || req.path.startsWith('/users')) {
                return res.status(403).json({ error: "Access denied. Admins only." });
            }
            return res.redirect('/dashboard');
        }
    } catch (error) {
        res.status(500).json({ error: "Server error during admin check." });
    }
};

// --- Visual Admin Dashboard ---
router.get('/', requireAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.session.user_id);
        
        const userCount = await User.countDocuments();
        const activityCount = await Activity.countDocuments();
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentUsers = await User.find({ createdAt: { $gte: sevenDaysAgo } }).countDocuments();

        const allUsers = await User.find({}, '-password').sort({ createdAt: -1 });

        const stats = {
            totalUsers: userCount,
            totalActivities: activityCount,
            newUsersThisWeek: recentUsers
        };

        res.render('admin', { user, stats, usersList: allUsers });
    } catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).send("Server Error");
    }
});

// --- Admin Dashboard Data ---
router.get('/stats', requireAdmin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const activityCount = await Activity.countDocuments();
        
        // Get registration growth (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentUsers = await User.find({ createdAt: { $gte: sevenDaysAgo } }).countDocuments();

        res.json({
            totalUsers: userCount,
            totalActivities: activityCount,
            newUsersThisWeek: recentUsers
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch system stats." });
    }
});

// --- User Management ---
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const allUsers = await User.find({}, '-password'); // Exclude passwords for security
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user list." });
    }
});

// --- Seed/Setup: Promote a user to Admin (For development use) ---
// This is a utility route to help you set up your first admin.
router.post('/make-admin', requireAdmin, async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOneAndUpdate({ email }, { isAdmin: true }, { new: true });
        if (!user) return res.status(404).json({ error: "User not found." });
        res.json({ message: `${user.name} is now an admin.` });
    } catch (error) {
        res.status(500).json({ error: "Promotion failed." });
    }
});

module.exports = router;
