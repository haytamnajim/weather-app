import React, { useState, useEffect } from 'react';
import './MinimalistStyles.css';
import { useWeather } from './hooks/useWeather';
import Loader from './components/Loader';
import SearchBox from './components/SearchBox';
import ForecastSection from './components/ForecastSection';
import WeatherCardGlass from './components/WeatherCardGlass';
import WeatherCharts from './components/WeatherCharts';
import RainEffect from './components/RainEffect';
import ChatWidget from './components/ChatWidget';

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

        <button
          className={`theme-toggle-btn ${isDarkMode ? 'is-dark' : 'is-light'}`}
          onClick={() => setIsDarkMode(!isDarkMode)}
          aria-label="Toggle dark mode"
        >
          <span className="theme-toggle-track">
            <span className="theme-toggle-thumb">
              {/* Sun rays */}
              <svg className="theme-icon sun-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" fill="currentColor"/>
                <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="19.78" y1="4.22" x2="17.66" y2="6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="6.34" y1="17.66" x2="4.22" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {/* Moon */}
              <svg className="theme-icon moon-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
              </svg>
            </span>
          </span>
        </button>
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
