import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiArrowUp, FiArrowDown, FiClock } from 'react-icons/fi';

const SunMoon = React.memo(({ weather, language = 'fr' }) => {
  const [sunData, setSunData] = useState(null);
  const [moonPhase, setMoonPhase] = useState(null);

  const isRTL = language === 'ar';

  const translations = {
    fr: {
      title: 'Soleil & Lune',
      sunrise: 'Lever du soleil',
      sunset: 'Coucher du soleil',
      dayLength: 'Durée du jour',
      goldenHour: 'Golden Hour',
      goldenHourStart: 'Début',
      goldenHourEnd: 'Fin',
      moonPhase: 'Phase lunaire',
      moonrise: 'Lever de la lune',
      moonset: 'Coucher de la lune',
      illumination: 'Illumination',
      solarNoon: 'Midi solaire',
      civilDawn: 'Aube civile',
      civilDusk: 'Crépuscule civil',
      fullMoon: 'Pleine lune',
      newMoon: 'Nouvelle lune',
      firstQuarter: 'Premier quartier',
      lastQuarter: 'Dernier quartier',
      waxingCrescent: 'Croissant croissant',
      waningCrescent: 'Croissant décroissant',
      waxingGibbous: 'Gibbeuse croissante',
      waningGibbous: 'Gibbeuse décroissante'
    },
    ar: {
      title: 'الشمس والقمر',
      sunrise: 'شروق الشمس',
      sunset: 'غروب الشمس',
      dayLength: 'مدة النهار',
      goldenHour: 'الساعة الذهبية',
      goldenHourStart: 'البداية',
      goldenHourEnd: 'النهاية',
      moonPhase: 'مرحلة القمر',
      moonrise: 'شروق القمر',
      moonset: 'غروب القمر',
      illumination: 'الإضاءة',
      solarNoon: 'الظهيرة الشمسية',
      civilDawn: 'الفجر المدني',
      civilDusk: 'الغسق المدني',
      fullMoon: 'البدر',
      newMoon: 'الهلال',
      firstQuarter: 'الربع الأول',
      lastQuarter: 'الربع الأخير',
      waxingCrescent: 'هلال متزايد',
      waningCrescent: 'هلال متناقص',
      waxingGibbous: 'مربع متزايد',
      waningGibbous: 'مربع متناقص'
    }
  };

  const t = translations[language];

  const getSunTimes = (weatherData) => {
    if (!weatherData.sys || !weatherData.sys.sunrise || !weatherData.sys.sunset) {
      return null;
    }

    const sunrise = new Date(weatherData.sys.sunrise * 1000);
    const sunset = new Date(weatherData.sys.sunset * 1000);
    const timezone = weatherData.timezone || 0;

    // Adjust for timezone
    const sunriseLocal = new Date(sunrise.getTime() + timezone * 1000);
    const sunsetLocal = new Date(sunset.getTime() + timezone * 1000);

    const dayLength = sunsetLocal - sunriseLocal;
    const dayLengthHours = Math.floor(dayLength / (1000 * 60 * 60));
    const dayLengthMinutes = Math.floor((dayLength % (1000 * 60 * 60)) / (1000 * 60));

    // Golden hour (approximately 1 hour after sunrise and before sunset)
    const goldenHourStart = new Date(sunriseLocal.getTime() + 60 * 60 * 1000);
    const goldenHourEnd = new Date(sunsetLocal.getTime() - 60 * 60 * 1000);

    // Solar noon (midpoint between sunrise and sunset)
    const solarNoon = new Date((sunriseLocal.getTime() + sunsetLocal.getTime()) / 2);

    // Civil dawn/dusk (sun 6° below horizon)
    const civilDawn = new Date(sunriseLocal.getTime() - 30 * 60 * 1000);
    const civilDusk = new Date(sunsetLocal.getTime() + 30 * 60 * 1000);

    return {
      sunrise: sunriseLocal,
      sunset: sunsetLocal,
      dayLength: `${dayLengthHours}h ${dayLengthMinutes}m`,
      goldenHour: {
        start: goldenHourStart,
        end: goldenHourEnd
      },
      solarNoon,
      civilDawn,
      civilDusk
    };
  };

  const getMoonPhase = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    // Simple moon phase calculation
    const c = Math.floor((year - 1900) / 100);
    const e = 2 - c + Math.floor(c / 4);
    const f = Math.floor(365.25 * (year + 4716));
    const g = Math.floor(30.6001 * (month + 9 + (12 * (month < 3 ? 1 : 0))));
    const h = f + g + day + 59 - e;
    const i = Math.floor(h / 30.6);
    const j = h - Math.floor(30.6 * i);
    const k = Math.floor((i + 3) / 12);
    const l = i + 3 - 12 * k;
    const m = year + 100 * k;
    const n = 5 - l;

    const jd = Math.floor(365.25 * (m + 4716)) + Math.floor(30.6001 * (n + 9)) + day + 59 - Math.floor((m + 49) / 100) + Math.floor((m + 49) / 400) - 32;

    const phase = (jd - 2451550.1) % 29.530588853;
    const age = phase < 0 ? phase + 29.530588853 : phase;

    let phaseName, illumination, icon;

    if (age < 1) {
      phaseName = t.newMoon;
      illumination = 0;
      icon = '🌑';
    } else if (age < 7) {
      phaseName = t.waxingCrescent;
      illumination = Math.round((age / 7) * 50);
      icon = '🌒';
    } else if (age < 8) {
      phaseName = t.firstQuarter;
      illumination = 50;
      icon = '🌓';
    } else if (age < 14) {
      phaseName = t.waxingGibbous;
      illumination = Math.round(50 + ((age - 8) / 6) * 50);
      icon = '🌔';
    } else if (age < 15) {
      phaseName = t.fullMoon;
      illumination = 100;
      icon = '🌕';
    } else if (age < 22) {
      phaseName = t.waningGibbous;
      illumination = Math.round(100 - ((age - 15) / 7) * 50);
      icon = '🌖';
    } else if (age < 23) {
      phaseName = t.lastQuarter;
      illumination = 50;
      icon = '🌗';
    } else {
      phaseName = t.waningCrescent;
      illumination = Math.round(((29.5 - age) / 6.5) * 50);
      icon = '🌘';
    }

    return {
      phase: phaseName,
      illumination,
      icon,
      age: Math.round(age)
    };
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString(language === 'ar' ? 'ar-MA' : 'fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (weather) {
      const sunTimes = getSunTimes(weather);
      setSunData(sunTimes);
      setMoonPhase(getMoonPhase());
    }
  }, [weather]);

  if (!weather || !sunData) {
    return null;
  }

  const currentTime = new Date();
  const isDayTime = currentTime >= sunData.sunrise && currentTime <= sunData.sunset;
  const isGoldenHour = currentTime >= sunData.goldenHour.start && currentTime <= sunData.goldenHour.end;

  return (
    <div className="sun-moon-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="sun-moon-header">
        <h3 className="sun-moon-title">
          {isDayTime ? <FiSun size="20px" /> : <FiMoon size="20px" />}
          {t.title}
        </h3>
        {isGoldenHour && (
          <div className="golden-hour-badge">
            <span className="golden-hour-icon">✨</span>
            <span className="golden-hour-text">{t.goldenHour}</span>
          </div>
        )}
      </div>

      <div className="sun-moon-grid">
        {/* Sun Section */}
        <div className="sun-section">
          <div className="sun-item">
            <div className="sun-icon-wrapper sunrise">
              <FiArrowUp size="24px" />
            </div>
            <div className="sun-info">
              <span className="sun-label">{t.sunrise}</span>
              <span className="sun-time">{formatTime(sunData.sunrise)}</span>
            </div>
          </div>

          <div className="sun-item">
            <div className="sun-icon-wrapper sunset">
              <FiArrowDown size="24px" />
            </div>
            <div className="sun-info">
              <span className="sun-label">{t.sunset}</span>
              <span className="sun-time">{formatTime(sunData.sunset)}</span>
            </div>
          </div>

          <div className="sun-item">
            <div className="sun-icon-wrapper day-length">
              <FiClock size="24px" />
            </div>
            <div className="sun-info">
              <span className="sun-label">{t.dayLength}</span>
              <span className="sun-time">{sunData.dayLength}</span>
            </div>
          </div>
        </div>

        {/* Moon Section */}
        {moonPhase && (
          <div className="moon-section">
            <div className="moon-phase-display">
              <div className="moon-icon">{moonPhase.icon}</div>
              <div className="moon-phase-info">
                <span className="moon-phase-name">{moonPhase.phase}</span>
                <span className="moon-illumination">{t.illumination}: {moonPhase.illumination}%</span>
              </div>
            </div>

            <div className="moon-details">
              <div className="moon-detail-item">
                <span className="moon-detail-label">{t.moonPhase}</span>
                <span className="moon-detail-value">{moonPhase.age} jours</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Sun Times */}
      <div className="sun-details">
        <div className="sun-detail-item">
          <span className="sun-detail-label">{t.solarNoon}</span>
          <span className="sun-detail-value">{formatTime(sunData.solarNoon)}</span>
        </div>
        <div className="sun-detail-item">
          <span className="sun-detail-label">{t.civilDawn}</span>
          <span className="sun-detail-value">{formatTime(sunData.civilDawn)}</span>
        </div>
        <div className="sun-detail-item">
          <span className="sun-detail-label">{t.civilDusk}</span>
          <span className="sun-detail-value">{formatTime(sunData.civilDusk)}</span>
        </div>
      </div>
    </div>
  );
});

SunMoon.displayName = 'SunMoon';

export default SunMoon;