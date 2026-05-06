const User = require('./models/user');
const Activity = require('./models/activity');
const Reminder = require('./models/reminder');
const DailyIntake = require('./models/dailyIntake');

const seedDemoAccounts = async () => {
    try {
        // 1. Create Demo/Guest User
        let guest = await User.findOne({ email: 'guest@fithub.app' });
        if (!guest) {
            guest = new User({
                name: 'Demo User',
                email: 'guest@fithub.app',
                password: 'guestpassword123',
                isAdmin: false,
                age: 28,
                weight: 75,
                height: 180,
                gender: 'male'
            });
            await guest.save();
            console.log('✅ Demo Guest account seeded.');
        }

        // Clean up existing demo data for the guest so they get fresh rich data on restart
        await Activity.deleteMany({ user: guest._id });
        await Reminder.deleteMany({ user: guest._id });
        await DailyIntake.deleteMany({ user: guest._id });

        const today = new Date();
        const days = Array.from({length: 7}, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            return d;
        });

        // Seed rich activities (7 days of history)
        await Activity.create([
            // Today (day 0)
            {
                user: guest._id,
                title: 'Morning 5K Run',
                activityType: 1, // Running
                datetime: days[0],
                duration: { hours: 0, minutes: 25, seconds: 30 },
                distance: 5.2,
                caloriesBurned: 350,
                rate: 4,
                notes: 'Felt great, nice weather.'
            },
            {
                user: guest._id,
                title: 'Daily Steps',
                activityType: 2, // Walking
                datetime: days[0],
                duration: { hours: 1, minutes: 20, seconds: 0 },
                distance: 6.5,
                steps: 8500,
                caloriesBurned: 250,
                rate: 3,
                notes: 'Walked around the city.'
            },
            // Yesterday (day 1)
            {
                user: guest._id,
                title: 'Upper Body Strength',
                activityType: 6, // Weightlifting
                datetime: days[1],
                duration: { hours: 1, minutes: 15, seconds: 0 },
                weightUsed: { weight: 60, unit: 'kg' },
                sets: 4,
                reps: [10, 10, 8, 8],
                caloriesBurned: 450,
                rate: 5,
                notes: 'Bench press focused. Hit a new PR.'
            },
            {
                user: guest._id,
                title: 'Daily Steps',
                activityType: 2,
                datetime: days[1],
                duration: { hours: 1, minutes: 10, seconds: 0 },
                distance: 5.5,
                steps: 7200,
                caloriesBurned: 200,
                rate: 3
            },
            // Day 2
            {
                user: guest._id,
                title: 'Evening Swim',
                activityType: 4, // Swimming
                datetime: days[2],
                duration: { hours: 0, minutes: 45, seconds: 0 },
                distance: 1.5,
                caloriesBurned: 400,
                rate: 4,
                notes: 'Freestyle intervals.'
            },
            {
                user: guest._id,
                title: 'Push-up Challenge',
                activityType: 11, // Push-ups
                datetime: days[2],
                duration: { hours: 0, minutes: 10, seconds: 0 },
                sets: 5,
                reps: [20, 20, 15, 15, 10],
                caloriesBurned: 100,
                rate: 4
            },
            {
                user: guest._id,
                title: 'Daily Steps',
                activityType: 2,
                datetime: days[2],
                steps: 9100,
                caloriesBurned: 280,
                rate: 3
            },
            // Day 3
            {
                user: guest._id,
                title: 'Leg Day',
                activityType: 13, // Squats
                datetime: days[3],
                duration: { hours: 1, minutes: 0, seconds: 0 },
                weightUsed: { weight: 80, unit: 'kg' },
                sets: 5,
                reps: [12, 10, 8, 8, 5],
                caloriesBurned: 500,
                rate: 5,
                notes: 'Heavy squats today.'
            },
            {
                user: guest._id,
                title: 'Daily Steps',
                activityType: 2,
                datetime: days[3],
                steps: 6500,
                caloriesBurned: 180,
                rate: 3
            },
            // Day 4
            {
                user: guest._id,
                title: 'Morning 10K Run',
                activityType: 1, // Running
                datetime: days[4],
                duration: { hours: 0, minutes: 55, seconds: 0 },
                distance: 10.1,
                caloriesBurned: 700,
                rate: 5,
                notes: 'Long run, kept a steady pace.'
            },
            {
                user: guest._id,
                title: 'Daily Steps',
                activityType: 2,
                datetime: days[4],
                steps: 12500,
                caloriesBurned: 400,
                rate: 4
            },
            // Day 5
            {
                user: guest._id,
                title: 'Rest Day Walk',
                activityType: 2, // Walking
                datetime: days[5],
                duration: { hours: 1, minutes: 30, seconds: 0 },
                distance: 8.0,
                steps: 10500,
                caloriesBurned: 300,
                rate: 3,
                notes: 'Active recovery.'
            },
            // Day 6
            {
                user: guest._id,
                title: 'Full Body HIIT',
                activityType: 18, // Burpees
                datetime: days[6],
                duration: { hours: 0, minutes: 30, seconds: 0 },
                sets: 4,
                reps: [15, 15, 15, 15],
                caloriesBurned: 350,
                rate: 5,
                notes: 'Intense session.'
            },
            {
                user: guest._id,
                title: 'Daily Steps',
                activityType: 2,
                datetime: days[6],
                steps: 7800,
                caloriesBurned: 220,
                rate: 3
            }
        ]);
        console.log('✅ Rich demo activities seeded for Guest.');

        // Seed Demo Reminders for Guest
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0);

        const tonight = new Date();
        tonight.setHours(20, 0, 0, 0);

        await Reminder.create([
            {
                user: guest._id,
                text: 'Drink a glass of water',
                time: tomorrow,
                category: 'hydration',
                recurring: 'daily'
            },
            {
                user: guest._id,
                text: 'Evening Stretching',
                time: tonight,
                category: 'exercise',
                duration: 15,
                recurring: 'daily'
            }
        ]);
        console.log('✅ Demo reminders seeded for Guest.');

        // Seed Demo Daily Intake for Guest
        today.setHours(0, 0, 0, 0);
        await DailyIntake.create({
            user: guest._id,
            date: today,
            items: [
                { name: 'Oatmeal & Berries', calories: 350 },
                { name: 'Grilled Chicken Salad', calories: 450 },
                { name: 'Protein Shake', calories: 200 }
            ],
            totalCalories: 1000
        });
        console.log('✅ Demo nutrition intake seeded for Guest.');

        // 2. Create Admin User
        const adminExists = await User.findOne({ email: 'admin@fithub.app' });
        if (!adminExists) {
            const admin = new User({
                name: 'Project Administrator',
                email: 'admin@fithub.app',
                password: 'adminpassword123',
                isAdmin: true
            });
            await admin.save();
            console.log('✅ Demo Admin account seeded.');
        }
    } catch (error) {
        console.error('❌ Seeding error:', error);
    }
};

module.exports = seedDemoAccounts;
