import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiWind, FiSun, FiCloudRain, FiX, FiShield } from 'react-icons/fi';

const WeatherAlerts = React.memo(({ weather, language = 'fr' }) => {
  const [alerts, setAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const isRTL = language === 'ar';

  const translations = {
    fr: {
      title: 'Alertes Météo',
      noAlerts: 'Aucune alerte météo en cours',
      severeStorm: 'Tempête sévère',
      highWinds: 'Vents forts',
      extremeHeat: 'Chaleur extrême',
      freezing: 'Températures glaciales',
      heavyRain: 'Pluies abondantes',
      snowStorm: 'Tempête de neige',
      fog: 'Brouillard dense',
      adviceStorm: 'Évitez les déplacements inutiles, restez à l\'intérieur',
      adviceHeat: 'Restez hydraté, évitez l\'exposition au soleil',
      adviceFreezing: 'Protégez-vous du froid, chauffez-vous convenablement',
      adviceRain: 'Évitez les zones inondées, ne traversez pas les cours d\'eau',
      adviceSnow: 'Préparez des provisions, évitez les déplacements',
      adviceFog: 'Conduisez prudemment, utilisez les feux de brouillard',
      dismiss: 'Ignorer',
      severity: 'Sévérité',
      expires: 'Expire',
      takeAction: 'Mesures à prendre'
    },
    ar: {
      title: 'تنبيهات الطقس',
      noAlerts: 'لا توجد تنبيهات حاليا',
      severeStorm: 'عاصفة شديدة',
      highWinds: 'رياح قوية',
      extremeHeat: 'حرارة شديدة',
      freezing: 'درجات حرارة متجمدة',
      heavyRain: 'أمطار غزيرة',
      snowStorm: 'عاصفة ثلجية',
      fog: 'ضباب كثيف',
      adviceStorm: 'تجنب السفر غير الضروري، ابق في الداخل',
      adviceHeat: 'حافظ على الترطيب، تجنب التعرض للشمس',
      adviceFreezing: 'احم نفسك من البرد، سخن غرفتك بشكل مناسب',
      adviceRain: 'تجنب المناطق المغمورة، لا تعبر الأنهار',
      adviceSnow: 'جهز المؤن، تجنب السفر',
      adviceFog: 'اقيادة بحذر، استخدم أضواء الضباب',
      dismiss: 'تجاهل',
      severity: 'الشدة',
      expires: 'تنتهي',
      takeAction: 'إجراءات اتخاذها'
    }
  };

  const t = translations[language];

  const getAlertType = (weatherData) => {
    const alerts = [];
    const temp = weatherData.main.temp;
    const windSpeed = weatherData.wind.speed * 3.6; // Convert to km/h
    const weatherId = weatherData.weather[0].id;
    const humidity = weatherData.main.humidity;

    // Temperature alerts
    if (temp > 40) {
      alerts.push({
        type: 'extremeHeat',
        severity: 'severe',
        icon: <FiSun size="24px" />,
        color: '#ef4444',
        advice: t.adviceHeat
      });
    } else if (temp > 35) {
      alerts.push({
        type: 'extremeHeat',
        severity: 'moderate',
        icon: <FiSun size="24px" />,
        color: '#f97316',
        advice: t.adviceHeat
      });
    }

    if (temp < 0) {
      alerts.push({
        type: 'freezing',
        severity: 'severe',
        icon: <FiWind size="24px" />,
        color: '#3b82f6',
        advice: t.adviceFreezing
      });
    } else if (temp < 5) {
      alerts.push({
        type: 'freezing',
        severity: 'moderate',
        icon: <FiWind size="24px" />,
        color: '#60a5fa',
        advice: t.adviceFreezing
      });
    }

    // Wind alerts
    if (windSpeed > 80) {
      alerts.push({
        type: 'highWinds',
        severity: 'severe',
        icon: <FiWind size="24px" />,
        color: '#8b5cf6',
        advice: t.adviceStorm
      });
    } else if (windSpeed > 50) {
      alerts.push({
        type: 'highWinds',
        severity: 'moderate',
        icon: <FiWind size="24px" />,
        color: '#a78bfa',
        advice: t.adviceStorm
      });
    }

    // Weather condition alerts
    if (weatherId >= 200 && weatherId < 300) {
      alerts.push({
        type: 'severeStorm',
        severity: 'severe',
        icon: <FiAlertTriangle size="24px" />,
        color: '#dc2626',
        advice: t.adviceStorm
      });
    }

    if (weatherId >= 520 && weatherId < 600) {
      alerts.push({
        type: 'heavyRain',
        severity: 'severe',
        icon: <FiCloudRain size="24px" />,
        color: '#0891b2',
        advice: t.adviceRain
      });
    }

    if (weatherId >= 600 && weatherId < 700) {
      alerts.push({
        type: 'snowStorm',
        severity: 'moderate',
        icon: <FiCloudRain size="24px" />,
        color: '#e0f2fe',
        advice: t.adviceSnow
      });
    }

    if (weatherId >= 700 && weatherId < 800) {
      alerts.push({
        type: 'fog',
        severity: 'moderate',
        icon: <FiShield size="24px" />,
        color: '#94a3b8',
        advice: t.adviceFog
      });
    }

    // High humidity alert
    if (humidity > 90 && temp > 25) {
      alerts.push({
        type: 'extremeHeat',
        severity: 'moderate',
        icon: <FiSun size="24px" />,
        color: '#f97316',
        advice: t.adviceHeat
      });
    }

    return alerts;
  };

  useEffect(() => {
    if (weather) {
      const weatherAlerts = getAlertType(weather);
      setAlerts(weatherAlerts);
    }
  }, [weather]);

  const dismissAlert = (alertIndex) => {
    setDismissedAlerts([...dismissedAlerts, alertIndex]);
  };

  const activeAlerts = alerts.filter((_, index) => !dismissedAlerts.includes(index));

  if (!weather || activeAlerts.length === 0) {
    return null;
  }

  const getAlertTitle = (type) => {
    const titles = {
      severeStorm: t.severeStorm,
      highWinds: t.highWinds,
      extremeHeat: t.extremeHeat,
      freezing: t.freezing,
      heavyRain: t.heavyRain,
      snowStorm: t.snowStorm,
      fog: t.fog
    };
    return titles[type] || type;
  };

  return (
    <div className="weather-alerts-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="alerts-header">
        <h3 className="alerts-title">
          <FiAlertTriangle size="20px" />
          {t.title}
        </h3>
        <span className="alerts-count">{activeAlerts.length}</span>
      </div>

      <div className="alerts-list">
        {activeAlerts.map((alert, index) => (
          <div
            key={index}
            className={`alert-card alert-${alert.severity}`}
            style={{ borderLeftColor: alert.color }}
          >
            <div className="alert-content">
              <div className="alert-icon" style={{ color: alert.color }}>
                {alert.icon}
              </div>
              <div className="alert-info">
                <h4 className="alert-title">{getAlertTitle(alert.type)}</h4>
                <p className="alert-advice">{alert.advice}</p>
                <div className="alert-meta">
                  <span className="alert-severity">
                    {t.severity}: {alert.severity === 'severe' ? 'High' : 'Moderate'}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="alert-dismiss"
              onClick={() => dismissAlert(index)}
              aria-label={t.dismiss}
            >
              <FiX size="16px" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

WeatherAlerts.displayName = 'WeatherAlerts';

export default WeatherAlerts;