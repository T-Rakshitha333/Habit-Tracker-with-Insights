const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const mongoose = require('mongoose');
const { readDB, writeDB } = require('../db');

// Helper to check if we should use local DB
const useLocalDB = () => !process.env.MONGODB_URI || (process.env.NODE_ENV !== 'production' && mongoose.connection.readyState !== 1);

// GET all habits
router.get('/', async (req, res) => {
    try {
        if (!useLocalDB()) {
            const habits = await Habit.find().sort({ createdAt: -1 });
            return res.json(habits);
        }

        try {
            const db = readDB();
            res.json(db.habits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (fileErr) {
            res.status(500).json({ message: "Local database not available. Please configure MONGODB_URI." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create habit
router.post('/', async (req, res) => {
    const { title, category, frequency, reminderTime } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    if (!useLocalDB()) {
        const newHabit = new Habit({
            title,
            category,
            frequency,
            reminderTime,
            completedDates: [],
            streak: { current: 0, best: 0 }
        });
        try {
            const savedHabit = await newHabit.save();
            return res.status(201).json(savedHabit);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }

    // Fallback to local DB
    try {
        const db = readDB();
        const newHabitLocal = {
            _id: Date.now().toString(),
            title,
            category: category || 'General',
            frequency: frequency || 'daily',
            reminderTime: reminderTime || '',
            completedDates: [],
            streak: { current: 0, best: 0 },
            createdAt: new Date().toISOString()
        };
        db.habits.push(newHabitLocal);
        writeDB(db);
        res.status(201).json(newHabitLocal);
    } catch (fileErr) {
        res.status(500).json({ message: "Local database not writable. Please configure MONGODB_URI." });
    }
});

// PUT check-in / toggle
router.put('/:id/checkin', async (req, res) => {
    const { date } = req.body;
    try {
        if (!useLocalDB()) {
            const habit = await Habit.findById(req.params.id);
            if (!habit) return res.status(404).json({ message: 'Habit not found' });

            const dateIndex = habit.completedDates.indexOf(date);
            if (dateIndex === -1) {
                habit.completedDates.push(date);
            } else {
                habit.completedDates.splice(dateIndex, 1);
            }

            habit.streak.current = habit.completedDates.length;
            if (habit.streak.current > habit.streak.best) {
                habit.streak.best = habit.streak.current;
            }

            const updatedHabit = await habit.save();
            return res.json(updatedHabit);
        }

        // Fallback
        const db = readDB();
        const habitIndex = db.habits.findIndex(h => h._id === req.params.id);
        if (habitIndex === -1) return res.status(404).json({ message: 'Habit not found' });

        const habitLocal = db.habits[habitIndex];
        const dateIndexLocal = habitLocal.completedDates.indexOf(date);
        if (dateIndexLocal === -1) {
            habitLocal.completedDates.push(date);
        } else {
            habitLocal.completedDates.splice(dateIndexLocal, 1);
        }
        habitLocal.streak.current = habitLocal.completedDates.length;
        db.habits[habitIndex] = habitLocal;
        writeDB(db);
        res.json(habitLocal);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE habit
router.delete('/:id', async (req, res) => {
    try {
        if (!useLocalDB()) {
            await Habit.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Habit deleted' });
        }
        const db = readDB();
        db.habits = db.habits.filter(h => h._id !== req.params.id);
        writeDB(db);
        res.json({ message: 'Habit deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
