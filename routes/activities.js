const express = require('express');
const router = express.Router();
const Activity = require('../models/activity');
const { requireLogin } = require('../middleware/auth');

const activityTypeMap = {
    1: "Running",
    2: "Walking",
    3: "Hiking",
    4: "Swimming",
    5: "Cycling",
    6: "Weightlifting",
    7: "Deadlifts",
    8: "Kettlebell Swings",
    9: "Bicep Curls",
    10: "Tricep Dips",
    11: "Push-ups",
    12: "Pull-ups",
    13: "Squats",
    14: "Lunges",
    15: "Planks",
    16: "Sit-ups",
    17: "Mountain Climbers",
    18: "Burpees",
    19: "Leg Raises",
    20: "Glute Bridges",
    other: "Other"
};

// Middleware to parse activity data
router.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.duration = {
            hours: Number(req.body.hours) || 0,
            minutes: Number(req.body.minutes) || 0,
            seconds: Number(req.body.seconds) || 0
        };

        if (req.body.weight || req.body.weightUnit) {
            req.body.weightUsed = {
                weight: Number(req.body.weight),
                unit: req.body.weightUnit
            };
        }

        req.body.reps = Object.keys(req.body)
            .filter(k => k.startsWith('reps'))
            .map(k => Number(req.body[k]))
            .filter(n => !isNaN(n));
    }
    next();
});

router.get('/', requireLogin, async (req, res) => {
    try {
        let activities = await Activity.find({ user: req.session.user_id }).sort({ datetime: -1 });

        activities = activities.map(activity => {
            const activityCopy = activity.toObject();
            activityCopy.activityTypeLabel = activityTypeMap[activity.activityType] || "Unknown";
            return activityCopy;
        });

        res.render('tracker', { activities });
    } catch (err) {
        console.error("Error loading activities:", err);
        res.render('tracker', { activities: [] });
    }
});

router.post('/', requireLogin, async (req, res) => {
    try {
        const newActivity = new Activity({
            ...req.body,
            user: req.session.user_id
        });
        await newActivity.save();
        res.redirect('/tracker');
    } catch (error) {
        console.error("Error saving activity:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/:id', requireLogin, async (req, res) => {
    try {
        await Activity.findByIdAndDelete(req.params.id);
        res.redirect('/tracker');
    } catch (err) {
        console.error('Error deleting activity:', err);
        res.status(500).send('Server Error');
    }
});

router.get('/api/data', requireLogin, async (req, res) => {
    try {
        const timeRange = parseInt(req.query.timeRange) || 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - timeRange);

        const activities = await Activity.find({
            user: req.session.user_id,
            datetime: { $gte: startDate }
        }).sort({ datetime: 1 });

        const processedActivities = activities.map(activity => {
            const activityObj = activity.toObject();
            activityObj.activityTypeLabel = activityTypeMap[activity.activityType] || "Unknown";
            return activityObj;
        });

        res.json(processedActivities);
    } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json({ error: "Failed to fetch activities" });
    }
});

module.exports = router;
