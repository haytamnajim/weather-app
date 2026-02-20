import React from 'react';
import '../MinimalistStyles.css';
import {
    WiDaySunny, WiCloud, WiRain, WiSnow, WiFog
} from 'react-icons/wi';
import { FiCloudRain, FiSun, FiCloud, FiDroplet, FiWind, FiThermometer, FiEye, FiTrello } from 'react-icons/fi';
import CardRainEffect from './CardRainEffect';

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
                {weather.weather[0].main.toLowerCase().includes('rain') && <CardRainEffect />}
                <p className="city">{weather.name}, {weather.sys.country}</p>
                <p className="weather-desc">{weather.weather[0].description}</p>

                <div className="weather-icon-live" style={{ position: 'relative', top: 'auto', left: 'auto', margin: '10px 0' }}>
                    {getLiveIcon(weather.weather[0].id, "80px")}
                </div>

                <p className="temp">{Math.round(weather.main.temp)}°</p>

                <div className="advanced-metrics">
                    <div className="metric-item">
                        <FiThermometer className="m-icon" />
                        <span className="m-label">Ressenti</span>
                        <span className="m-value">{Math.round(weather.main.feels_like)}°</span>
                    </div>
                    <div className="metric-item">
                        <FiDroplet className="m-icon" />
                        <span className="m-label">Humidité</span>
                        <span className="m-value">{weather.main.humidity}%</span>
                    </div>
                    <div className="metric-item">
                        <FiWind className="m-icon" />
                        <span className="m-label">Vent</span>
                        <span className="m-value">{Math.round(weather.wind.speed * 3.6)} km/h</span>
                    </div>
                    <div className="metric-item">
                        <FiTrello className="m-icon" />
                        <span className="m-label">Pression</span>
                        <span className="m-value description-text">{weather.main.pressure} hPa</span>
                    </div>
                    <div className="metric-item">
                        <FiEye className="m-icon" />
                        <span className="m-label">Visibilité</span>
                        <span className="m-value">{(weather.visibility / 1000).toFixed(1)} km</span>
                    </div>
                </div>

                <div className="minmaxContainer">
                    <div className="min">
                        <p className="minHeading">Min</p>
                        <p className="minTemp">{Math.round(weather.main.temp_min)}°</p>
                    </div>
                    <div className="max">
                        <p className="maxHeading">Max</p>
                        <p className="maxTemp">{Math.round(weather.main.temp_max)}°</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCardGlass;
