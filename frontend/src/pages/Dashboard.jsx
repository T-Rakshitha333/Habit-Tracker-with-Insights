import React, { useEffect, useState } from 'react';
import { getHabits, toggleCheckIn, createHabit, deleteHabit } from '../services/api';
import HabitCard from '../components/HabitCard';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newHabitTitle, setNewHabitTitle] = useState('');
    const [newHabitTime, setNewHabitTime] = useState('');
    const [category, setCategory] = useState('General');
    const [frequency, setFrequency] = useState('daily');

    const fetchHabits = async () => {
        try {
            const { data } = await getHabits();
            setHabits(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const handleToggle = async (id) => {
        const today = new Date().toLocaleDateString('en-CA');
        try {
            await toggleCheckIn(id, today);
            fetchHabits(); // Refresh to update streak/state
        } catch (err) {
            console.error('Failed to toggle', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteHabit(id);
            fetchHabits();
        } catch (err) {
            console.error('Failed to delete', err);
            alert('Failed to delete habit');
        }
    };

    const handleAddHabit = async (e) => {
        e.preventDefault();
        if (!newHabitTitle.trim()) return;
        try {
            await createHabit({
                title: newHabitTitle,
                frequency: frequency,
                category: category,
                reminderTime: newHabitTime
            });
            setNewHabitTitle('');
            setNewHabitTime('');
            setCategory('General');
            setFrequency('daily');
            setShowAddModal(false);
            fetchHabits();
        } catch (err) {
            console.error(err);
            alert('Failed to create habit: ' + err.message);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '900px', margin: '0' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Hello, User! 👋</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Let's crush your goals today.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} /> New Habit
                </button>
            </header>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Habits</p>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>{habits.length}</h2>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Completed Today</p>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
                        {habits.filter(h => h.completedDates.includes(new Date().toLocaleDateString('en-CA'))).length}
                    </h2>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Daily Consistency</p>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>
                        {habits.length > 0 ? Math.round((habits.filter(h => h.completedDates.includes(new Date().toLocaleDateString('en-CA'))).length / habits.length) * 100) : 0}%
                    </h2>
                </div>
            </div>

            <div className="habits-list">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600' }}>Your Habits</h2>
                {loading ? <p>Loading...</p> : (
                    habits.map(habit => (
                        <HabitCard key={habit._id} habit={habit} onToggle={handleToggle} onDelete={handleDelete} />
                    ))
                )}
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-panel"
                            style={{ padding: '2rem', width: '100%', maxWidth: '400px', background: '#1e293b' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h3>Create New Habit</h3>
                                <button onClick={() => setShowAddModal(false)}><X size={20} color="var(--text-muted)" /></button>
                            </div>
                            <form onSubmit={handleAddHabit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Habit Name</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newHabitTitle}
                                        onChange={e => setNewHabitTitle(e.target.value)}
                                        placeholder="e.g. Morning Jog"
                                        style={{
                                            width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'white',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Reminder Time (Optional)</label>
                                    <input
                                        type="time"
                                        value={newHabitTime}
                                        onChange={e => setNewHabitTime(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'white',
                                            outline: 'none', colorScheme: 'dark'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Category</label>
                                        <select
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                            style={{
                                                width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'white',
                                                outline: 'none'
                                            }}
                                        >
                                            <option value="General">General</option>
                                            <option value="Health">Health</option>
                                            <option value="Work">Work</option>
                                            <option value="Learning">Learning</option>
                                            <option value="Mindfulness">Mindfulness</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Frequency</label>
                                        <select
                                            value={frequency}
                                            onChange={e => setFrequency(e.target.value)}
                                            style={{
                                                width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'white',
                                                outline: 'none'
                                            }}
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Habit</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
