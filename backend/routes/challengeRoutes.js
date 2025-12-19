const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// GET all challenges
router.get('/', async (req, res) => {
    try {
        const db = readDB();
        res.json(db.challenges);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create challenge
router.post('/', async (req, res) => {
    try {
        const { title, description, durationDays, difficulty } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required' });

        const db = readDB();
        const newChallenge = {
            _id: Date.now().toString(),
            title,
            description: description || '',
            durationDays: parseInt(durationDays) || 7,
            participantsCount: 1,
            difficulty: difficulty || 'Medium',
            joined: true // Auto-join creator
        };

        db.challenges.push(newChallenge);
        writeDB(db);
        res.status(201).json(newChallenge);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST join challenge (toggle)
router.post('/:id/join', async (req, res) => {
    try {
        const db = readDB();
        const index = db.challenges.findIndex(c => c._id === req.params.id);

        if (index === -1) return res.status(404).json({ message: 'Challenge not found' });

        const challenge = db.challenges[index];
        challenge.joined = !challenge.joined;

        if (challenge.joined) {
            challenge.participantsCount += 1;
        } else {
            challenge.participantsCount -= 1;
        }

        db.challenges[index] = challenge;
        writeDB(db);

        res.json(challenge);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
