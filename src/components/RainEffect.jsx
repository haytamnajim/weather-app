import React from 'react';
import '../MinimalistStyles.css';

const RainEffect = () => {
    const drops = Array.from({ length: 100 });

    return (
        <div className="rain-container">
            {drops.map((_, index) => (
                <div
                    key={index}
                    className="drop"
                    style={{
                        left: `${Math.random() * 100}vw`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${0.5 + Math.random() * 0.5}s`,
                        opacity: Math.random() * 0.5 + 0.2
                    }}
                />
            ))}
        </div>
    );
};

export default RainEffect;
