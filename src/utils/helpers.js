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
