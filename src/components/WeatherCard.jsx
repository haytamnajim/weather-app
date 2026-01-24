import React from 'react';
import { convertTemp } from '../utils/helpers';

const WeatherCard = ({ weather, cityName, t, unit = 'C' }) => {
    if (!weather) return null;

    return (
        <div className="cardContainer">
            <div className="card">
                <p className="city">{cityName}</p>
                <p className="weather">{weather.weather[0].description}</p>

                <p className="temp">
                    {convertTemp(weather.main.temp, unit)}°
                </p>

                <div className="minmaxContainer">
                    <div className="min">
                        <p className="minHeading">{t.min || 'Min'}</p>
                        <p className="minTemp">{convertTemp(weather.main.temp_min, unit)}°</p>
                    </div>
                    <div className="max">
                        <p className="maxHeading">{t.max || 'Max'}</p>
                        <p className="maxTemp">{convertTemp(weather.main.temp_max, unit)}°</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
