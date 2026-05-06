const mongoose = require('mongoose');

const favoriteMealSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mealId: {
        type: String, // TheMealDB ID
        required: true
    },
    name: String,
    image: String,
    category: String
}, { timestamps: true });

module.exports = mongoose.model('FavoriteMeal', favoriteMealSchema);
