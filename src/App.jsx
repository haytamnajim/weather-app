import { useState, useEffect } from 'react'
import axios from 'axios'

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

  // Configuration API
  const API_KEY = '346871855ae2ee3d144f3306bff7579d'
  const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
  const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

  // Villes du Maroc
  const moroccanCities = [
    { name: 'Casablanca', arabicName: 'الدار البيضاء' },
    { name: 'Rabat', arabicName: 'الرباط' },
    { name: 'Marrakech', arabicName: 'مراكش' },
    { name: 'Fes', arabicName: 'فاس' },
    { name: 'Tangier', arabicName: 'طنجة' },
    { name: 'Agadir', arabicName: 'أكادير' },
    { name: 'Meknes', arabicName: 'مكناس' },
    { name: 'Oujda', arabicName: 'وجدة' },
    { name: 'Kenitra', arabicName: 'القنيطرة' },
    { name: 'Tetouan', arabicName: 'تطوان' }
  ]

  // Traductions
  const translations = {
    fr: {
      title: 'Météo du Maroc',
      search: 'Rechercher...',
      myLocation: 'Ma position',
      home: 'Accueil',
      favorites: 'Favoris',
      alerts: 'Alertes',
      settings: 'Paramètres',
      feelsLike: 'Ressenti',
      humidity: 'Humidité',
      wind: 'Vent',
      pressure: 'Pression',
      nextHours: 'Prochaines heures',
      nextDays: 'Prochains jours',
      today: 'Aujourd\'hui'
    },
    ar: {
      title: 'طقس المغرب',
      search: 'البحث...',
      myLocation: 'موقعي',
      home: 'الرئيسية',
      favorites: 'المفضلة',
      alerts: 'التنبيهات',
      settings: 'الإعدادات',
      feelsLike: 'يشعر وكأنه',
      humidity: 'الرطوبة',
      wind: 'الرياح',
      pressure: 'الضغط',
      nextHours: 'الساعات القادمة',
      nextDays: 'الأيام القادمة',
      today: 'اليوم'
    }
  }

  const t = translations[language] || translations.fr

  // Fonctions utilitaires
  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '🌤️', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    }
    return iconMap[iconCode] || '☀️'
  }

  const convertTemp = (temp) => {
    if (temperatureUnit === 'F') {
      return Math.round((temp * 9/5) + 32)
    }
    return Math.round(temp)
  }

  const getBackgroundColor = (iconCode, temp) => {
    if (darkMode) return '#1a1a1a'

    if (iconCode?.includes('01d')) {
      if (temp > 35) return 'linear-gradient(135deg, #FF5722 0%, #FFC107 100%)'
      return 'linear-gradient(135deg, #2196F3 0%, #FFC107 100%)'
    }
    if (iconCode?.includes('01n')) return 'linear-gradient(135deg, #333333 0%, #2196F3 100%)'
    if (iconCode?.includes('09') || iconCode?.includes('10')) return 'linear-gradient(135deg, #607D8B 0%, #2196F3 100%)'
    return 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)'
  }

  // Fonctions API
  const fetchWeather = async (cityName) => {
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
      setError('Erreur de connexion')
      setWeather(null)
      setForecast(null)
    } finally {
      setLoading(false)
    }
  }

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
            setError('Erreur de géolocalisation')
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
  }, [])

  // Calculer les heures de prière (approximatif)
  const getPrayerTimes = (weather) => {
    if (!weather) return null

    const sunrise = new Date(weather.sys.sunrise * 1000)
    const sunset = new Date(weather.sys.sunset * 1000)

    return {
      fajr: new Date(sunrise.getTime() - 90 * 60000).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}),
      dhuhr: new Date((sunrise.getTime() + sunset.getTime()) / 2).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}),
      asr: new Date(sunset.getTime() - 3 * 60 * 60000).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}),
      maghrib: sunset.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}),
      isha: new Date(sunset.getTime() + 90 * 60000).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})
    }
  }

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: weather ? getBackgroundColor(weather.weather[0].icon, weather.main.temp) : 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
      color: darkMode ? '#FFFFFF' : '#FFFFFF',
      fontFamily: language === 'ar' ? 'Cairo, Tajawal, sans-serif' : 'Poppins, Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>

      {/* 1. Barre supérieure (Header) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: 'rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Bouton recherche à gauche */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          🔍
        </button>

        {/* Nom de la ville au centre */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            {selectedCity}
          </h2>
          <small style={{ opacity: 0.8 }}>Maroc</small>
        </div>

        {/* Bouton géolocalisation à droite */}
        <button
          onClick={getCurrentLocation}
          disabled={loading}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: loading ? 'not-allowed' : 'pointer',
            padding: '8px',
            opacity: loading ? 0.5 : 1
          }}
        >
          📍
        </button>
      </div>

      {/* Barre de recherche conditionnelle */}
      {showSearch && (
        <div style={{ padding: '0 20px 15px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '25px',
                border: 'none',
                fontSize: '16px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: '#333'
              }}
              autoFocus
            />
            <button
              type="submit"
              style={{
                padding: '12px 20px',
                borderRadius: '25px',
                border: 'none',
                backgroundColor: '#2196F3',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              OK
            </button>
          </form>
        </div>
      )}

      {/* Zone de contenu principal */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: '80px'
      }}>

        {/* Onglet Accueil */}
        {activeTab === 'home' && (
          <>
            {/* Messages d'état */}
            {loading && (
              <div style={{
                textAlign: 'center',
                padding: '50px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{ fontSize: '40px' }}>⏳</div>
                <p>{t.loading || 'Chargement...'}</p>
              </div>
            )}

            {error && (
              <div style={{
                margin: '20px',
                padding: '15px',
                backgroundColor: 'rgba(255, 87, 34, 0.9)',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* 2. Bloc météo actuel */}
            {weather && !loading && (
              <div style={{
                textAlign: 'center',
                padding: '30px 20px'
              }}>
                {/* Icône et température principale */}
                <div style={{ marginBottom: '30px' }}>
                  <div style={{
                    fontSize: '100px',
                    marginBottom: '10px',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                  }}>
                    {getWeatherIcon(weather.weather[0].icon)}
                  </div>
                  <div style={{
                    fontSize: '60px',
                    fontWeight: '300',
                    marginBottom: '10px'
                  }}>
                    {convertTemp(weather.main.temp)}°{temperatureUnit}
                  </div>
                  <p style={{
                    fontSize: '20px',
                    textTransform: 'capitalize',
                    opacity: 0.9,
                    marginBottom: '20px'
                  }}>
                    {weather.weather[0].description}
                  </p>

                  {/* Alerte chaleur */}
                  {weather.main.temp > 35 && (
                    <div style={{
                      backgroundColor: '#FF5722',
                      padding: '10px 20px',
                      borderRadius: '20px',
                      margin: '0 20px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      🔥 Chaleur extrême - Restez hydratés !
                    </div>
                  )}
                </div>

                {/* Détails météo en grille */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '15px',
                  maxWidth: '400px',
                  margin: '0 auto 30px'
                }}>
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '15px',
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>🌡️</div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>
                      {convertTemp(weather.main.feels_like)}°{temperatureUnit}
                    </div>
                    <small>{t.feelsLike}</small>
                  </div>

                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '15px',
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>💧</div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>
                      {weather.main.humidity}%
                    </div>
                    <small>{t.humidity}</small>
                  </div>

                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '15px',
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>💨</div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>
                      {Math.round(weather.wind.speed * 3.6)} km/h
                    </div>
                    <small>{t.wind}</small>
                  </div>

                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '15px',
                    borderRadius: '15px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>📊</div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>
                      {weather.main.pressure} hPa
                    </div>
                    <small>{t.pressure}</small>
                  </div>
                </div>

                {/* Lever/Coucher du soleil */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: '20px',
                  borderRadius: '15px',
                  margin: '0 20px 20px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '5px' }}>🌅</div>
                    <div style={{ fontWeight: '600' }}>
                      {new Date(weather.sys.sunrise * 1000).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                    </div>
                    <small>Lever du soleil</small>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '5px' }}>🌇</div>
                    <div style={{ fontWeight: '600' }}>
                      {new Date(weather.sys.sunset * 1000).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                    </div>
                    <small>Coucher du soleil</small>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Prévisions prochaines heures */}
            {forecast && !loading && (
              <div style={{ padding: '0 20px 30px' }}>
                <h3 style={{
                  marginBottom: '15px',
                  fontSize: '18px',
                  opacity: 0.9
                }}>
                  {t.nextHours}
                </h3>
                <div style={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: '15px',
                  paddingBottom: '10px'
                }}>
                  {forecast.list.slice(0, 8).map((item, index) => (
                    <div key={index} style={{
                      minWidth: '80px',
                      textAlign: 'center',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      padding: '15px 10px',
                      borderRadius: '15px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                        {new Date(item.dt * 1000).toLocaleTimeString('fr-FR', {hour: '2-digit'})}h
                      </div>
                      <div style={{ fontSize: '30px', marginBottom: '8px' }}>
                        {getWeatherIcon(item.weather[0].icon)}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>
                        {convertTemp(item.main.temp)}°
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Prévisions des jours à venir */}
            {forecast && !loading && (
              <div style={{ padding: '0 20px 30px' }}>
                <h3 style={{
                  marginBottom: '15px',
                  fontSize: '18px',
                  opacity: 0.9
                }}>
                  {t.nextDays}
                </h3>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '15px',
                  padding: '15px',
                  backdropFilter: 'blur(10px)'
                }}>
                  {forecast.list.filter((_, index) => index % 8 === 0).slice(0, 5).map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '15px 0',
                      borderBottom: index < 4 ? '1px solid rgba(255,255,255,0.2)' : 'none'
                    }}>
                      <div style={{ fontWeight: '600' }}>
                        {index === 0 ? t.today : new Date(item.dt * 1000).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', {weekday: 'long'})}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '24px' }}>
                          {getWeatherIcon(item.weather[0].icon)}
                        </span>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: '600', marginRight: '8px' }}>
                            {convertTemp(item.main.temp_max)}°
                          </span>
                          <span style={{ opacity: 0.7 }}>
                            {convertTemp(item.main.temp_min)}°
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Heures de prière (pour le Maroc) */}
            {weather && !loading && (
              <div style={{ padding: '0 20px 30px' }}>
                <h3 style={{
                  marginBottom: '15px',
                  fontSize: '18px',
                  opacity: 0.9
                }}>
                  🕌 Heures de prière
                </h3>
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '15px',
                  padding: '15px',
                  backdropFilter: 'blur(10px)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px'
                }}>
                  {getPrayerTimes(weather) && Object.entries(getPrayerTimes(weather)).map(([prayer, time]) => (
                    <div key={prayer} style={{ textAlign: 'center', padding: '10px' }}>
                      <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '5px' }}>
                        {prayer.charAt(0).toUpperCase() + prayer.slice(1)}
                      </div>
                      <div style={{ fontWeight: '600' }}>{time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Onglet Favoris */}
        {activeTab === 'favorites' && (
          <div style={{ padding: '30px 20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
              ⭐ {t.favorites}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '15px',
              marginBottom: '30px'
            }}>
              {favorites.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city)
                    fetchWeather(city)
                    setActiveTab('home')
                  }}
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
                  <small style={{ opacity: 0.8 }}>
                    {moroccanCities.find(c => c.name === city)?.arabicName}
                  </small>
                </button>
              ))}
            </div>

            <h3 style={{ marginBottom: '20px', opacity: 0.9 }}>Toutes les villes</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
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

        {/* Onglet Alertes */}
        {activeTab === 'alerts' && (
          <div style={{
            padding: '30px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '400px'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔔</div>
            <h2 style={{ marginBottom: '20px' }}>{t.alerts}</h2>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '30px',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ marginBottom: '15px', opacity: 0.8 }}>
                Aucune alerte météo en cours
              </p>
              <small style={{ opacity: 0.6 }}>
                Les alertes de chaleur extrême, orages et autres conditions météorologiques dangereuses apparaîtront ici
              </small>
            </div>
          </div>
        )}

        {/* Onglet Paramètres */}
        {activeTab === 'settings' && (
          <div style={{ padding: '30px 20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
              ⚙️ {t.settings}
            </h2>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '15px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
                  🌐 {t.language}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: '#333'
                  }}
                >
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
                  🌡️ {t.temperatureUnit}
                </label>
                <select
                  value={temperatureUnit}
                  onChange={(e) => setTemperatureUnit(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: '#333'
                  }}
                >
                  <option value="C">Celsius (°C)</option>
                  <option value="F">Fahrenheit (°F)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span>🌙 Mode sombre</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Barre inférieure (Bottom Navigation) */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        height: '80px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}>
        {/* Bouton Accueil */}
        <button
          onClick={() => setActiveTab('home')}
          style={{
            flex: 1,
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'home' ? '#2196F3' : '#666',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          <span style={{ fontSize: '24px' }}>🏠</span>
          {t.home}
        </button>

        {/* Bouton Favoris */}
        <button
          onClick={() => setActiveTab('favorites')}
          style={{
            flex: 1,
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'favorites' ? '#2196F3' : '#666',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          <span style={{ fontSize: '24px' }}>⭐</span>
          {t.favorites}
        </button>

        {/* Bouton Alertes */}
        <button
          onClick={() => setActiveTab('alerts')}
          style={{
            flex: 1,
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'alerts' ? '#2196F3' : '#666',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          <span style={{ fontSize: '24px' }}>🔔</span>
          {t.alerts}
        </button>

        {/* Bouton Paramètres */}
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            flex: 1,
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'settings' ? '#2196F3' : '#666',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          <span style={{ fontSize: '24px' }}>⚙️</span>
          {t.settings}
        </button>
      </div>
    </div>
  )
}

export default App
