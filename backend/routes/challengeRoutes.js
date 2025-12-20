const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');

// GET all challenges
router.get('/', async (req, res) => {
    try {
        const challenges = await Challenge.find();
        res.json(challenges);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create challenge
router.post('/', async (req, res) => {
    try {
        const { title, description, durationDays, difficulty } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required' });

        const newChallenge = new Challenge({
            title,
            description: description || '',
            durationDays: parseInt(durationDays) || 7,
            participantsCount: 1,
            difficulty: difficulty || 'Medium',
            joined: true // Auto-join creator
        });

        const savedChallenge = await newChallenge.save();
        res.status(201).json(savedChallenge);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST join challenge (toggle)
router.post('/:id/join', async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);

        if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

        challenge.joined = !challenge.joined;

        if (challenge.joined) {
            challenge.participantsCount += 1;
        } else {
            challenge.participantsCount -= 1;
        }

        const updatedChallenge = await challenge.save();
        res.json(updatedChallenge);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
