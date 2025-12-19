import React, { useEffect } from 'react';
import { getHabits } from '../services/api';

const NotificationManager = () => {
    useEffect(() => {
        // Request permission on mount
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        const checkReminders = async () => {
            if (Notification.permission !== 'granted') return;

            try {
                const { data: habits } = await getHabits();
                const now = new Date();
                const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

                habits.forEach(habit => {
                    if (habit.reminderTime === currentTime && !habit.completedDates.includes(now.toLocaleDateString('en-CA'))) {
                        // Basic Check: prevent spamming by checking if we already notified this minute? 
                        // Ideally we need state tracking, but for this demo interval is 60s
                        new Notification(`Time to ${habit.title}!`, {
                            body: `Don't break your ${habit.streak.current} day streak!`,
                            icon: '/vite.svg'
                        });
                    }
                });
            } catch (err) {
                console.error(err);
            }
        };

        const interval = setInterval(checkReminders, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return null; // Invisible component
};

export default NotificationManager;
