import React from 'react';

const WeatherSkeleton = () => {
  return (
    <div className="skeleton-container">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-toggle"></div>
      </div>

      <div className="skeleton-search"></div>

      <div className="skeleton-content">
        <div className="skeleton-card">
          <div className="skeleton-city"></div>
          <div className="skeleton-description"></div>
          <div className="skeleton-icon"></div>
          <div className="skeleton-temp"></div>
          <div className="skeleton-metrics">
            <div className="skeleton-metric"></div>
            <div className="skeleton-metric"></div>
            <div className="skeleton-metric"></div>
          </div>
          <div className="skeleton-minmax">
            <div className="skeleton-min"></div>
            <div className="skeleton-max"></div>
          </div>
        </div>

        <div className="skeleton-forecast">
          <div className="skeleton-forecast-title"></div>
          <div className="skeleton-forecast-item"></div>
          <div className="skeleton-forecast-item"></div>
          <div className="skeleton-forecast-item"></div>
          <div className="skeleton-forecast-item"></div>
          <div className="skeleton-forecast-item"></div>
        </div>
      </div>
    </div>
  );
};

export default WeatherSkeleton;