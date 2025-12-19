import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Award, Zap } from 'lucide-react';
import '../index.css';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: BarChart2, label: 'Insights', path: '/insights' },
        { icon: Award, label: 'Challenges', path: '/challenges' },
    ];

    return (
        <aside className="sidebar">
            <div className="flex-center" style={{ justifyContent: 'flex-start', marginBottom: '3rem', gap: '0.75rem' }}>
                <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                    <Zap size={24} color="white" fill="white" />
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>HabitFlow</h1>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `btn-ghost ${isActive ? 'active-nav' : ''}`
                        }
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
                        })}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Pro Plan</p>
                <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', marginBottom: '0.5rem' }}>
                    <div style={{ width: '70%', background: 'var(--accent)', height: '100%', borderRadius: '2px' }}></div>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>4 days streak keeper!</p>
            </div>
        </aside>
    );
};

export default Sidebar;
