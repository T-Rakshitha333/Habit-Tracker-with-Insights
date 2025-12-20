const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

// Initialize DB if not exists
if (!fs.existsSync(DB_PATH)) {
    const initialData = {
        habits: [],
        challenges: [
            { _id: '1', title: '7 Days of Hydration', description: 'Drink 3L of water every day.', durationDays: 7, participantsCount: 124, difficulty: 'Easy', joined: false },
            { _id: '2', title: 'Morning Meditation', description: 'Meditate for 10 mins.', durationDays: 21, participantsCount: 89, difficulty: 'Medium', joined: false },
            { _id: '3', title: 'No Sugar Sprint', description: 'Avoid added sugar.', durationDays: 14, participantsCount: 56, difficulty: 'Hard', joined: false }
        ]
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
}

const readDB = () => {
    try {
        if (!fs.existsSync(DB_PATH)) return { habits: [], challenges: [] };
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.warn('Fallback: Using in-memory database (read failed)');
        return { habits: [], challenges: [] };
    }
};

const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        console.warn('Fallback: Data not saved to disk (write failed)');
    }
};

module.exports = { readDB, writeDB };
