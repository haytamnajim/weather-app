import React from 'react';
import { FiGlobe } from 'react-icons/fi';

const LanguageToggle = React.memo(({ language, onChangeLanguage, isRTL }) => {
  return (
    <button
      className="language-toggle-btn"
      onClick={() => onChangeLanguage(language === 'fr' ? 'ar' : 'fr')}
      aria-label="Change language"
      title={language === 'fr' ? 'العربية' : 'Français'}
    >
      <FiGlobe size="20px" />
      <span className="language-text">{language === 'fr' ? 'FR' : 'AR'}</span>
    </button>
  );
});

LanguageToggle.displayName = 'LanguageToggle';

export default LanguageToggle;