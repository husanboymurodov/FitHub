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
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
    seconds: { type: Number, default: 0 }
  },

  distance: { type: Number }, // in km
  speed: { type: Number }, // in km/h, 

  weightUsed: {
    weight: { type: Number },
    unit: { type: String, enum: ['kg', 'lbs'] }
  },

  steps: { type: Number },

  sets: { type: Number },
  reps: [{ type: Number }], // reps per set, can be an array

  rate: { type: Number }, // from 0 to 100 (slider)

  notes: { type: String },

  caloriesBurned: { type: Number }, // calculated before saving

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
