import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'weather-app-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const addFavorite = (city) => {
    setFavorites(prev => {
      const newFavorites = [...prev];
      if (!newFavorites.includes(city)) {
        newFavorites.push(city);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      }
      return newFavorites;
    });
  };

  const removeFavorite = (city) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(f => f !== city);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (city) => favorites.includes(city);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };
}