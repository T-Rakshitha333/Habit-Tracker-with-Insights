// In-Memory Storage (Resets on server restart/sleep)
let habits = [];
let challenges = [
    { _id: '1', title: '7 Days of Hydration', description: 'Drink 3L of water every day.', durationDays: 7, participantsCount: 124, difficulty: 'Easy', joined: false },
    { _id: '2', title: 'Morning Meditation', description: 'Meditate for 10 mins.', durationDays: 21, participantsCount: 89, difficulty: 'Medium', joined: false },
    { _id: '3', title: 'No Sugar Sprint', description: 'Avoid added sugar.', durationDays: 14, participantsCount: 56, difficulty: 'Hard', joined: false }
];

const readDB = () => {
    return { habits, challenges };
};

const writeDB = (data) => {
    habits = data.habits || habits;
    challenges = data.challenges || challenges;
};

module.exports = { readDB, writeDB };
