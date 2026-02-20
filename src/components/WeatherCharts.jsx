import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

const WeatherCharts = ({ forecast, isDarkMode }) => {
    if (!forecast) return null;

    // Format data for the next 8 intervals (approx 24 hours)
    const chartData = forecast.list.slice(0, 8).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
    }));

    const textColor = isDarkMode ? '#e2e8f0' : '#1e293b';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    return (
        <div className="charts-container glass">
            <div className="chart-wrapper">
                <h3 className="chart-title">Température (°C)</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke={textColor}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke={textColor}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                border: 'none',
                                borderRadius: '10px',
                                color: textColor
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#0ea5e9"
                            fillOpacity={1}
                            fill="url(#colorTemp)"
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-wrapper">
                <h3 className="chart-title">Humidité (%)</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke={textColor}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke={textColor}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                                border: 'none',
                                borderRadius: '10px',
                                color: textColor
                            }}
                            cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                        />
                        <Bar dataKey="humidity" radius={[5, 5, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="#38bdf8" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WeatherCharts;
