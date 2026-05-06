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
        console.error('Fetch reminders error:', error);
        res.status(500).json({ error: 'Failed to retrieve your reminders.' });
    }
});

router.post('/reminders', async (req, res) => {
    try {
        const { text, time, category } = req.body;
        
        if (!text || !time) {
            return res.status(400).json({ error: 'Reminder text and time are required.' });
        }

        const reminder = new Reminder({
            ...req.body,
            user: req.session.user_id
        });
        await reminder.save();
        res.status(201).json(reminder);
    } catch (error) {
        console.error('Save reminder error:', error);
        res.status(500).json({ error: 'Failed to save the reminder. Please try again.' });
    }
});

router.delete('/reminders/:id', async (req, res) => {
    try {
        const result = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.session.user_id });
        if (!result) {
            return res.status(404).json({ error: 'Reminder not found or unauthorized.' });
        }
        res.json({ success: true, message: 'Reminder deleted successfully.' });
    } catch (error) {
        console.error('Delete reminder error:', error);
        res.status(500).json({ error: 'Failed to delete the reminder.' });
    }
});

// --- Nutrition API (Favorite Meals) ---
router.get('/favorites', async (req, res) => {
    try {
        const favorites = await FavoriteMeal.find({ user: req.session.user_id });
        res.json(favorites);
    } catch (error) {
        console.error('Fetch favorites error:', error);
        res.status(500).json({ error: 'Failed to fetch your favorite meals.' });
    }
});

router.post('/favorites', async (req, res) => {
    try {
        const { mealId, name, image, category } = req.body;
        
        if (!mealId || !name) {
            return res.status(400).json({ error: 'Meal ID and Name are required to save a favorite.' });
        }

        // Prevent duplicate favorites
        const existing = await FavoriteMeal.findOne({ user: req.session.user_id, mealId });
        if (existing) {
            return res.status(409).json({ error: 'Meal is already in your favorites.' });
        }

        const favorite = new FavoriteMeal({
            user: req.session.user_id,
            mealId,
            name,
            image,
            category
        });
        await favorite.save();
        res.status(201).json(favorite);
    } catch (error) {
        console.error('Save favorite error:', error);
        res.status(500).json({ error: 'Failed to save the favorite meal.' });
    }
});

router.delete('/favorites/:mealId', async (req, res) => {
    try {
        const result = await FavoriteMeal.findOneAndDelete({ mealId: req.params.mealId, user: req.session.user_id });
        if (!result) {
            return res.status(404).json({ error: 'Favorite meal not found.' });
        }
        res.json({ success: true, message: 'Favorite removed.' });
    } catch (error) {
        console.error('Delete favorite error:', error);
        res.status(500).json({ error: 'Failed to remove the favorite meal.' });
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
        console.error('Fetch intake error:', error);
        res.status(500).json({ error: 'Failed to fetch your daily intake.' });
    }
});

router.post('/intake', async (req, res) => {
    try {
        const { name, calories } = req.body;
        
        if (!name || calories === undefined || calories < 0) {
            return res.status(400).json({ error: 'Valid name and non-negative calories are required.' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let intake = await DailyIntake.findOne({
            user: req.session.user_id,
            date: { $gte: today }
        });

        if (!intake) {
            intake = new DailyIntake({ user: req.session.user_id, items: [], totalCalories: 0 });
        }

        intake.items.push({ name, calories: Number(calories) });
        intake.totalCalories += Number(calories);
        await intake.save();
        res.status(201).json(intake);
    } catch (error) {
        console.error('Update intake error:', error);
        res.status(500).json({ error: 'Failed to update your daily intake.' });
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

        if (!intake) {
            return res.status(404).json({ error: 'Daily intake record not found.' });
        }

        const itemIndex = intake.items.findIndex(item => item._id.toString() === req.params.itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Intake item not found.' });
        }

        intake.totalCalories -= intake.items[itemIndex].calories;
        intake.items.splice(itemIndex, 1);
        await intake.save();
        
        res.json(intake);
    } catch (error) {
        console.error('Delete intake item error:', error);
        res.status(500).json({ error: 'Failed to delete the intake item.' });
    }
});

module.exports = router;
