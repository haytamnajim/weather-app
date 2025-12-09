import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_KEY, WEATHER_URL, FORECAST_URL } from '../utils/constants';

export function useWeather(initialCity = 'Casablanca', language = 'fr') {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [city, setCity] = useState(initialCity);

    const fetchWeather = useCallback(async (cityName) => {
        setLoading(true);
        setError('');

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
            ]);

            setWeather(weatherResponse.data);
            setForecast(forecastResponse.data);
            setCity(cityName);
        } catch (err) {
            setError('Erreur de connexion');
            setWeather(null);
            setForecast(null);
        } finally {
            setLoading(false);
        }
    }, [language]);

    const fetchByCoords = useCallback(async (lat, lon) => {
        setLoading(true);
        setError('');

        try {
            const [weatherResponse, forecastResponse] = await Promise.all([
                axios.get(WEATHER_URL, {
                    params: { lat, lon, appid: API_KEY, units: 'metric', lang: language === 'ar' ? 'ar' : 'fr' }
                }),
                axios.get(FORECAST_URL, {
                    params: { lat, lon, appid: API_KEY, units: 'metric', lang: language === 'ar' ? 'ar' : 'fr' }
                })
            ]);

            setWeather(weatherResponse.data);
            setForecast(forecastResponse.data);
            setCity(weatherResponse.data.name);
        } catch (err) {
            setError('Erreur de géolocalisation');
        } finally {
            setLoading(false);
        }
    }, [language]);

    // Initial fetch
    useEffect(() => {
        fetchWeather(initialCity);
    }, []);

    return {
        weather,
        forecast,
        loading,
        error,
        city,
        fetchWeather,
        fetchByCoords
    };
}
