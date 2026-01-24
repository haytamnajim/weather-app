import React from 'react';
import '../MinimalistStyles.css'; // Ensure styles are available
import {
    WiDaySunny, WiCloud, WiRain, WiSnow, WiFog, WiDayCloudy, WiBarometer
} from 'react-icons/wi';
import { FiCloudRain, FiSun, FiCloud, FiDroplet, FiWind, FiThermometer } from 'react-icons/fi';

const WeatherAnimCard = ({ weather }) => {
    if (!weather) return null;

    // Function to get the correct icon component based on weather ID
    const getLiveIcon = (id, size = "60px") => {
        // Return React Icon component directly
        if (id >= 200 && id < 600) return <FiCloudRain size={size} color="#5c6a79" />;
        if (id >= 600 && id < 700) return <WiSnow size={size} color="#a0d2eb" />;
        if (id >= 700 && id < 800) return <WiFog size={size} color="#b0b0b0" />;
        if (id === 800) return <FiSun size={size} color="#fbbf24" />;
        return <FiCloud size={size} color="#9ca3af" />;
    };

    return (
        <div className="cardm">
            <div className="card">
                <div className="weather-icon-live">
                    {getLiveIcon(weather.weather[0].id, "80px")}
                </div>

                <div className="main">{Math.round(weather.main.temp)} °C</div>
                <div className="mainsub">{weather.name}, {weather.sys.country}</div>
            </div>

            <div className="card2">
                <div className="upper">
                    <div className="humidity">
                        <div className="humiditytext">Humidité<br />{weather.main.humidity}%</div>
                        <FiDroplet size="30px" color="#3b82f6" />
                    </div>

                    <div className="air">
                        <div className="airtext">Vent<br />{Math.round(weather.wind.speed * 3.6)} km/h</div>
                        <FiWind size="30px" color="#94a3b8" />
                    </div>
                </div>

                <div className="lower">
                    <div className="aqi">
                        <WiBarometer size="30px" color="#ef4444" />
                        <div className="aqitext">Pression<br />{weather.main.pressure}</div>
                    </div>

                    <div className="realfeel">
                        <FiThermometer size="30px" color="#f59e0b" />
                        <div className="realfeeltext">Ressenti<br />{Math.round(weather.main.feels_like)} °C</div>
                    </div>

                    <div className="pressure">
                        <WiDayCloudy size="30px" color="#8b5cf6" />
                        <div className="pressuretext">Météo<br />{weather.weather[0].description}</div>
                    </div>
                    <div className="card3">
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherAnimCard;
