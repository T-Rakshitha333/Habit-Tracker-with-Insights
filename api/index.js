require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder']
}));
app.use(express.json());

const mongoose = require('mongoose');

// Cached connection variable
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    if (!process.env.MONGODB_URI) {
        console.warn('WARNING: MONGODB_URI not found.');
        return null;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        cachedDb = db;
        console.log('Connected to MongoDB Atlas');
        return cachedDb;
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
}

// Middleware to ensure DB connection attempt
app.use(async (req, res, next) => {
    if (process.env.MONGODB_URI) {
        try {
            await connectToDatabase();
        } catch (err) {
            console.error('Proceeding in Fallback Mode due to DB error');
        }
    }
    next();
});

// Routes
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));

app.get('/', (req, res) => {
    res.send('Habit Tracker API is running (MongoDB Mode)');
});

// For Vercel Serverless Support
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
