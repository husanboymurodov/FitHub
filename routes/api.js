const express = require('express');
const router = express.Router();
const Activity = require('../models/activity');
const Reminder = require('../models/reminder');
const FavoriteMeal = require('../models/favoriteMeal');
const DailyIntake = require('../models/dailyIntake');

// Middleware to ensure user is logged in
const requireApiLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

router.use(requireApiLogin);

// --- Activities API ---
router.get('/activities', async (req, res) => {
    try {
        const timeRange = parseInt(req.query.timeRange) || 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - timeRange);

        const activities = await Activity.find({
            user: req.session.user_id,
            datetime: { $gte: startDate }
        }).sort({ datetime: 1 });

        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// --- Reminders API ---
router.get('/reminders', async (req, res) => {
    try {
        const reminders = await Reminder.find({ user: req.session.user_id }).sort({ time: 1 });
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reminders' });
    }
});

router.post('/reminders', async (req, res) => {
    try {
        const reminder = new Reminder({
            ...req.body,
            user: req.session.user_id
        });
        await reminder.save();
        res.json(reminder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save reminder' });
    }
});

router.delete('/reminders/:id', async (req, res) => {
    try {
        await Reminder.findOneAndDelete({ _id: req.params.id, user: req.session.user_id });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete reminder' });
    }
});

// --- Nutrition API (Favorite Meals) ---
router.get('/favorites', async (req, res) => {
    try {
        const favorites = await FavoriteMeal.find({ user: req.session.user_id });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

router.post('/favorites', async (req, res) => {
    try {
        const { mealId, name, image, category } = req.body;
        const favorite = new FavoriteMeal({
            user: req.session.user_id,
            mealId,
            name,
            image,
            category
        });
        await favorite.save();
        res.json(favorite);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save favorite' });
    }
});

router.delete('/favorites/:mealId', async (req, res) => {
    try {
        await FavoriteMeal.findOneAndDelete({ mealId: req.params.mealId, user: req.session.user_id });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete favorite' });
    }
});

// --- Daily Intake API ---
router.get('/intake', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let intake = await DailyIntake.findOne({ 
            user: req.session.user_id,
            date: { $gte: today }
        });
        
        if (!intake) {
            intake = new DailyIntake({ user: req.session.user_id, items: [], totalCalories: 0 });
        }
        res.json(intake);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch intake' });
    }
});

router.post('/intake', async (req, res) => {
    try {
        const { name, calories } = req.body;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let intake = await DailyIntake.findOne({
            user: req.session.user_id,
            date: { $gte: today }
        });

        if (!intake) {
            intake = new DailyIntake({ user: req.session.user_id, items: [], totalCalories: 0 });
        }

        intake.items.push({ name, calories });
        intake.totalCalories += calories;
        await intake.save();
        res.json(intake);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update intake' });
    }
});

router.delete('/intake/:itemId', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let intake = await DailyIntake.findOne({
            user: req.session.user_id,
            date: { $gte: today }
        });

        if (intake) {
            const itemIndex = intake.items.findIndex(item => item._id.toString() === req.params.itemId);
            if (itemIndex > -1) {
                intake.totalCalories -= intake.items[itemIndex].calories;
                intake.items.splice(itemIndex, 1);
                await intake.save();
            }
        }
        res.json(intake);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete intake item' });
    }
});

module.exports = router;
