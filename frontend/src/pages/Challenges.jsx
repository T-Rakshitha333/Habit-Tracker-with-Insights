import React, { useEffect, useState } from 'react';
import { getChallenges, joinChallenge, createChallenge } from '../services/api';
import { Trophy, Users, Clock, Zap, ArrowRight, CheckCircle2, User, Medal, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Challenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newChallenge, setNewChallenge] = useState({ title: '', description: '', durationDays: 7, difficulty: 'Medium' });

    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        try {
            const { data } = await getChallenges();
            setChallenges(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (id) => {
        try {
            await joinChallenge(id);
            fetchChallenges();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newChallenge.title) return;
        try {
            await createChallenge(newChallenge);
            setShowCreateModal(false);
            setNewChallenge({ title: '', description: '', durationDays: 7, difficulty: 'Medium' });
            fetchChallenges();
        } catch (err) {
            console.error('Challenge creation failed:', err);
            alert(`Failed to create challenge: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Trophy className="text-accent" color="var(--accent)" />
                        Community Challenges
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Join global challenges and compete with others to build better habits.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} /> Create Challenge
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem' }}>

                {/* Left Col: Challenges */}
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {loading ? <p>Loading challenges...</p> : (
                        challenges.map(challenge => (
                            <div key={challenge._id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{
                                    height: '100px',
                                    background: challenge.joined
                                        ? 'linear-gradient(135deg, var(--success), #059669)'
                                        : 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    padding: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Zap size={32} color="white" fill="white" style={{ opacity: 0.8 }} />
                                    <span style={{
                                        background: 'rgba(0,0,0,0.2)', color: 'white', padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600'
                                    }}>
                                        {challenge.difficulty}
                                    </span>
                                </div>

                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{challenge.title}</h3>
                                        {challenge.joined && <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.8rem' }}>ACTIVE</span>}
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                                        {challenge.description}
                                    </p>

                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <Users size={16} /> {challenge.participantsCount}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <Clock size={16} /> {challenge.durationDays} days
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 'auto' }}>
                                        {challenge.joined ? (
                                            <button
                                                onClick={() => handleJoin(challenge._id)}
                                                className="btn"
                                                style={{
                                                    width: '100%', background: 'rgba(16, 185, 129, 0.1)',
                                                    color: 'var(--success)', border: '1px solid var(--success)',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <CheckCircle2 size={18} /> Leave Challenge
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleJoin(challenge._id)}
                                                className="btn btn-primary"
                                                style={{ width: '100%', gap: '0.5rem' }}
                                            >
                                                <Zap size={18} fill="currentColor" /> Join Challenge
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Right Col: Leaderboard */}
                <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Medal color="#f59e0b" /> Leaderboard
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { name: 'Sarah J.', points: 2450, rank: 1, avatar: 'SJ' },
                            { name: 'Mike Ross', points: 2100, rank: 2, avatar: 'MR' },
                            { name: 'You', points: 1850, rank: 3, avatar: 'ME' },
                            { name: 'Jessica P.', points: 1600, rank: 4, avatar: 'JP' },
                            { name: 'Louis L.', points: 1200, rank: 5, avatar: 'LL' },
                        ].map((user) => (
                            <div key={user.rank} style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                padding: '0.75rem', borderRadius: '0.5rem',
                                background: user.rank === 3 ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                border: user.rank === 3 ? '1px solid var(--primary)' : 'none'
                            }}>
                                <div style={{ fontWeight: 'bold', width: '20px', color: user.rank <= 3 ? '#f59e0b' : 'var(--text-muted)' }}>#{user.rank}</div>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%', background: '#334155',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold'
                                }}>
                                    {user.avatar}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.points} pts</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Keep completing habits to climb the ranks!
                    </div>
                </div>

            </div>

            {/* Create Challenge Modal */}
            <AnimatePresence>
                {showCreateModal && (
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
                            style={{ padding: '2rem', width: '100%', maxWidth: '500px', background: '#1e293b' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h3>Create Community Challenge</h3>
                                <button onClick={() => setShowCreateModal(false)}><X size={20} color="var(--text-muted)" /></button>
                            </div>
                            <form onSubmit={handleCreate}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Challenge Title</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newChallenge.title}
                                        onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })}
                                        placeholder="e.g. 30 Days of Code"
                                        required
                                        style={{
                                            width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'white', outline: 'none'
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
                                    <textarea
                                        value={newChallenge.description}
                                        onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })}
                                        placeholder="What's the goal?"
                                        rows={3}
                                        style={{
                                            width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'white', outline: 'none', resize: 'none'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Duration (Days)</label>
                                        <input
                                            type="number"
                                            value={newChallenge.durationDays}
                                            onChange={e => setNewChallenge({ ...newChallenge, durationDays: e.target.value })}
                                            min={1}
                                            style={{
                                                width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'white', outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Difficulty</label>
                                        <select
                                            value={newChallenge.difficulty}
                                            onChange={e => setNewChallenge({ ...newChallenge, difficulty: e.target.value })}
                                            style={{
                                                width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'white', outline: 'none'
                                            }}
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Launch Challenge</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Challenges;
