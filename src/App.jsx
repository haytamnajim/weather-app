import React, { useState, useEffect } from 'react';
import './MinimalistStyles.css';
import { useWeather } from './hooks/useWeather';
import Loader from './components/Loader';
import SearchBox from './components/SearchBox';
import ForecastSection from './components/ForecastSection';
import WeatherCardGlass from './components/WeatherCardGlass';
import WeatherCharts from './components/WeatherCharts';
import RainEffect from './components/RainEffect';

function App() {
  const {
    weather,
    forecast,
    loading,
    error,
    fetchWeather
  } = useWeather('Casablanca');

  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className={`fast-app ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header-top">
        <h1>Météo Maroc</h1>

        <div className="toggleWrapper">
          <input
            className="input"
            id="dn"
            type="checkbox"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
          />
          <label className="toggle" htmlFor="dn">
            <span className="toggle__handler">
              <span className="crater crater--1"></span>
              <span className="crater crater--2"></span>
              <span className="crater crater--3"></span>
            </span>
            <span className="star star--1"></span>
            <span className="star star--2"></span>
            <span className="star star--3"></span>
            <span className="star star--4"></span>
            <span className="star star--5"></span>
            <span className="star star--6"></span>
          </label>
        </div>
      </div>

      <SearchBox onSearch={fetchWeather} />

      {weather && weather.weather[0].main.toLowerCase().includes('rain') && <RainEffect />}

      {error && <div className="error">{error}</div>}

      {loading ? (
        <Loader />
      ) : (
        <main className="content">
          <div className="main-weather-col">
            {weather && <WeatherCardGlass weather={weather} />}
          </div>

          <ForecastSection forecast={forecast} />

          {forecast && <WeatherCharts forecast={forecast} isDarkMode={isDarkMode} />}
        </main>
      )}

      <ChatWidget weather={weather} onCityChange={fetchWeather} />
    </div>
  );
}

export default App;
