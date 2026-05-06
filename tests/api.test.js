const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('API Routes', () => {
    // Before all tests, ensure we have a clean environment if needed
    // However, since we are testing unauthorized access first, no setup needed yet

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('GET /api/activities', () => {
        it('should return 401 if not logged in', async () => {
            const res = await request(app).get('/api/activities');
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('error', 'Unauthorized');
        });
    });

    describe('GET /', () => {
        it('should return 200 and render index', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toEqual(200);
        });
    });
});
