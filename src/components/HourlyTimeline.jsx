import React from 'react';
import { getWeatherIcon } from '../utils/helpers';
import { WiRaindrop } from 'react-icons/wi';

const HourlyTimeline = ({ forecast, unit = 'C', convertTemp, language = 'fr' }) => {
  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return null;
  }

  // Récupérer les 8 prochaines tranches de 3 heures (24h de prévisions)
  const hourlyData = forecast.list.slice(0, 8).map((item) => {
    const date = new Date(item.dt * 1000);
    const hour = date.getHours().toString().padStart(2, '0') + ':00';
    const temp = Math.round(convertTemp(item.main.temp, unit));
    const iconCode = item.weather[0]?.icon;
    const WeatherIcon = getWeatherIcon(iconCode);
    const description = item.weather[0]?.description || '';
    const pop = Math.round((item.pop || 0) * 100); // Probabilité de pluie

    return {
      dt: item.dt,
      hour,
      temp,
      WeatherIcon,
      description,
      pop
    };
  });

  const titles = {
    fr: 'Prévisions heure par heure',
    en: 'Hourly Forecast',
    ar: 'التوقعات بالساعة'
  };

  return (
    <div className="hourly-timeline-container glass-panel">
      <div className="hourly-timeline-header">
        <span className="hourly-badge">24H</span>
        <h3>{titles[language] || titles.fr}</h3>
      </div>
      <div className="hourly-scroll-track">
        {hourlyData.map((item, index) => {
          const Icon = item.WeatherIcon;
          const isNow = index === 0;

          return (
            <div 
              key={item.dt} 
              className={`hourly-card ${isNow ? 'is-current' : ''}`}
            >
              <span className="hourly-time">
                {isNow ? (language === 'ar' ? 'الآن' : 'Maintenant') : item.hour}
              </span>
              <div className="hourly-icon-wrap">
                <Icon size={34} className="hourly-weather-icon" />
              </div>
              <span className="hourly-temp">{item.temp}°{unit}</span>
              {item.pop > 10 ? (
                <div className="hourly-rain-pop">
                  <WiRaindrop size={18} />
                  <span>{item.pop}%</span>
                </div>
              ) : (
                <div className="hourly-rain-pop empty">
                  <span>-</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyTimeline;
