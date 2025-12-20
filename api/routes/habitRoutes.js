const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../db');

// GET all habits
router.get('/', (req, res) => {
    try {
        const db = readDB();
        // Sort by createdAt descending (newest first)
        const sortedHabits = [...db.habits].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(sortedHabits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create habit
router.post('/', (req, res) => {
    const { title, category, frequency, reminderTime } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const newHabit = {
        _id: Date.now().toString(),
        title,
        category: category || 'General',
        frequency: frequency || 'daily',
        reminderTime: reminderTime || '',
        completedDates: [],
        streak: { current: 0, best: 0 },
        createdAt: new Date().toISOString()
    };

    try {
        const db = readDB();
        db.habits.push(newHabit);
        writeDB(db);
        res.status(201).json(newHabit);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT check-in / toggle
router.put('/:id/checkin', (req, res) => {
    const { date } = req.body;
    try {
        const db = readDB();
        const habitIndex = db.habits.findIndex(h => h._id === req.params.id);

        if (habitIndex === -1) return res.status(404).json({ message: 'Habit not found' });

        const habit = db.habits[habitIndex];
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

        db.habits[habitIndex] = habit;
        writeDB(db);
        res.json(habit);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE habit
router.delete('/:id', (req, res) => {
    try {
        const db = readDB();
        db.habits = db.habits.filter(h => h._id !== req.params.id);
        writeDB(db);
        res.json({ message: 'Habit deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
