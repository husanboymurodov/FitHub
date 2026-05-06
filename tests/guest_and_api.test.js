const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user');
const Reminder = require('../models/reminder');
const FavoriteMeal = require('../models/favoriteMeal');

describe('Guest Authentication and API Validation', () => {
    let agent;

    beforeAll(async () => {
        // Use a supertest agent to maintain session cookies
        agent = request.agent(app);
        
        // Wait for mongoose connection to be ready
        if (mongoose.connection.readyState !== 1) {
            await new Promise((resolve) => {
                mongoose.connection.once('open', resolve);
            });
        }
        // Small delay to ensure seed is finished
        await new Promise(resolve => setTimeout(resolve, 500));
    });

    afterAll(async () => {
        // Cleanup Guest user created during tests
        await User.deleteOne({ email: 'guest@fithub.app' });
        await Reminder.deleteMany({ text: 'Test Reminder' });
        await FavoriteMeal.deleteMany({ mealId: '99999' });
        await mongoose.connection.close();
    });

    describe('Guest Login Flow', () => {
        it('should login as guest using standard credentials', async () => {
            const res = await agent.post('/login').send({
                email: 'guest@fithub.app',
                password: 'guestpassword123'
            });
            expect(res.statusCode).toEqual(302); // Redirect to /tracker
            expect(res.header.location).toEqual('/tracker');
        });
    });

    describe('Reminders Validation', () => {
        it('should create a reminder when valid data is provided', async () => {
            const res = await agent.post('/api/reminders').send({
                text: 'Test Reminder',
                time: new Date().toISOString(),
                category: 'exercise'
            });
            expect(res.statusCode).toEqual(201);
            expect(res.body.text).toEqual('Test Reminder');
        });

        it('should return 400 when text is missing', async () => {
            const res = await agent.post('/api/reminders').send({
                time: new Date().toISOString()
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('Reminder text and time are required.');
        });
    });

    describe('Favorite Meals Validation', () => {
        it('should save a favorite meal', async () => {
            const res = await agent.post('/api/favorites').send({
                mealId: '99999',
                name: 'Test Meal',
                image: 'http://example.com/image.jpg',
                category: 'Test'
            });
            expect(res.statusCode).toEqual(201);
        });

        it('should return 409 when adding a duplicate favorite', async () => {
            const res = await agent.post('/api/favorites').send({
                mealId: '99999',
                name: 'Test Meal'
            });
            expect(res.statusCode).toEqual(409);
            expect(res.body.error).toEqual('Meal is already in your favorites.');
        });
    });

    describe('Daily Intake Validation', () => {
        it('should return 400 for negative calories', async () => {
            const res = await agent.post('/api/intake').send({
                name: 'Bad Entry',
                calories: -50
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toEqual('Valid name and non-negative calories are required.');
        });
    });
});
