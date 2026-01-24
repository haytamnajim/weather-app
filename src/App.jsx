import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './MinimalistStyles.css'
import WeatherCardGlass from './components/WeatherCardGlass'
import {
  WiDaySunny, WiCloud, WiRain, WiSnow, WiFog
} from 'react-icons/wi'
import { FiSearch, FiSun, FiCloud, FiCloudRain } from 'react-icons/fi'

function App() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const API_KEY = '346871855ae2ee3d144f3306bff7579d'

  const fetchData = async (cityName) => {
    if (!cityName) return;
    setLoading(true)
    setError('')
    try {
      const wUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},MA&appid=${API_KEY}&units=metric&lang=fr`;
      const fUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},MA&appid=${API_KEY}&units=metric&lang=fr`;

      const [wRes, fRes] = await Promise.all([
        axios.get(wUrl),
        axios.get(fUrl)
      ])

      setWeather(wRes.data)
      setForecast(fRes.data)
    } catch (err) {
      setError('Ville non trouvée')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData('Casablanca')
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (input.trim()) {
      fetchData(input.trim())
      setInput('')
    }
  }

  const getWeatherIcon = (id, size = "1em") => {
    if (id >= 200 && id < 600) return <FiCloudRain size={size} />;
    if (id >= 600 && id < 700) return <WiSnow size={size} />;
    if (id >= 700 && id < 800) return <WiFog size={size} />;
    if (id === 800) return <FiSun size={size} />;
    return <FiCloud size={size} />;
  }

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

      <div className="search-container">
        <form className="searchBox" onSubmit={handleSearch}>
          <input
            className="searchInput"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chercher une ville..."
          />
          <button className="searchButton" type="submit">
            <FiSearch size="20px" />
          </button>
        </form>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loader">Chargement...</div>
      ) : (
        <main className="content">
          {weather && <WeatherCardGlass weather={weather} />}

          {forecast && (
            <section className="forecast-section">
              <h3 className="forecast-title">Prévisions</h3>
              <div className="forecast-list">
                {forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5).map((day, idx) => (
                  <div key={idx} className="forecast-item">
                    <span className="day">{new Date(day.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'long' })}</span>
                    <span className="f-icon">{getWeatherIcon(day.weather[0].id, "25px")}</span>
                    <span className="f-temp">{Math.round(day.main.temp)}°</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      )}
    </div>
  )
}

export default App
