const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        enum: ['hydration', 'exercise', 'meal', 'other'],
        default: 'other'
    },
    recurring: {
        type: mongoose.Schema.Types.Mixed, // Can be 'daily', 'none', or an array of days
        default: 'none'
    },
    duration: {
        type: Number, // in minutes
        default: 0
    },
    interval: {
        type: String,
        default: 'none'
    },
    shown: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
