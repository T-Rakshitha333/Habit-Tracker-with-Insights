import React, { useEffect, useState } from 'react';
import { getHabits } from '../services/api';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    AreaChart, Area, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Target, Award } from 'lucide-react';

const Insights = () => {
    const [habits, setHabits] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [successRateData, setSuccessRateData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await getHabits();
            setHabits(data);
            processChartData(data);
            processSuccessData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const processChartData = (data) => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toLocaleDateString('en-CA'));
        }

        const stats = days.map(day => {
            const count = data.reduce((acc, habit) => {
                return acc + (habit.completedDates.includes(day) ? 1 : 0);
            }, 0);

            const weekday = new Date(day).toLocaleDateString('en-US', { weekday: 'short' });
            return { name: weekday, completions: count, date: day };
        });

        setChartData(stats);
    };

    const processSuccessData = (data) => {
        if (data.length === 0) return;

        const successRates = data.map(habit => {
            // Calculate success based on last 30 days roughly, or just total completed vs age (simplified)
            // Simplified: Success = streak / 30 * 100 (capped at 100) or just logic mock
            // Better: Ratio of completed dates to total days since creation
            const created = new Date(habit.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now - created);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

            let rate = Math.round((habit.completedDates.length / diffDays) * 100);
            if (rate > 100) rate = 100; // creation date might be same day

            return { name: habit.title, value: rate };
        }).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5

        setSuccessRateData(successRates);
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <TrendingUp color="var(--primary)" /> Insights & Analytics
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

                {/* Weekly Progress Chart */}
                <div className="glass-panel" style={{ padding: '2rem', minHeight: '350px' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Weekly Completion Trend</h3>
                    <div style={{ height: '250px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }}
                                    itemStyle={{ color: '#8b5cf6' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="completions"
                                    stroke="#8b5cf6"
                                    fillOpacity={1}
                                    fill="url(#colorCompletions)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Success Patterns */}
                <div className="glass-panel" style={{ padding: '2rem', minHeight: '350px' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target size={20} /> Top Performing Habits
                    </h3>
                    {successRateData.length > 0 ? (
                        <div style={{ width: '100%', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={successRateData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} hide />
                                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{ fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                                        {successRateData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            No enough data yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Check-ins</p>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                        {habits.reduce((acc, h) => acc + h.completedDates.length, 0)}
                    </h2>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Best Streak</p>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent)' }}>
                        {Math.max(...habits.map(h => h.streak?.current || 0), 0)}
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Days</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Active Habits</p>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--success)' }}>
                        {habits.length}
                    </h2>
                </div>
            </div>

        </div>
    );
};

export default Insights;
