import React, { useMemo } from 'react';
import { WiSnow, WiFog } from 'react-icons/wi';
import { FiCloudRain, FiSun, FiCloud } from 'react-icons/fi';

const ForecastSection = React.memo(({ forecast, convertTemp, getUnitSymbol }) => {
  if (!forecast) return null;

  const getWeatherIcon = (id, size = "1em") => {
    if (id >= 200 && id < 600) return <FiCloudRain size={size} />;
    if (id >= 600 && id < 700) return <WiSnow size={size} />;
    if (id >= 700 && id < 800) return <WiFog size={size} />;
    if (id === 800) return <FiSun size={size} />;
    return <FiCloud size={size} />;
  };

  const safeConvertTemp = typeof convertTemp === 'function' ? convertTemp : (temp) => Math.round(temp);
  const safeGetUnitSymbol = typeof getUnitSymbol === 'function' ? getUnitSymbol : () => '°';

  const processedData = useMemo(() => {
    const dailyData = [];
    const days = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'long' });
      if (!days[date]) {
        days[date] = {
          dt: item.dt,
          temp_min: item.main.temp,
          temp_max: item.main.temp,
          icon: item.weather[0].id
        };
        dailyData.push(days[date]);
      } else {
        days[date].temp_min = Math.min(days[date].temp_min, item.main.temp);
        days[date].temp_max = Math.max(days[date].temp_max, item.main.temp);
      }
    });

    const slicedData = dailyData.slice(0, 5);
    const globalMin = Math.min(...slicedData.map(d => d.temp_min));
    const globalMax = Math.max(...slicedData.map(d => d.temp_max));
    const totalRange = globalMax - globalMin;

    return { slicedData, globalMin, globalMax, totalRange };
  }, [forecast]);

  const { slicedData, globalMin, globalMax, totalRange } = processedData;

  return (
    <section className="forecast-section" aria-label="Weather forecast">
      <h3 className="forecast-title">Prévisions</h3>
      <div className="forecast-list" role="list">
        {slicedData.map((day, idx) => {
          const left = ((day.temp_min - globalMin) / totalRange) * 100;
          const width = ((day.temp_max - day.temp_min) / totalRange) * 100;
          const dayName = idx === 0 ? "Aujourd'hui" : new Date(day.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short' });

          return (
            <div key={idx} className="forecast-item" role="listitem" aria-label={`${dayName}: Low ${safeConvertTemp(day.temp_min)}${safeGetUnitSymbol()}, High ${safeConvertTemp(day.temp_max)}${safeGetUnitSymbol()}`}>
              <span className="day">
                {dayName}
              </span>
              <span className="f-icon" aria-hidden="true">{getWeatherIcon(day.icon, "22px")}</span>
              <span className="f-temp low" aria-label={`Low temperature: ${safeConvertTemp(day.temp_min)}${safeGetUnitSymbol()}`}>{safeConvertTemp(day.temp_min)}{safeGetUnitSymbol()}</span>
              <div className="temp-bar-container" aria-hidden="true">
                <div className="temp-bar-bg"></div>
                <div
                  className="temp-bar-fill"
                  style={{
                    left: `${left}%`,
                    width: `${Math.max(width, 5)}%`
                  }}
                ></div>
              </div>
              <span className="f-temp high" aria-label={`High temperature: ${safeConvertTemp(day.temp_max)}${safeGetUnitSymbol()}`}>{safeConvertTemp(day.temp_max)}{safeGetUnitSymbol()}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
});

ForecastSection.displayName = 'ForecastSection';

export default ForecastSection;
