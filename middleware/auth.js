const User = require('../models/user');

const requireLogin = async (req, res, next) => {
    if (!req.session.user_id) {
        if (req.xhr || req.path.startsWith('/api')) {
            return res.status(401).json({ error: 'Unauthorized. Please login.' });
        }
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(req.session.user_id);
        if (!user) {
            req.session.user_id = null;
            return res.redirect('/login');
        }
        res.locals.user = user;
        next();
    } catch (err) {
        return res.redirect('/login');
    }
};

const requireAdmin = async (req, res, next) => {
    if (!req.session.user_id) {
        if (req.xhr || req.path.startsWith('/api') || req.path.startsWith('/admin')) {
            return res.status(401).json({ error: 'Unauthorized. Please login.' });
        }
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(req.session.user_id);
        if (user && user.isAdmin) {
            res.locals.user = user;
            next();
        } else {
            res.status(403).json({ error: "Access denied. Admins only." });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error during authorization check." });
    }
};

module.exports = { requireLogin, requireAdmin };
