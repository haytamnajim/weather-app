import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { MOROCCAN_CITIES } from '../utils/cities';

const SearchBox = ({ onSearch }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 1) {
      const filtered = MOROCCAN_CITIES.filter(city =>
        city.toLowerCase().startsWith(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (city) => {
    setInput('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(city);
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
          placeholder="Chercher une ville..."
        />
        <button className="searchButton" type="submit">
          <FiSearch size="20px" />
        </button>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list glass">
            {suggestions.map((city, index) => (
              <li key={index} onMouseDown={() => handleSelectSuggestion(city)}>
                {city}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default SearchBox;
