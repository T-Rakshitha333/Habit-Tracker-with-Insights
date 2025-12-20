const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// GET all habits
router.get('/', async (req, res) => {
    try {
        const habits = await Habit.find().sort({ createdAt: -1 });
        res.json(habits);
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
        res.status(201).json(savedHabit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT check-in / toggle
router.put('/:id/checkin', async (req, res) => {
    const { date } = req.body;
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        const dateIndex = habit.completedDates.indexOf(date);

        if (dateIndex === -1) {
            habit.completedDates.push(date);
        } else {
            habit.completedDates.splice(dateIndex, 1);
        }

        // Simple streak calc (simplified for demo)
        habit.streak.current = habit.completedDates.length;
        if (habit.streak.current > habit.streak.best) {
            habit.streak.best = habit.streak.current;
        }

        const updatedHabit = await habit.save();
        res.json(updatedHabit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE habit
router.delete('/:id', async (req, res) => {
    try {
        await Habit.findByIdAndDelete(req.params.id);
        res.json({ message: 'Habit deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
