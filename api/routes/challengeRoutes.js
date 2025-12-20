const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const mongoose = require('mongoose');
const { readDB, writeDB } = require('../db');

const isDBConnected = () => mongoose.connection.readyState === 1;

// GET all challenges
router.get('/', async (req, res) => {
    try {
        if (isDBConnected()) {
            const challenges = await Challenge.find();
            return res.json(challenges);
        }
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

        if (isDBConnected()) {
            const newChallenge = new Challenge({
                title,
                description: description || '',
                durationDays: parseInt(durationDays) || 7,
                participantsCount: 1,
                difficulty: difficulty || 'Medium',
                joined: true
            });
            const savedChallenge = await newChallenge.save();
            return res.status(201).json(savedChallenge);
        }

        const db = readDB();
        const newChallengeLocal = {
            _id: Date.now().toString(),
            title,
            description: description || '',
            durationDays: parseInt(durationDays) || 7,
            participantsCount: 1,
            difficulty: difficulty || 'Medium',
            joined: true
        };
        db.challenges.push(newChallengeLocal);
        writeDB(db);
        res.status(201).json(newChallengeLocal);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST join challenge (toggle)
router.post('/:id/join', async (req, res) => {
    try {
        if (isDBConnected()) {
            const challenge = await Challenge.findById(req.params.id);
            if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
            challenge.joined = !challenge.joined;
            if (challenge.joined) {
                challenge.participantsCount += 1;
            } else {
                challenge.participantsCount -= 1;
            }
            const updatedChallenge = await challenge.save();
            return res.json(updatedChallenge);
        }

        const db = readDB();
        const index = db.challenges.findIndex(c => c._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Challenge not found' });
        const challengeLocal = db.challenges[index];
        challengeLocal.joined = !challengeLocal.joined;
        if (challengeLocal.joined) {
            challengeLocal.participantsCount += 1;
        } else {
            challengeLocal.participantsCount -= 1;
        }
        db.challenges[index] = challengeLocal;
        writeDB(db);
        res.json(challengeLocal);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
