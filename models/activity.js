const mongoose = require('mongoose');
const { Schema } = mongoose;

const ActivitySchema = new mongoose.Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: { type: String, required: true },
  activityType: { type: String, required: true }, // Store activity name or ID

  otherActivityType: { type: String }, // Used only when "Other" is selected

  imageUrl: { type: String }, // Should be set when the image is uploaded to disk/cloud

  datetime: { type: Date, required: true },

  duration: {
    hours: { type: Number, default: 0, min: 0 },
    minutes: { type: Number, default: 0, min: 0, max: 59 },
    seconds: { type: Number, default: 0, min: 0, max: 59 }
  },

  distance: { type: Number, min: 0 }, // in km
  speed: { type: Number, min: 0 }, // in km/h, 

  weightUsed: {
    weight: { type: Number, min: 0 },
    unit: { type: String, enum: ['kg', 'lbs'] }
  },

  steps: { type: Number, min: 0 },

  sets: { type: Number, min: 0 },
  reps: [{ type: Number, min: 0 }], // reps per set, can be an array

  rate: { type: Number, min: 0, max: 100 }, // from 0 to 100 (slider)

  notes: { type: String },

  caloriesBurned: { type: Number, min: 0 }, // calculated before saving

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
