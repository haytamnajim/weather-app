import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './MinimalistStyles.css'
import {
  WiDaySunny, WiCloud, WiRain, WiSnow, WiFog
} from 'react-icons/wi'
import { FiSearch, FiThermometer, FiDroplet, FiWind } from 'react-icons/fi'

function App() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      setError('Ville non trouvée au Maroc')
      console.error(err)
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
    if (id >= 200 && id < 600) return <WiRain size={size} />;
    if (id >= 600 && id < 700) return <WiSnow size={size} />;
    if (id >= 700 && id < 800) return <WiFog size={size} />;
    if (id === 800) return <WiDaySunny size={size} />;
    return <WiCloud size={size} />;
  }

  return (
    <div className="fast-app">
      <header>
        <h1 style={{ color: 'white', textAlign: 'center', fontWeight: '800' }}>Météo Maroc</h1>
      </header>

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
        <div className="loader" style={{ textAlign: 'center', color: 'white', padding: '40px' }}>Chargement en cours...</div>
      ) : (
        <main className="content">
          {weather && weather.weather && (
            <section className="main-weather">
              <div className="weather-icon-top">
                {getWeatherIcon(weather.weather[0].id, "100px")}
              </div>
              <h2 className="city-name">{weather.name}</h2>
              <p className="desc">{weather.weather[0].description}</p>
              <div className="temp-large">{Math.round(weather.main.temp)}°</div>

              <div className="details">
                <div className="detail-item">
                  <span className="detail-label"><FiThermometer /> Ressenti</span>
                  <span className="detail-val">{Math.round(weather.main.feels_like)}°</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FiDroplet /> Humidité</span>
                  <span className="detail-val">{weather.main.humidity}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FiWind /> Vent</span>
                  <span className="detail-val">{Math.round(weather.wind.speed * 3.6)} km/h</span>
                </div>
              </div>
            </section>
          )}

          {forecast && forecast.list && (
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
