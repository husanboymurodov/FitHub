const User = require('./models/user');

const seedDemoAccounts = async () => {
    try {
        // 1. Create Demo/Guest User
        const guestExists = await User.findOne({ email: 'guest@fithub.app' });
        if (!guestExists) {
            const guest = new User({
                name: 'Demo User',
                email: 'guest@fithub.app',
                password: 'guestpassword123',
                isAdmin: false
            });
            await guest.save();
            console.log('✅ Demo Guest account seeded.');
        }

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
