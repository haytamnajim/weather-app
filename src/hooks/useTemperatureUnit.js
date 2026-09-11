import { useState, useEffect } from 'react';

const UNIT_KEY = 'weather-app-temperature-unit';

export function useTemperatureUnit() {
  const [unit, setUnit] = useState('celsius');

  useEffect(() => {
    const savedUnit = localStorage.getItem(UNIT_KEY);
    if (savedUnit) {
      setUnit(savedUnit);
    }
  }, []);

  const toggleUnit = () => {
    const newUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(newUnit);
    localStorage.setItem(UNIT_KEY, newUnit);
  };

  const convertTemp = (celsius) => {
    if (unit === 'fahrenheit') {
      return Math.round((celsius * 9/5) + 32);
    }
    return Math.round(celsius);
  };

  const getUnitSymbol = () => {
    return unit === 'celsius' ? '°C' : '°F';
  };

  return {
    unit,
    toggleUnit,
    convertTemp,
    getUnitSymbol
  };
}