import React from 'react';
import { FiHeart, FiX } from 'react-icons/fi';

const Favorites = React.memo(({ favorites, onSelectFavorite, onRemoveFavorite, isFavorite }) => {
  if (favorites.length === 0) return null;

  return (
    <div className="favorites-container">
      <h3 className="favorites-title">Villes favorites</h3>
      <div className="favorites-list">
        {favorites.map((city, index) => (
          <div key={index} className="favorite-item">
            <button
              className="favorite-btn"
              onClick={() => onSelectFavorite(city)}
              aria-label={`Select ${city}`}
            >
              <FiHeart size="16px" className="favorite-icon" />
              {city}
            </button>
            <button
              className="remove-favorite-btn"
              onClick={() => onRemoveFavorite(city)}
              aria-label={`Remove ${city} from favorites`}
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