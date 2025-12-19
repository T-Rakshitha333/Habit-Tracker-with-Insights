const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // For now, allow anonymous or single user if needed, but best to enforce if we have users
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'General'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly'],
        default: 'daily'
    },
    completedDates: {
        type: [String], // Format: "YYYY-MM-DD"
        default: []
    },
    streak: {
        current: { type: Number, default: 0 },
        best: { type: Number, default: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Habit', habitSchema);
