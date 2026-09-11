import React from 'react';
import { FiThermometer } from 'react-icons/fi';

const TemperatureToggle = React.memo(({ unit, onToggle }) => {
  return (
    <button
      className="temp-toggle-btn"
      onClick={onToggle}
      aria-label={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
      title={unit === 'celsius' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
    >
      <FiThermometer size="18px" />
      <span className="temp-unit-text">{unit === 'celsius' ? '°C' : '°F'}</span>
    </button>
  );
});

TemperatureToggle.displayName = 'TemperatureToggle';

export default TemperatureToggle;