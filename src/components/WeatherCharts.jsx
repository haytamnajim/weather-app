import React from 'react';

// Composant diagramme simple en barres
export const SimpleBarChart = ({ data, dataKey, color, height = 100, label }) => (
    <div style={{ marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '10px', fontSize: '16px', opacity: 0.9 }}>{label}</h4>
        <div style={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            height: height,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '10px',
            backdropFilter: 'blur(10px)'
        }}>
            {data.map((item, index) => {
                const maxValue = Math.max(...data.map(d => d[dataKey]), 1);
                const barHeight = (item[dataKey] / maxValue) * (height - 40);

                return (
                    <div key={index} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1
                    }}>
                        <div style={{
                            fontSize: '10px',
                            marginBottom: '5px',
                            fontWeight: '600'
                        }}>
                            {item[dataKey]}
                        </div>
                        <div style={{
                            width: '20px',
                            height: barHeight,
                            backgroundColor: color,
                            borderRadius: '3px 3px 0 0',
                            marginBottom: '5px'
                        }}></div>
                        <div style={{
                            fontSize: '10px',
                            opacity: 0.8
                        }}>
                            {item.time !== undefined ? `${item.time}h` : item.day}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

// Composant diagramme linéaire simple
export const SimpleLineChart = ({ data, dataKey, color, height = 100, label }) => {
    const maxValue = Math.max(...data.map(d => d[dataKey]), 1);
    const minValue = Math.min(...data.map(d => d[dataKey]), 0);
    const range = maxValue - minValue || 1;

    const points = data.map((item, index) => {
        const x = (index / (data.length - 1 || 1)) * 280;
        const y = height - 20 - ((item[dataKey] - minValue) / range) * (height - 40);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '16px', opacity: 0.9 }}>{label}</h4>
            <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '15px',
                backdropFilter: 'blur(10px)'
            }}>
                <svg width="100%" height={height} viewBox={`0 0 280 ${height}`}>
                    <polyline
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        points={points}
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                    />
                    {data.map((item, index) => {
                        const x = (index / (data.length - 1 || 1)) * 280;
                        const y = height - 20 - ((item[dataKey] - minValue) / range) * (height - 40);
                        return (
                            <g key={index}>
                                <circle cx={x} cy={y} r="4" fill={color} />
                                <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="white" fontWeight="600">
                                    {item[dataKey]}
                                </text>
                            </g>
                        );
                    })}
                </svg>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px'
                }}>
                    {data.map((item, index) => (
                        <div key={index} style={{
                            fontSize: '10px',
                            opacity: 0.8,
                            textAlign: 'center',
                            flex: 1
                        }}>
                            {item.time !== undefined ? `${item.time}h` : item.day}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Composant diagramme circulaire (gauge)
export const CircularGauge = ({ value, maxValue, color, label, unit }) => {
    const percentage = (value / maxValue) * 100;
    const strokeDasharray = 2 * Math.PI * 45;
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

    return (
        <div style={{
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '15px',
            padding: '20px',
            backdropFilter: 'blur(10px)'
        }}>
            <h4 style={{ marginBottom: '15px', fontSize: '16px', opacity: 0.9 }}>{label}</h4>
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="8"
                    />
                    <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 60 60)"
                        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                    />
                </svg>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '20px',
                    fontWeight: '600'
                }}>
                    {value}{unit}
                </div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.8 }}>
                {percentage.toFixed(0)}%
            </div>
        </div>
    );
};

// Composant diagramme en secteurs (conditions météo)
export const WeatherPieChart = ({ weather }) => {
    if (!weather) return null;

    const conditions = [
        { name: 'Température', value: weather.main.temp, color: '#FF5722', max: 50 },
        { name: 'Humidité', value: weather.main.humidity, color: '#2196F3', max: 100 },
        { name: 'Pression', value: (weather.main.pressure - 950) / 100 * 100, color: '#4CAF50', max: 100 },
        { name: 'Vent', value: weather.wind.speed * 10, color: '#FFC107', max: 100 }
    ];

    return (
        <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '15px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            marginBottom: '20px'
        }}>
            <h4 style={{ marginBottom: '20px', fontSize: '16px', opacity: 0.9, textAlign: 'center' }}>
                Conditions actuelles
            </h4>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '15px'
            }}>
                {conditions.map((condition, index) => (
                    <div key={index} style={{
                        textAlign: 'center',
                        padding: '15px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '10px'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: condition.color,
                            margin: '0 auto 10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'white'
                        }}>
                            {condition.name === 'Température' ? `${Math.round(condition.value)}°` :
                                condition.name === 'Humidité' ? `${condition.value}%` :
                                    condition.name === 'Pression' ? `${weather.main.pressure}` :
                                        `${Math.round(weather.wind.speed * 3.6)}`}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            {condition.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
