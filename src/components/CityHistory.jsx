import React from 'react';
import { FiClock, FiX } from 'react-icons/fi';

const CityHistory = React.memo(({ history, onSelectCity, onRemoveCity, onClearHistory }) => {
  if (history.length === 0) return null;

  return (
    <div className="history-container">
      <div className="history-header">
        <h3 className="history-title">
          <FiClock size="16px" />
          Villes récentes
        </h3>
        <button
          className="clear-history-btn"
          onClick={onClearHistory}
          aria-label="Clear history"
          title="Effacer l'historique"
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
              aria-label={`Select ${city}`}
            >
              {city}
            </button>
            <button
              className="remove-history-btn"
              onClick={() => onRemoveCity(city)}
              aria-label={`Remove ${city} from history`}
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