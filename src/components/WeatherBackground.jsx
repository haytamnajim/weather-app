import React, { useState, useEffect, useMemo } from 'react';

const WeatherBackground = React.memo(({ weather, isDarkMode }) => {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');

  // Memoize background selection to avoid unnecessary recalculations
  const backgrounds = useMemo(() => ({
    clear: {
      day: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      night: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
    },
    clouds: {
      day: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      night: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    },
    rain: {
      day: 'linear-gradient(135deg, #373b44 0%, #4286f4 100%)',
      night: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
    },
    snow: {
      day: 'linear-gradient(135deg, #83a4d4 0%, #b6fbff 100%)',
      night: 'linear-gradient(135deg, #e6dada 0%, #274046 100%)'
    },
    thunderstorm: {
      day: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
      night: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
    },
    mist: {
      day: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
      night: 'linear-gradient(135deg, #3e5151 0%, #decba4 100%)'
    },
    default: {
      day: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      night: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
    }
  }), []);

  useEffect(() => {
    if (!weather) return;

    const condition = weather.weather[0].main.toLowerCase();
    const isNight = new Date().getHours() < 6 || new Date().getHours() > 18;

    setWeatherCondition(condition);

    const dayNight = isNight ? 'night' : 'day';
    const selectedBackground = backgrounds[condition]?.[dayNight] || backgrounds.default[dayNight];
    setBackgroundImage(selectedBackground);
  }, [weather, isDarkMode, backgrounds]);

  return (
    <div
      className="weather-background"
      style={{
        background: backgroundImage,
        transition: 'background 1s ease-in-out'
      }}
    >
      {/* Animated gradient overlay */}
      <div className="background-overlay"></div>

      {/* Floating particles based on weather - optimized for performance */}
      {weatherCondition === 'clear' && (
        <div className="particles-container">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="particle sun-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {weatherCondition === 'rain' && (
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle rain-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 1}s`
              }}
            />
          ))}
        </div>
      )}

      {weatherCondition === 'snow' && (
        <div className="particles-container">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="particle snow-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {weatherCondition === 'clouds' && (
        <div className="particles-container">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="particle cloud-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

WeatherBackground.displayName = 'WeatherBackground';

export default WeatherBackground;