import React, { useState, useEffect } from 'react';
import './MinimalistStyles.css';
import { useWeather } from './hooks/useWeather';
import { useFavorites } from './hooks/useFavorites';
import { useLanguage } from './hooks/useLanguage';
import { useTemperatureUnit } from './hooks/useTemperatureUnit';
import { useCityHistory } from './hooks/useCityHistory';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';
import WeatherSkeleton from './components/WeatherSkeleton';
import WeatherBackground from './components/WeatherBackground';
import SearchBox from './components/SearchBox';
import ForecastSection from './components/ForecastSection';
import WeatherCardGlass from './components/WeatherCardGlass';
import WeatherCharts from './components/WeatherCharts';
import RainEffect from './components/RainEffect';
import ChatWidget from './components/ChatWidget';
import Favorites from './components/Favorites';
import CityHistory from './components/CityHistory';
import LanguageToggle from './components/LanguageToggle';
import TemperatureToggle from './components/TemperatureToggle';
import { FiMapPin, FiHeart } from 'react-icons/fi';

function App() {
  const {
    weather,
    forecast,
    loading,
    error,
    fetchWeather,
    fetchByCoords
  } = useWeather('Casablanca');

  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  } = useFavorites();

  const {
    language,
    changeLanguage,
    t,
    isRTL
  } = useLanguage();

  const {
    unit,
    toggleUnit,
    convertTemp,
    getUnitSymbol
  } = useTemperatureUnit();

  const {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  } = useCityHistory();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [geoError, setGeoError] = useState('');
  const [showGeoError, setShowGeoError] = useState(false);
  const [city, setCity] = useState('Casablanca');

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      setShowGeoError(false);
      setGeoError('');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchByCoords(latitude, longitude);
          setGeoError('');
          setShowGeoError(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = '';
          if (error.code === 1) {
            errorMessage = language === 'ar' ? 'تم رفض إذن الموقع - يرجى السماح بالوصول للموقع في إعدادات المتصفح' : 'Permission refusée - Activez la localisation dans les paramètres du navigateur';
          } else if (error.code === 2) {
            errorMessage = language === 'ar' ? 'تعذر الحصول على الموقع' : 'Impossible d\'obtenir votre position';
          } else if (error.code === 3) {
            errorMessage = language === 'ar' ? 'انتهت مهلة طلب الموقع' : 'Délai d\'attente de localisation expiré';
          } else {
            errorMessage = language === 'ar' ? 'خطأ في الموقع الجغرافي' : 'Erreur de géolocalisation';
          }
          setGeoError(errorMessage);
          setShowGeoError(true);
          setTimeout(() => setShowGeoError(false), 8000);
        }
      );
    } else {
      const noSupportMsg = language === 'ar' ? 'الموقع الجغرافي غير مدعوم في متصفحك' : 'La géolocalisation n\'est pas supportée par votre navigateur';
      setGeoError(noSupportMsg);
      setShowGeoError(true);
      setTimeout(() => setShowGeoError(false), 8000);
    }
  };

  const handleCityChange = (cityName) => {
    setCity(cityName);
    addToHistory(cityName);
    fetchWeather(cityName);
  };

  const handleToggleFavorite = () => {
    if (weather) {
      if (isFavorite(weather.name)) {
        removeFavorite(weather.name);
      } else {
        addFavorite(weather.name);
      }
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.dir = 'rtl';
    } else {
      document.body.classList.remove('rtl');
      document.body.dir = 'ltr';
    }
  }, [isRTL]);

  return (
    <ErrorBoundary>
      <WeatherBackground weather={weather} isDarkMode={isDarkMode} />
      <div className={`fast-app ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="header-top">
          <h1>{t('title')}</h1>

          <div className="header-actions">
            <LanguageToggle
              language={language}
              onChangeLanguage={changeLanguage}
              isRTL={isRTL}
            />
            <TemperatureToggle
              unit={unit}
              onToggle={toggleUnit}
            />
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
        </div>

        <div className="search-actions">
          <button
            className="geo-btn"
            onClick={handleGeolocation}
            aria-label="Use my location"
            title="Ma position"
          >
            <FiMapPin size="20px" />
          </button>
        </div>

        <SearchBox onSearch={handleCityChange} placeholder={t('search')} />

        {showGeoError && geoError && <div className="error geo-error">{geoError}</div>}

        <Favorites
          favorites={favorites}
          onSelectFavorite={handleCityChange}
          onRemoveFavorite={removeFavorite}
          isFavorite={isFavorite}
        />

        <CityHistory
          history={history}
          onSelectCity={handleCityChange}
          onRemoveCity={removeFromHistory}
          onClearHistory={clearHistory}
        />

        {weather && weather.weather[0].main.toLowerCase().includes('rain') && <RainEffect />}

        {error && <div className="error">{error}</div>}

        {loading ? (
          <WeatherSkeleton />
        ) : (
          <main className="content">
            <div className="main-weather-col">
              {weather && (
                <WeatherCardGlass
                  weather={weather}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite}
                  convertTemp={convertTemp}
                  getUnitSymbol={getUnitSymbol}
                />
              )}
            </div>

            <ForecastSection
              forecast={forecast}
              convertTemp={convertTemp}
              getUnitSymbol={getUnitSymbol}
            />

            {forecast && (
              <WeatherCharts
                forecast={forecast}
                isDarkMode={isDarkMode}
                convertTemp={convertTemp}
              />
            )}
          </main>
        )}

        <ChatWidget weather={weather} onCityChange={handleCityChange} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
