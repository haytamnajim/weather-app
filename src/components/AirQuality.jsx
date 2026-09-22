import React, { useState, useEffect } from 'react';
import { FiWind, FiDroplet, FiSun, FiActivity, FiAlertCircle } from 'react-icons/fi';

const AirQuality = React.memo(({ weather, language = 'fr' }) => {
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(false);

  const isRTL = language === 'ar';

  const translations = {
    fr: {
      title: 'Qualité de l\'Air',
      good: 'Bonne',
      moderate: 'Modérée',
      unhealthySensitive: 'Malsaine pour les groupes sensibles',
      unhealthy: 'Malsaine',
      veryUnhealthy: 'Très malsaine',
      hazardous: 'Dangereuse',
      pm25: 'PM2.5',
      pm10: 'PM10',
      o3: 'Ozone',
      no2: 'Dioxyde d\'azote',
      so2: 'Dioxyde de soufre',
      co: 'Monoxyde de carbone',
      adviceGood: 'Qualité de l\'air satisfaisante. Profitez des activités extérieures.',
      adviceModerate: 'Qualité acceptable. Les personnes sensibles doivent limiter les efforts prolongés.',
      adviceSensitive: 'Qualité malsaine pour les groupes sensibles. Réduisez les activités extérieures.',
      adviceUnhealthy: 'Qualité malsaine pour tous. Évitez les activités extérieures prolongées.',
      adviceVeryUnhealthy: 'Qualité très malsaine. Restez à l\'intérieur et évitez tout effort physique.',
      adviceHazardous: 'Qualité dangereuse. Urgence sanitaire. Évitez toute exposition.',
      healthEffects: 'Effets sur la santé',
      primaryPollutant: 'Polluant principal',
      noData: 'Données non disponibles'
    },
    ar: {
      title: 'جودة الهواء',
      good: 'جيدة',
      moderate: 'معتدلة',
      unhealthySensitive: 'غير صحية للفئات الحساسة',
      unhealthy: 'غير صحية',
      veryUnhealthy: 'غير صحية جدا',
      hazardous: 'خطيرة',
      pm25: 'PM2.5',
      pm10: 'PM10',
      o3: 'الأوزون',
      no2: 'ثاني أكسيد النيتروجين',
      so2: 'ثاني أكسيد الكبريت',
      co: 'أول أكسيد الكربون',
      adviceGood: 'جودة الهواء مرضية. استمتع بالأنشطة الخارجية.',
      adviceModerate: 'جودة مقبولة. يجب على الأشخاص الحساسين تقليل المجهود المفرط.',
      adviceSensitive: 'جودة غير صحية للفئات الحساسة. قلل الأنشطة الخارجية.',
      adviceUnhealthy: 'جودة غير صحية للجميع. تجنب الأنشطة الخارجية المفرطة.',
      adviceVeryUnhealthy: 'جودة غير صحية جدا. ابق في الداخل وتجنب أي جهد بدني.',
      adviceHazardous: 'جودة خطيرة. حالة طارئة. تجنب أي تعرض.',
      healthEffects: 'التأثيرات الصحية',
      primaryPollutant: 'الملوث الرئيسي',
      noData: 'بيانات غير متاحة'
    }
  };

  const t = translations[language];

  // Simulated AQI data based on weather conditions
  const getSimulatedAQI = (weatherData) => {
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const weatherId = weatherData.weather[0].id;

    // Base AQI calculation
    let baseAQI = 50;

    // Adjust based on conditions
    if (weatherId >= 700 && weatherId < 800) {
      baseAQI += 80; // Fog/Atmosphere = poor air quality
    }

    if (weatherId >= 500 && weatherId < 600) {
      baseAQI += 30; // Rain can improve air quality slightly
    }

    if (humidity > 80) {
      baseAQI += 20; // High humidity can trap pollutants
    }

    if (windSpeed < 2) {
      baseAQI += 40; // Low wind = poor dispersion
    } else if (windSpeed > 8) {
      baseAQI -= 20; // High wind = good dispersion
    }

    if (temp > 35) {
      baseAQI += 30; // High heat = ozone formation
    }

    // Add some randomness
    baseAQI += Math.floor(Math.random() * 20) - 10;

    // Ensure AQI is within valid range
    baseAQI = Math.max(1, Math.min(500, baseAQI));

    return {
      aqi: baseAQI,
      pm25: Math.round(baseAQI * 0.4 + Math.random() * 10),
      pm10: Math.round(baseAQI * 0.6 + Math.random() * 15),
      o3: Math.round(baseAQI * 0.3 + Math.random() * 8),
      no2: Math.round(baseAQI * 0.2 + Math.random() * 5),
      so2: Math.round(baseAQI * 0.1 + Math.random() * 3),
      co: Math.round(baseAQI * 0.05 + Math.random() * 2)
    };
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { level: 'good', color: '#22c55e', icon: <FiActivity size="24px" /> };
    if (aqi <= 100) return { level: 'moderate', color: '#eab308', icon: <FiWind size="24px" /> };
    if (aqi <= 150) return { level: 'unhealthySensitive', color: '#f97316', icon: <FiAlertCircle size="24px" /> };
    if (aqi <= 200) return { level: 'unhealthy', color: '#ef4444', icon: <FiAlertCircle size="24px" /> };
    if (aqi <= 300) return { level: 'veryUnhealthy', color: '#8b5cf6', icon: <FiAlertCircle size="24px" /> };
    return { level: 'hazardous', color: '#7c2d12', icon: <FiAlertCircle size="24px" /> };
  };

  const getAQIAdvice = (level) => {
    const adviceMap = {
      good: t.adviceGood,
      moderate: t.adviceModerate,
      unhealthySensitive: t.adviceSensitive,
      unhealthy: t.adviceUnhealthy,
      veryUnhealthy: t.adviceVeryUnhealthy,
      hazardous: t.adviceHazardous
    };
    return adviceMap[level] || '';
  };

  useEffect(() => {
    if (weather) {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const data = getSimulatedAQI(weather);
        setAqiData(data);
        setLoading(false);
      }, 500);
    }
  }, [weather]);

  if (!weather) return null;

  if (loading) {
    return (
      <div className="air-quality-container loading" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="aqi-skeleton">
          <div className="skeleton-circle"></div>
          <div className="skeleton-text"></div>
        </div>
      </div>
    );
  }

  if (!aqiData) {
    return (
      <div className="air-quality-container" dir={isRTL ? 'rtl' : 'ltr'}>
        <p className="no-data">{t.noData}</p>
      </div>
    );
  }

  const aqiLevel = getAQILevel(aqiData.aqi);
  const levelText = t[aqiLevel.level];

  return (
    <div className="air-quality-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="aqi-header">
        <h3 className="aqi-title">
          <FiWind size="20px" />
          {t.title}
        </h3>
        <div className="aqi-badge" style={{ backgroundColor: aqiLevel.color }}>
          <span className="aqi-value">{aqiData.aqi}</span>
          <span className="aqi-label">{levelText}</span>
        </div>
      </div>

      <div className="aqi-main">
        <div className="aqi-circle" style={{ borderColor: aqiLevel.color }}>
          <div className="aqi-circle-inner" style={{ backgroundColor: aqiLevel.color + '20' }}>
            <div className="aqi-icon" style={{ color: aqiLevel.color }}>
              {aqiLevel.icon}
            </div>
            <div className="aqi-number">{aqiData.aqi}</div>
            <div className="aqi-status">{levelText}</div>
          </div>
        </div>

        <div className="aqi-advice">
          <h4>{t.healthEffects}</h4>
          <p>{getAQIAdvice(aqiLevel.level)}</p>
        </div>
      </div>

      <div className="aqi-pollutants">
        <h4>{t.primaryPollutant}</h4>
        <div className="pollutants-grid">
          <div className="pollutant-item">
            <span className="pollutant-label">{t.pm25}</span>
            <span className="pollutant-value">{aqiData.pm25} µg/m³</span>
          </div>
          <div className="pollutant-item">
            <span className="pollutant-label">{t.pm10}</span>
            <span className="pollutant-value">{aqiData.pm10} µg/m³</span>
          </div>
          <div className="pollutant-item">
            <span className="pollutant-label">{t.o3}</span>
            <span className="pollutant-value">{aqiData.o3} µg/m³</span>
          </div>
          <div className="pollutant-item">
            <span className="pollutant-label">{t.no2}</span>
            <span className="pollutant-value">{aqiData.no2} µg/m³</span>
          </div>
          <div className="pollutant-item">
            <span className="pollutant-label">{t.so2}</span>
            <span className="pollutant-value">{aqiData.so2} µg/m³</span>
          </div>
          <div className="pollutant-item">
            <span className="pollutant-label">{t.co}</span>
            <span className="pollutant-value">{aqiData.co} µg/m³</span>
          </div>
        </div>
      </div>
    </div>
  );
});

AirQuality.displayName = 'AirQuality';

export default AirQuality;