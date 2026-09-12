import React from 'react';
import '../MinimalistStyles.css';
import {
    WiDaySunny, WiCloud, WiRain, WiSnow, WiFog
} from 'react-icons/wi';
import { FiCloudRain, FiSun, FiCloud, FiDroplet, FiWind, FiThermometer, FiEye, FiTrello, FiHeart } from 'react-icons/fi';
import CardRainEffect from './CardRainEffect';

const WeatherCardGlass = React.memo(({ weather, onToggleFavorite, isFavorite, convertTemp, getUnitSymbol, language }) => {
    if (!weather) return null;

    const isFav = typeof isFavorite === 'function' ? isFavorite(weather.name) : false;
    const safeConvertTemp = typeof convertTemp === 'function' ? convertTemp : (temp) => Math.round(temp);
    const safeGetUnitSymbol = typeof getUnitSymbol === 'function' ? getUnitSymbol : () => '°';
    const isRTL = language === 'ar';

    // Arabic translations for weather terms
    const arabicTranslations = {
        feelsLike: 'الإحساس',
        humidity: 'الرطوبة',
        wind: 'الرياح',
        pressure: 'الضغط',
        visibility: 'الرؤية',
        min: 'الأدنى',
        max: 'الأقصى',
        addToFavorites: 'إضافة إلى المفضلة',
        removeFromFavorites: 'إزالة من المفضلة'
    };

    // French translations
    const frenchTranslations = {
        feelsLike: 'Ressenti',
        humidity: 'Humidité',
        wind: 'Vent',
        pressure: 'Pression',
        visibility: 'Visibilité',
        min: 'Min',
        max: 'Max',
        addToFavorites: 'Ajouter aux favoris',
        removeFromFavorites: 'Retirer des favoris'
    };

    const weatherTranslations = isRTL ? arabicTranslations : frenchTranslations;

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
            <article className={`card ${isRTL ? 'rtl-card' : ''}`} aria-label={`Weather for ${weather.name}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {weather.weather[0].main.toLowerCase().includes('rain') && <CardRainEffect />}
                <div className="card-header">
                    <p className="city">{weather.name}, {weather.sys.country}</p>
                    <button
                        className="favorite-toggle-btn"
                        onClick={onToggleFavorite}
                        aria-label={isFav ? weatherTranslations.removeFromFavorites : weatherTranslations.addToFavorites}
                        aria-pressed={isFav}
                    >
                        <FiHeart
                            size="20px"
                            className={isFav ? "favorite-active" : "favorite-inactive"}
                        />
                    </button>
                </div>
                <p className="weather-desc" aria-label="Weather description">{weather.weather[0].description}</p>

                <div className="weather-icon-live" style={{ position: 'relative', top: 'auto', left: 'auto', margin: '10px 0' }} aria-hidden="true">
                    {getLiveIcon(weather.weather[0].id, "60px")}
                </div>

                <p className="temp" aria-label={`Temperature: ${safeConvertTemp(weather.main.temp)} ${safeGetUnitSymbol()}`}>{safeConvertTemp(weather.main.temp)}{safeGetUnitSymbol()}</p>

                <div className="advanced-metrics" role="list" aria-label="Weather metrics">
                    <div className="metric-item" role="listitem">
                        <FiThermometer className="m-icon" aria-hidden="true" />
                        <span className="m-label">{weatherTranslations.feelsLike}</span>
                        <span className="m-value" aria-label={`Feels like: ${safeConvertTemp(weather.main.feels_like)} ${safeGetUnitSymbol()}`}>{safeConvertTemp(weather.main.feels_like)}{safeGetUnitSymbol()}</span>
                    </div>
                    <div className="metric-item" role="listitem">
                        <FiDroplet className="m-icon" aria-hidden="true" />
                        <span className="m-label">{weatherTranslations.humidity}</span>
                        <span className="m-value" aria-label={`Humidity: ${weather.main.humidity} percent`}>{weather.main.humidity}%</span>
                    </div>
                    <div className="metric-item" role="listitem">
                        <FiWind className="m-icon" aria-hidden="true" />
                        <span className="m-label">{weatherTranslations.wind}</span>
                        <span className="m-value" aria-label={`Wind speed: ${Math.round(weather.wind.speed * 3.6)} kilometers per hour`}>{Math.round(weather.wind.speed * 3.6)} km/h</span>
                    </div>
                    <div className="metric-item" role="listitem">
                        <FiTrello className="m-icon" aria-hidden="true" />
                        <span className="m-label">{weatherTranslations.pressure}</span>
                        <span className="m-value description-text" aria-label={`Pressure: ${weather.main.pressure} hectopascals`}>{weather.main.pressure} hPa</span>
                    </div>
                    <div className="metric-item" role="listitem">
                        <FiEye className="m-icon" aria-hidden="true" />
                        <span className="m-label">{weatherTranslations.visibility}</span>
                        <span className="m-value" aria-label={`Visibility: ${(weather.visibility / 1000).toFixed(1)} kilometers`}>{(weather.visibility / 1000).toFixed(1)} km</span>
                    </div>
                </div>

                <div className="minmaxContainer">
                    <div className="min">
                        <p className="minHeading">{weatherTranslations.min}</p>
                        <p className="minTemp">{safeConvertTemp(weather.main.temp_min)}{safeGetUnitSymbol()}</p>
                    </div>
                    <div className="max">
                        <p className="maxHeading">{weatherTranslations.max}</p>
                        <p className="maxTemp">{safeConvertTemp(weather.main.temp_max)}{safeGetUnitSymbol()}</p>
                    </div>
                </div>
            </article>
        </div>
    );
});

WeatherCardGlass.displayName = 'WeatherCardGlass';

export default WeatherCardGlass;
