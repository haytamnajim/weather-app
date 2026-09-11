import { useState, useEffect } from 'react';

const HISTORY_KEY = 'weather-app-city-history';
const MAX_HISTORY = 10;

export function useCityHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addToHistory = (city) => {
    setHistory(prev => {
      const newHistory = [city, ...prev.filter(c => c !== city)].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const removeFromHistory = (city) => {
    setHistory(prev => {
      const newHistory = prev.filter(c => c !== city);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory
  };
}