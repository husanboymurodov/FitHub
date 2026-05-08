const mongoose = require('mongoose');
const seedDemoAccounts = require('../seed');

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitHub';

async function connectDatabase() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    await mongoose.connect(dbUrl, {
        serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS) || 10000
    });

    if (process.env.NODE_ENV !== 'test') {
        console.log('Connected to MongoDB');
    }

    if (process.env.SEED_DEMO_ACCOUNTS !== 'false') {
        await seedDemoAccounts();
    }

    return mongoose.connection;
}

module.exports = { connectDatabase, dbUrl };
