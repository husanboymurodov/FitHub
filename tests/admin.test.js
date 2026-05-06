const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/user');

describe('Admin Role-Based Access Control', () => {
    let adminAgent;
    let guestAgent;

    beforeAll(async () => {
        adminAgent = request.agent(app);
        guestAgent = request.agent(app);

        // Wait for mongoose connection to be ready
        if (mongoose.connection.readyState !== 1) {
            await new Promise((resolve) => {
                mongoose.connection.once('open', resolve);
            });
        }
        // Small delay to ensure seed is finished
        await new Promise(resolve => setTimeout(resolve, 500));

        // Login as Admin
        await adminAgent.post('/login').send({
            email: 'admin@fithub.app',
            password: 'adminpassword123'
        });
        // Login as Guest
        await guestAgent.post('/login').send({
            email: 'guest@fithub.app',
            password: 'guestpassword123'
        });
    });

    afterAll(async () => {
        await User.deleteMany({ email: { $in: ['admin@fithub.app', 'guest@fithub.app'] } });
        await mongoose.connection.close();
    });

    describe('Admin Access Control', () => {
        it('should allow admin to access stats', async () => {
            const res = await adminAgent.get('/admin/stats');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('totalUsers');
        });

        it('should deny regular guest user from accessing stats', async () => {
            const res = await guestAgent.get('/admin/stats');
            expect(res.statusCode).toEqual(403);
            expect(res.body.error).toEqual('Access denied. Admins only.');
        });

        it('should allow admin to see user list', async () => {
            const res = await adminAgent.get('/admin/users');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
});
