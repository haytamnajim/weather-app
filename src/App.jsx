import { useState, useEffect } from 'react'
import axios from 'axios'
import './MinimalistStyles.css'

function App() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [city, setCity] = useState('Casablanca')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_KEY = '346871855ae2ee3d144f3306bff7579d'

  const fetchData = async (cityName) => {
    setLoading(true)
    setError('')
    try {
      const [wRes, fRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName},MA&appid=${API_KEY}&units=metric&lang=fr`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName},MA&appid=${API_KEY}&units=metric&lang=fr`)
      ])
      setWeather(wRes.data)
      setForecast(fRes.data)
    } catch (err) {
      setError('Ville non trouvée ou erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(city)
  }, []) // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault()
    if (input.trim()) {
      setCity(input.trim())
      fetchData(input.trim())
      setInput('')
    }
  }

  return (
    <div className="fast-app">
      <header>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '800' }}>Fast Weather</h1>
      </header>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Chercher une ville au Maroc..."
        />
        <button type="submit">OK</button>
      </form>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loader">Chargement...</div>
      ) : (
        <>
          {weather && (
            <div className="main-weather">
              <h2 className="city-name">{weather.name}</h2>
              <p className="desc">{weather.weather[0].description}</p>
              <div className="temp-large">{Math.round(weather.main.temp)}°C</div>

              <div className="details">
                <div className="detail-item">
                  <span className="detail-label">Ressenti</span>
                  <span className="detail-val">{Math.round(weather.main.feels_like)}°</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Humidité</span>
                  <span className="detail-val">{weather.main.humidity}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Vent</span>
                  <span className="detail-val">{Math.round(weather.wind.speed * 3.6)} km/h</span>
                </div>
              </div>
            </div>
          )}

          {forecast && (
            <div className="forecast-section">
              <h3 className="forecast-title">Prévisions 5 jours</h3>
              <div className="forecast-list">
                {forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5).map((day, idx) => (
                  <div key={idx} className="forecast-item">
                    <span className="day">
                      {new Date(day.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'long' })}
                    </span>
                    <span style={{ flex: 1, textAlign: 'center', fontSize: '0.9em', color: '#64748b' }}>
                      {day.weather[0].description}
                    </span>
                    <span className="f-temp">{Math.round(day.main.temp)}°C</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App
