const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    durationDays: {
        type: Number,
        required: true
    },
    participantsCount: {
        type: Number,
        default: 1
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    joined: {
        type: Boolean, // User-specific flag simulation for this simple app
        default: false
    },
    progress: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Challenge', challengeSchema);
