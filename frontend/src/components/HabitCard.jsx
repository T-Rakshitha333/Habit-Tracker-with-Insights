import React from 'react';
import { Check, Flame, Calendar, Bell, Trash2 } from 'lucide-react';

const HabitCard = ({ habit, onToggle, onDelete }) => {
    const today = new Date().toLocaleDateString('en-CA');
    const isCompleted = habit.completedDates.includes(today);

    return (
        <div className="glass-panel" style={{
            padding: '1.25rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'transform 0.2s',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{habit.title.charAt(0)}</div>
                </div>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.2rem' }}>{habit.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <span style={{
                            background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem',
                            border: '1px solid var(--border)'
                        }}>
                            {habit.category || 'General'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Flame size={14} color={habit.streak?.current > 0 ? '#fbbf24' : 'currentColor'} />
                            {habit.streak?.current || 0} Streak
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Calendar size={14} />
                            {habit.frequency}
                        </span>
                        {habit.reminderTime && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Bell size={14} />
                                {habit.reminderTime}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this habit?')) {
                            onDelete(habit._id);
                        }
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    <Trash2 size={18} />
                </button>
                <button
                    onClick={() => onToggle(habit._id)}
                    style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        border: isCompleted ? 'none' : '2px solid var(--border)',
                        background: isCompleted ? 'var(--success)' : 'transparent',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer'
                    }}
                >
                    <Check size={20} strokeWidth={3} style={{ opacity: isCompleted ? 1 : 0, transition: 'opacity 0.2s' }} />
                </button>
            </div>
        </div>
    );
};

export default HabitCard;
