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

// Routes
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));

app.get('/', (req, res) => {
    res.send('Habit Tracker API is running (JSON DB Mode)');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
