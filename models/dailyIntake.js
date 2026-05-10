const mongoose = require('mongoose');

const dailyIntakeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    items: [{
        name: String,
        calories: { type: Number, min: 0 }
    }],
    totalCalories: {
        type: Number,
        default: 0,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('DailyIntake', dailyIntakeSchema);
