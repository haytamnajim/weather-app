import {
    WiDaySunny, WiNightClear, WiCloud, WiRain, WiDayRain,
    WiThunderstorm, WiSnow, WiFog
} from 'react-icons/wi';

// Weather icon mapping
export const getWeatherIcon = (iconCode) => {
    const iconMap = {
        '01d': WiDaySunny,
        '01n': WiNightClear,
        '02d': WiDaySunny,
        '02n': WiCloud,
        '03d': WiCloud,
        '03n': WiCloud,
        '04d': WiCloud,
        '04n': WiCloud,
        '09d': WiRain,
        '09n': WiRain,
        '10d': WiDayRain,
        '10n': WiRain,
        '11d': WiThunderstorm,
        '11n': WiThunderstorm,
        '13d': WiSnow,
        '13n': WiSnow,
        '50d': WiFog,
        '50n': WiFog
    };

    return iconMap[iconCode] || WiDaySunny;
};

// Temperature conversion
export const convertTemp = (temp, unit = 'C') => {
    if (unit === 'F') {
        return Math.round((temp * 9 / 5) + 32);
    }
    return Math.round(temp);
};

// Format time from unix timestamp
export const formatTime = (timestamp, locale = 'fr-FR') => {
    return new Date(timestamp * 1000).toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Format date
export const formatDate = (timestamp, locale = 'fr-FR', options = {}) => {
    return new Date(timestamp * 1000).toLocaleDateString(locale, options);
};

// Get prayer times (approximate calculation)
export const getPrayerTimes = (sunrise, sunset) => {
    const sunriseTime = new Date(sunrise * 1000);
    const sunsetTime = new Date(sunset * 1000);

    return {
        fajr: new Date(sunriseTime.getTime() - 90 * 60000),
        dhuhr: new Date((sunriseTime.getTime() + sunsetTime.getTime()) / 2),
        asr: new Date(sunsetTime.getTime() - 3 * 60 * 60000),
        maghrib: sunsetTime,
        isha: new Date(sunsetTime.getTime() + 90 * 60000)
    };
};

// Get background gradient based on weather
export const getWeatherGradient = (iconCode, temp, darkMode) => {
    if (darkMode) return 'var(--gradient-night)';

    if (iconCode?.includes('01d')) {
        return temp > 35 ? 'var(--gradient-sunset)' : 'var(--gradient-primary)';
    }
    if (iconCode?.includes('01n')) return 'var(--gradient-night)';
    if (iconCode?.includes('09') || iconCode?.includes('10')) return 'var(--gradient-rain)';
    if (iconCode?.includes('11')) return 'var(--gradient-night)';

    return 'var(--gradient-primary)';
};
// Chart data transformations
export const createTemperatureChartData = (forecastData) => {
    if (!forecastData) return [];

    return forecastData.list.slice(0, 24).map((item) => ({
        time: new Date(item.dt * 1000).getHours(),
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        wind: Math.round(item.wind.speed * 3.6)
    }));
};

export const createWeeklyChartData = (forecastData, locale = 'fr-FR') => {
    if (!forecastData) return [];

    const dailyData = [];
    for (let i = 0; i < forecastData.list.length; i += 8) {
        const dayData = forecastData.list[i];
        dailyData.push({
            day: new Date(dayData.dt * 1000).toLocaleDateString(locale, { weekday: 'short' }),
            maxTemp: Math.round(dayData.main.temp_max),
            minTemp: Math.round(dayData.main.temp_min),
            humidity: dayData.main.humidity
        });
    }
    return dailyData.slice(0, 7);
};

export const getBackgroundColor = (iconCode, temp, darkMode) => {
    if (darkMode) return '#1a1a1a';

    if (iconCode?.includes('01d')) {
        if (temp > 35) return 'linear-gradient(135deg, #FF5722 0%, #FFC107 100%)';
        return 'linear-gradient(135deg, #2196F3 0%, #FFC107 100%)';
    }
    if (iconCode?.includes('01n')) return 'linear-gradient(135deg, #333333 0%, #2196F3 100%)';
    if (iconCode?.includes('09') || iconCode?.includes('10')) return 'linear-gradient(135deg, #607D8B 0%, #2196F3 100%)';
    return 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)';
};
