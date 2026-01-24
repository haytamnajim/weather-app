import React, { useState, useEffect } from 'react';
import '../MinimalistStyles.css';

const CardRainEffect = () => {
    const [splashes, setSplashes] = useState([]);

    // Constant streaks (rendered once)
    const streaks = Array.from({ length: 20 });

    useEffect(() => {
        const interval = setInterval(() => {
            const newSplash = {
                id: Date.now(),
                left: `${Math.random() * 100}%`,
            };
            setSplashes(prev => [...prev.slice(-10), newSplash]); // Keep only last 10
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card-rain-overlay">
            {/* Top Border Splashes */}
            {splashes.map(splash => (
                <div
                    key={splash.id}
                    className="splash"
                    style={{ left: splash.left }}
                />
            ))}

            {/* Surface Streaks */}
            {streaks.map((_, i) => (
                <div
                    key={i}
                    className="streak"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${1 + Math.random() * 2}s`,
                        animationDelay: `${Math.random() * 2}s`,
                        opacity: Math.random() * 0.3
                    }}
                />
            ))}
        </div>
    );
};

export default CardRainEffect;
