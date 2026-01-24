import React, { useState, useEffect, useMemo, useCallback } from 'react'
import axios from 'axios'
import './ProWeatherStyles.css'

// Icons
import { WiDaySunny, WiSunrise, WiSunset, WiBarometer, WiStrongWind } from 'react-icons/wi'
import {
  FiSearch, FiMapPin, FiHome, FiStar, FiBarChart2,
  FiBell, FiSettings, FiDroplet, FiThermometer,
  FiAlertTriangle, FiCalendar, FiClock
} from 'react-icons/fi'

// Constants and Utils
import { API_KEY, WEATHER_URL, FORECAST_URL, moroccanCities, translations } from './utils/constants'
import {
  getWeatherIcon, convertTemp, getPrayerTimes,
  getBackgroundColor, createTemperatureChartData, createWeeklyChartData
} from './utils/helpers'

// Components
import { SimpleBarChart, SimpleLineChart, CircularGauge, WeatherPieChart } from './components/WeatherCharts'
import WeatherCard from './components/WeatherCard'

function App() {
  // États principaux
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [selectedCity, setSelectedCity] = useState('Casablanca')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('home')
  const [favorites, setFavorites] = useState(['Casablanca', 'Rabat', 'Marrakech'])
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('fr')
  const [temperatureUnit, setTemperatureUnit] = useState('C')

  // Memoized translations
  const t = useMemo(() => translations[language] || translations.fr, [language])

  // Memoized chart data
  const temperatureChartData = useMemo(() => createTemperatureChartData(forecast), [forecast])
  const weeklyChartData = useMemo(() => createWeeklyChartData(forecast, language === 'ar' ? 'ar-MA' : 'fr-FR'), [forecast, language])
  const prayerTimes = useMemo(() => {
    if (!weather) return null
    const times = getPrayerTimes(weather.sys.sunrise, weather.sys.sunset)
    return Object.entries(times).map(([prayer, date]) => ({
      prayer,
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }))
  }, [weather])

  // Fonctions API
  const fetchWeather = useCallback(async (cityName) => {
    setLoading(true)
    setError('')

    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get(WEATHER_URL, {
          params: {
            q: `${cityName},MA`,
            appid: API_KEY,
            units: 'metric',
            lang: language === 'ar' ? 'ar' : 'fr'
          }
        }),
        axios.get(FORECAST_URL, {
          params: {
            q: `${cityName},MA`,
            appid: API_KEY,
            units: 'metric',
            lang: language === 'ar' ? 'ar' : 'fr'
          }
        })
      ])

      setWeather(weatherResponse.data)
      setForecast(forecastResponse.data)
    } catch (err) {
      setError(t.error || 'Erreur de connexion')
      setWeather(null)
      setForecast(null)
    } finally {
      setLoading(false)
    }
  }, [language, t.error])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const response = await axios.get(WEATHER_URL, {
              params: {
                lat: latitude,
                lon: longitude,
                appid: API_KEY,
                units: 'metric',
                lang: language === 'ar' ? 'ar' : 'fr'
              }
            })
            setSelectedCity(response.data.name)
            fetchWeather(response.data.name)
          } catch (err) {
            setError(t.error || 'Erreur de géolocalisation')
            setLoading(false)
          }
        },
        () => {
          setError('Géolocalisation refusée')
          setLoading(false)
        }
      )
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSelectedCity(searchQuery.trim())
      fetchWeather(searchQuery.trim())
      setSearchQuery('')
      setShowSearch(false)
    }
  }

  const toggleFavorite = (cityName) => {
    setFavorites(prev =>
      prev.includes(cityName)
        ? prev.filter(city => city !== cityName)
        : [...prev, cityName]
    )
  }

  // Charger la météo au démarrage
  useEffect(() => {
    fetchWeather('Casablanca')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`weather-app ${darkMode ? 'dark-mode' : ''}`} style={{ background: getBackgroundColor(weather?.weather[0].icon, weather?.main.temp, darkMode) }}>

      {/* Header professionnel */}
      <header className="weather-header">
        <div className="weather-header__logo">
          <WiDaySunny />
          <span>{t.title}</span>
        </div>

        <div className="weather-header__location">
          <div className="weather-header__city">{selectedCity}</div>
          <div className="weather-header__country">Maroc</div>
        </div>

        <div className="weather-header__actions">
          <button
            className="btn btn-icon"
            onClick={() => setShowSearch(!showSearch)}
            title={t.search}
          >
            <FiSearch />
          </button>
          <button
            className="btn btn-icon"
            onClick={getCurrentLocation}
            disabled={loading}
            title={t.myLocation}
          >
            <FiMapPin />
          </button>
        </div>
      </header>

      {/* Barre de recherche */}
      {showSearch && (
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="search-input"
              autoFocus
            />
            <button type="submit" className="btn btn-primary">
              {t.search?.split(' ')[0] || 'Rechercher'}
            </button>
          </form>
        </div>
      )}

      {/* Contenu principal */}
      <main className="weather-content">

        {/* Onglet Accueil */}
        {activeTab === 'home' && (
          <>
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">{t.loading}</div>
              </div>
            )}

            {weather && !loading && (
              <WeatherCard
                weather={weather}
                cityName={selectedCity}
                t={t}
                unit={temperatureUnit}
              />
            )}

            {weather && !loading && (
              <div className="weather-main-card">
                <div>
                  <div className="weather-icon-main">
                    {React.createElement(getWeatherIcon(weather.weather[0].icon))}
                  </div>
                  <div className="weather-temperature">
                    {convertTemp(weather.main.temp, temperatureUnit)}°{temperatureUnit}
                  </div>
                  <div className="weather-description">
                    {weather.weather[0].description}
                  </div>

                  {weather.main.temp > 35 && (
                    <div className="weather-alert">
                      <FiAlertTriangle style={{ marginRight: 8 }} /> {t.heatWarning}
                    </div>
                  )}
                </div>

                <div className="weather-details-grid">
                  <div className="weather-detail-card">
                    <div className="weather-detail-icon"><FiThermometer /></div>
                    <div className="weather-detail-value">
                      {convertTemp(weather.main.feels_like, temperatureUnit)}°{temperatureUnit}
                    </div>
                    <div className="weather-detail-label">{t.feelsLike}</div>
                  </div>

                  <div className="weather-detail-card">
                    <div className="weather-detail-icon"><FiDroplet /></div>
                    <div className="weather-detail-value">{weather.main.humidity}%</div>
                    <div className="weather-detail-label">{t.humidity}</div>
                  </div>

                  <div className="weather-detail-card">
                    <div className="weather-detail-icon"><WiStrongWind /></div>
                    <div className="weather-detail-value">{Math.round(weather.wind.speed * 3.6)} km/h</div>
                    <div className="weather-detail-label">{t.wind}</div>
                  </div>

                  <div className="weather-detail-card">
                    <div className="weather-detail-icon"><WiBarometer /></div>
                    <div className="weather-detail-value">{weather.main.pressure} hPa</div>
                    <div className="weather-detail-label">{t.pressure}</div>
                  </div>
                </div>

                <div className="sun-times">
                  <div className="sun-time">
                    <div className="sun-time-icon"><WiSunrise /></div>
                    <div className="sun-time-value">
                      {new Date(weather.sys.sunrise * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="sun-time-label">{t.sunrise}</div>
                  </div>
                  <div className="sun-time">
                    <div className="sun-time-icon"><WiSunset /></div>
                    <div className="sun-time-value">
                      {new Date(weather.sys.sunset * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="sun-time-label">{t.sunset}</div>
                  </div>
                </div>
              </div>
            )}

            {forecast && !loading && (
              <>
                <section className="weather-section">
                  <h3 className="weather-section-title">
                    <FiClock style={{ marginRight: 8 }} /> {t.nextHours}
                  </h3>
                  <div className="hourly-forecast">
                    {forecast.list.slice(0, 8).map((item, index) => (
                      <div key={index} className="hourly-item">
                        <div className="hourly-time">
                          {new Date(item.dt * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit' })}h
                        </div>
                        <div className="hourly-icon">
                          {React.createElement(getWeatherIcon(item.weather[0].icon))}
                        </div>
                        <div className="hourly-temp">
                          {convertTemp(item.main.temp, temperatureUnit)}°
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="weather-section">
                  <h3 className="weather-section-title">
                    <FiCalendar style={{ marginRight: 8 }} /> {t.nextDays}
                  </h3>
                  <div className="daily-forecast">
                    {forecast.list.filter((_, index) => index % 8 === 0).slice(0, 5).map((item, index) => (
                      <div key={index} className="daily-item">
                        <div className="daily-day">
                          {index === 0 ? t.today : new Date(item.dt * 1000).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', { weekday: 'long' })}
                        </div>
                        <div className="daily-weather">
                          <div className="daily-icon">
                            {React.createElement(getWeatherIcon(item.weather[0].icon))}
                          </div>
                        </div>
                        <div className="daily-temps">
                          <span className="daily-temp-max">{convertTemp(item.main.temp_max, temperatureUnit)}°</span>
                          <span className="daily-temp-min">{convertTemp(item.main.temp_min, temperatureUnit)}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {prayerTimes && !loading && (
              <section className="weather-section">
                <h3 className="weather-section-title">
                  <FiClock style={{ marginRight: 8 }} /> {t.prayerTimes}
                </h3>
                <div className="prayer-times">
                  {prayerTimes.map(({ prayer, time }) => (
                    <div key={prayer} className="prayer-item">
                      <div className="prayer-name">{prayer.charAt(0).toUpperCase() + prayer.slice(1)}</div>
                      <div className="prayer-time">{time}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Onglet Favoris */}
        {activeTab === 'favorites' && (
          <div style={{ padding: '30px 20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>⭐ {t.favorites}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '30px' }}>
              {favorites.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city)
                    fetchWeather(city)
                    setActiveTab('home')
                  }}
                  className="favorite-city-btn"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '20px',
                    color: 'white',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>{city}</div>
                  <small style={{ opacity: 0.8 }}>{moroccanCities.find(c => c.name === city)?.arabicName}</small>
                </button>
              ))}
            </div>

            <h3 style={{ marginBottom: '20px', opacity: 0.9 }}>{t.allCities}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {moroccanCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => {
                    setSelectedCity(city.name)
                    fetchWeather(city.name)
                    setActiveTab('home')
                  }}
                  style={{
                    backgroundColor: selectedCity === city.name ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '15px 10px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div style={{ fontWeight: '600' }}>{city.name}</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>{city.arabicName}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Onglet Graphiques */}
        {activeTab === 'charts' && (
          <div style={{ padding: '30px 20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📊 {t.charts}</h2>

            {forecast && weather ? (
              <>
                <WeatherPieChart weather={weather} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '30px' }}>
                  <CircularGauge value={weather.main.humidity} maxValue={100} color="#2196F3" label={t.humidity} unit="%" />
                  <CircularGauge value={Math.round(weather.wind.speed * 3.6)} maxValue={100} color="#FFC107" label={t.wind} unit=" km/h" />
                </div>

                <SimpleLineChart data={temperatureChartData} dataKey="temp" color="#FF5722" height={120} label={t.temperatureTrend || 'Température'} />
                <SimpleLineChart data={temperatureChartData} dataKey="humidity" color="#2196F3" height={120} label={t.humidityTrend || 'Humidité'} />
                <SimpleLineChart data={temperatureChartData} dataKey="pressure" color="#4CAF50" height={120} label={t.pressureTrend || 'Pression'} />
                <SimpleBarChart data={temperatureChartData} dataKey="wind" color="#FFC107" height={120} label={t.windTrend || 'Vent'} />

                <div style={{ marginTop: '30px' }}>
                  <h4 style={{ marginBottom: '15px', fontSize: '16px', opacity: 0.9 }}>{t.weeklyTemperature}</h4>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', padding: '20px', backdropFilter: 'blur(10px)' }}>
                    {weeklyChartData.map((day, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 0',
                        borderBottom: index < weeklyChartData.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none'
                      }}>
                        <div style={{ fontWeight: '600', minWidth: '60px' }}>{day.day}</div>
                        <div style={{ flex: 1, margin: '0 15px', height: '20px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.min((day.maxTemp / 50) * 100, 100)}%`, background: 'linear-gradient(90deg, #FF5722, #FFC107)', borderRadius: '10px' }}></div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', minWidth: '80px', justifyContent: 'flex-end' }}>
                          <span style={{ fontWeight: '600' }}>{day.maxTemp}°</span>
                          <span style={{ opacity: 0.7 }}>{day.minTemp}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>📊</div>
                <p style={{ opacity: 0.8 }}>Chargez les données météo pour voir les graphiques</p>
              </div>
            )}
          </div>
        )}

        {/* Onglet Alertes */}
        {activeTab === 'alerts' && (
          <div style={{ padding: '30px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '400px' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔔</div>
            <h2 style={{ marginBottom: '20px' }}>{t.alerts}</h2>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '30px', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
              <p style={{ marginBottom: '15px', opacity: 0.8 }}>{t.noAlerts}</p>
              <small style={{ opacity: 0.6 }}>Les alertes apparaîtront ici</small>
            </div>
          </div>
        )}

        {/* Onglet Paramètres */}
        {activeTab === 'settings' && (
          <div style={{ padding: '30px 20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>⚙️ {t.settings}</h2>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '15px', padding: '20px', backdropFilter: 'blur(10px)', marginBottom: '20px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>🌐 {t.language}</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', fontSize: '16px', backgroundColor: 'rgba(255,255,255,0.9)', color: '#333' }}>
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>🌡️ {t.tempUnit}</label>
                <select value={temperatureUnit} onChange={(e) => setTemperatureUnit(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', fontSize: '16px', backgroundColor: 'rgba(255,255,255,0.9)', color: '#333' }}>
                  <option value="C">Celsius (°C)</option>
                  <option value="F">Fahrenheit (°F)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
                  <span>🌙 {t.darkMode}</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navigation inférieure */}
      <nav className="bottom-nav">
        <div className="nav-items">
          {[
            { id: 'home', icon: <FiHome />, label: t.home },
            { id: 'favorites', icon: <FiStar />, label: t.favorites },
            { id: 'charts', icon: <FiBarChart2 />, label: t.charts },
            { id: 'alerts', icon: <FiBell />, label: t.alerts },
            { id: 'settings', icon: <FiSettings />, label: t.settings }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <div className="nav-icon">{item.icon}</div>
              <div className="nav-label">{item.label}</div>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default App
