import React from 'react';
import '../MinimalistStyles.css';
import {
    WiDaySunny, WiCloud, WiRain, WiSnow, WiFog
} from 'react-icons/wi';
import { FiCloudRain, FiSun, FiCloud, FiDroplet, FiWind, FiThermometer } from 'react-icons/fi';

const WeatherCardGlass = ({ weather }) => {
    if (!weather) return null;

    // Function to get the correct icon component based on weather ID
    const getLiveIcon = (id, size = "60px") => {
        if (id >= 200 && id < 600) return <FiCloudRain size={size} color="#a0d2eb" />;
        if (id >= 600 && id < 700) return <WiSnow size={size} color="#e2e8f0" />;
        if (id >= 700 && id < 800) return <WiFog size={size} color="#cbd5e1" />;
        if (id === 800) return <FiSun size={size} color="#fcd34d" />;
        return <FiCloud size={size} color="#94a3b8" />;
    };

    return (
        <div className="cardContainer">
            <div className="card">
                <p className="city">{weather.name}, {weather.sys.country}</p>
                <p className="weather-desc">{weather.weather[0].description}</p>

                <div className="weather-icon-live" style={{ position: 'relative', top: 'auto', left: 'auto', margin: '10px 0' }}>
                    {getLiveIcon(weather.weather[0].id, "80px")}
                </div>

                <p className="temp">{Math.round(weather.main.temp)}°</p>

                <div className="minmaxContainer">
                    <div className="min">
                        <p class="minHeading">Min</p>
                        <p class="minTemp">{Math.round(weather.main.temp_min)}°</p>
                    </div>
                    <div className="max">
                        <p class="maxHeading">Max</p>
                        <p class="maxTemp">{Math.round(weather.main.temp_max)}°</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCardGlass;
