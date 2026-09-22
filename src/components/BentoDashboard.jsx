import React from 'react';

const BentoDashboard = React.memo(({ weather, forecast, children, language = 'fr' }) => {
  const isRTL = language === 'ar';

  return (
    <div className="bento-dashboard" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bento-grid">
        {/* Main Weather Card - Large */}
        <div className="bento-item bento-large">
          {children[0]}
        </div>

        {/* Sun/Moon - Medium */}
        <div className="bento-item bento-medium">
          {children[1]}
        </div>

        {/* Air Quality - Medium */}
        <div className="bento-item bento-medium">
          {children[2]}
        </div>

        {/* Alerts - Medium */}
        <div className="bento-item bento-medium">
          {children[3]}
        </div>

        {/* Hourly Timeline - Wide */}
        <div className="bento-item bento-wide">
          {children[4]}
        </div>

        {/* Forecast - Wide */}
        <div className="bento-item bento-wide">
          {children[5]}
        </div>

        {/* Charts - Wide */}
        <div className="bento-item bento-wide">
          {children[6]}
        </div>
      </div>
    </div>
  );
});

BentoDashboard.displayName = 'BentoDashboard';

export default BentoDashboard;