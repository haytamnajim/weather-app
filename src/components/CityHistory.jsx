import React from 'react';
import { FiClock, FiX } from 'react-icons/fi';
import { MOROCCAN_CITIES } from '../utils/cities';

const CityHistory = React.memo(({ history, onSelectCity, onRemoveCity, onClearHistory, language = 'fr' }) => {
  if (history.length === 0) return null;

  const isRTL = language === 'ar';
  const translations = {
    fr: {
      title: 'Villes récentes',
      clearHistory: 'Effacer l\'historique',
      select: 'Sélectionner',
      remove: 'Supprimer'
    },
    ar: {
      title: 'المدن الأخيرة',
      clearHistory: 'مسح السجل',
      select: 'اختيار',
      remove: 'حذف'
    }
  };

  const t = translations[language];

  const getCityDisplayName = (cityName) => {
    if (isRTL) {
      const city = MOROCCAN_CITIES.find(c => c.name === cityName);
      return city ? city.arabicName : cityName;
    }
    return cityName;
  };

  return (
    <div className="history-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="history-header">
        <h3 className="history-title">
          <FiClock size="16px" />
          {t.title}
        </h3>
        <button
          className="clear-history-btn"
          onClick={onClearHistory}
          aria-label={t.clearHistory}
          title={t.clearHistory}
        >
          <FiX size="14px" />
        </button>
      </div>
      <div className="history-list">
        {history.map((city, index) => (
          <div key={index} className="history-item">
            <button
              className="history-city-btn"
              onClick={() => onSelectCity(city)}
              aria-label={`${t.select} ${city}`}
            >
              {getCityDisplayName(city)}
            </button>
            <button
              className="remove-history-btn"
              onClick={() => onRemoveCity(city)}
              aria-label={`${t.remove} ${city}`}
            >
              <FiX size="12px" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

CityHistory.displayName = 'CityHistory';

export default CityHistory;