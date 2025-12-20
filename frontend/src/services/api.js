import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getHabits = () => api.get('/habits');
export const createHabit = (data) => api.post('/habits', data);
export const toggleCheckIn = (id, date) => api.put(`/habits/${id}/checkin`, { date });
export const deleteHabit = (id) => api.delete(`/habits/${id}`);

export const getChallenges = () => api.get('/challenges');
export const createChallenge = (data) => api.post('/challenges', data);
export const joinChallenge = (id) => api.post(`/challenges/${id}/join`);

export default api;
