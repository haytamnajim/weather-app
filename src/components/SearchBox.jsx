import React, { useState, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';
import { MOROCCAN_CITIES } from '../utils/cities';

const SearchBox = React.memo(({ onSearch, placeholder = "Chercher une ville...", language = 'fr' }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const isRTL = language === 'ar';

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 1) {
      const filtered = MOROCCAN_CITIES.filter(city => {
        const cityName = isRTL ? city.arabicName : city.name;
        return cityName.toLowerCase().includes(value.toLowerCase()) ||
               city.name.toLowerCase().includes(value.toLowerCase()) ||
               city.arabicName.includes(value);
      }).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [isRTL]);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input, onSearch]);

  const handleSelectSuggestion = useCallback((city) => {
    setInput('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(city.name);
  }, [onSearch]);

  const getCityDisplayName = (city) => {
    return isRTL ? city.arabicName : city.name;
  };

  return (
    <div className="search-container">
      <form className="searchBox" onSubmit={handleSearchSubmit}>
        <input
          className="searchInput"
          type="text"
          value={input}
          onChange={handleInputChange}
          onFocus={() => input.length > 1 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <button className="searchButton" type="submit">
          <FiSearch size="20px" />
        </button>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list glass" dir={isRTL ? 'rtl' : 'ltr'}>
            {suggestions.map((city, index) => (
              <li key={index} onMouseDown={() => handleSelectSuggestion(city)}>
                {getCityDisplayName(city)}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
});

SearchBox.displayName = 'SearchBox';

export default SearchBox;
