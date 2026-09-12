import React from 'react';
import { FiHeart, FiX } from 'react-icons/fi';
import { MOROCCAN_CITIES } from '../utils/cities';

const Favorites = React.memo(({ favorites, onSelectFavorite, onRemoveFavorite, isFavorite, language = 'fr' }) => {
  if (favorites.length === 0) return null;

  const isRTL = language === 'ar';
  const translations = {
    fr: {
      title: 'Villes favorites',
      select: 'Sélectionner',
      remove: 'Supprimer'
    },
    ar: {
      title: 'المدن المفضلة',
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
    <div className="favorites-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <h3 className="favorites-title">{t.title}</h3>
      <div className="favorites-list">
        {favorites.map((city, index) => (
          <div key={index} className="favorite-item">
            <button
              className="favorite-btn"
              onClick={() => onSelectFavorite(city)}
              aria-label={`${t.select} ${city}`}
            >
              <FiHeart size="16px" className="favorite-icon" />
              {getCityDisplayName(city)}
            </button>
            <button
              className="remove-favorite-btn"
              onClick={() => onRemoveFavorite(city)}
              aria-label={`${t.remove} ${city}`}
            >
              <FiX size="14px" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

Favorites.displayName = 'Favorites';

export default Favorites;