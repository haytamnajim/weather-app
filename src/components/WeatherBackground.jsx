import React, { useState, useEffect, useMemo } from 'react';

const WeatherBackground = React.memo(({ weather, isDarkMode }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');
  const [isNight, setIsNight] = useState(false);
  const [fallbackColor, setFallbackColor] = useState('');

  // Enhanced weather condition mapping
  const getWeatherCondition = (weatherMain, weatherId, windSpeed) => {
    const main = weatherMain.toLowerCase();
    const id = weatherId;

    // Thunderstorm (200-232)
    if (id >= 200 && id < 300) return 'thunderstorm';

    // Drizzle (300-321)
    if (id >= 300 && id < 400) return 'drizzle';

    // Rain (500-531)
    if (id >= 500 && id < 600) {
      if (id >= 520 && id < 532) return 'heavy_rain';
      return 'rain';
    }

    // Snow (600-622)
    if (id >= 600 && id < 700) return 'snow';

    // Atmosphere (700-781)
    if (id >= 700 && id < 800) {
      if (id === 701 || id === 741) return 'fog';
      if (id === 711 || id === 721) return 'mist';
      if (id >= 731 && id <= 781) return 'dust';
      return 'atmosphere';
    }

    // Clear (800)
    if (id === 800) return 'clear';

    // Clouds (801-804)
    if (id === 801) return 'partly_cloudy';
    if (id === 802) return 'scattered_clouds';
    if (id >= 803) return 'clouds';

    // Wind condition (check wind speed)
    if (windSpeed && windSpeed > 10) return 'windy';

    return 'default';
  };

  // Memoize video URLs with more specific conditions
  const videoUrls = useMemo(() => ({
    clear: {
      day: 'https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4', // Sunny day
      night: 'https://videos.pexels.com/video-files/855029/855029-hd_1920_1080_30fps.mp4' // Clear night
    },
    partly_cloudy: {
      day: 'https://videos.pexels.com/video-files/2078732/2078732-hd_1920_1080_25fps.mp4', // Partly cloudy day
      night: 'https://videos.pexels.com/video-files/855029/855029-hd_1920_1080_30fps.mp4' // Partly cloudy night
    },
    scattered_clouds: {
      day: 'https://videos.pexels.com/video-files/2078732/2078732-hd_1920_1080_25fps.mp4', // Scattered clouds day
      night: 'https://videos.pexels.com/video-files/855029/855029-hd_1920_1080_30fps.mp4' // Scattered clouds night
    },
    clouds: {
      day: 'https://videos.pexels.com/video-files/2078732/2078732-hd_1920_1080_25fps.mp4', // Cloudy day
      night: 'https://videos.pexels.com/video-files/855029/855029-hd_1920_1080_30fps.mp4' // Cloudy night
    },
    drizzle: {
      day: 'https://videos.pexels.com/video-files/5432215/5432215-hd_1920_1080_30fps.mp4', // Drizzle day
      night: 'https://videos.pexels.com/video-files/5432215/5432215-hd_1920_1080_30fps.mp4' // Drizzle night
    },
    rain: {
      day: 'https://videos.pexels.com/video-files/5432215/5432215-hd_1920_1080_30fps.mp4', // Rainy day
      night: 'https://videos.pexels.com/video-files/5432215/5432215-hd_1920_1080_30fps.mp4' // Rainy night
    },
    heavy_rain: {
      day: 'https://videos.pexels.com/video-files/5432215/5432215-hd_1920_1080_30fps.mp4', // Heavy rain day
      night: 'https://videos.pexels.com/video-files/5432215/5432215-hd_1920_1080_30fps.mp4' // Heavy rain night
    },
    snow: {
      day: 'https://videos.pexels.com/video-files/852804/852804-hd_1920_1080_25fps.mp4', // Snowy day
      night: 'https://videos.pexels.com/video-files/852804/852804-hd_1920_1080_25fps.mp4' // Snowy night
    },
    thunderstorm: {
      day: 'https://videos.pexels.com/video-files/1754656/1754656-hd_1920_1080_30fps.mp4', // Thunderstorm
      night: 'https://videos.pexels.com/video-files/1754656/1754656-hd_1920_1080_30fps.mp4' // Thunderstorm night
    },
    fog: {
      day: 'https://videos.pexels.com/video-files/2756393/2756393-hd_1920_1080_25fps.mp4', // Foggy day
      night: 'https://videos.pexels.com/video-files/2756393/2756393-hd_1920_1080_25fps.mp4' // Foggy night
    },
    mist: {
      day: 'https://videos.pexels.com/video-files/2756393/2756393-hd_1920_1080_25fps.mp4', // Misty day
      night: 'https://videos.pexels.com/video-files/2756393/2756393-hd_1920_1080_25fps.mp4' // Misty night
    },
    dust: {
      day: 'https://videos.pexels.com/video-files/2756393/2756393-hd_1920_1080_25fps.mp4', // Dusty day
      night: 'https://videos.pexels.com/video-files/2756393/2756393-hd_1920_1080_25fps.mp4' // Dusty night
    },
    atmosphere: {
      day: 'https://videos.pexels.com/video-files/2756393/2756393-hd_1920_1080_25fps.mp4', // Atmosphere day
      night: 'https://videos.pexels.com/video-files/2756393/2756393-hd_1920_1080_25fps.mp4' // Atmosphere night
    },
    windy: {
      day: 'https://videos.pexels.com/video-files/2078732/2078732-hd_1920_1080_25fps.mp4', // Windy day
      night: 'https://videos.pexels.com/video-files/855029/855029-hd_1920_1080_30fps.mp4' // Windy night
    },
    default: {
      day: 'https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4', // Default sunny
      night: 'https://videos.pexels.com/video-files/855029/855029-hd_1920_1080_30fps.mp4' // Default night
    }
  }), []);

  // Enhanced fallback colors for each condition
  const getFallbackColor = (condition, isNightTime) => {
    const nightColors = {
      clear: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      partly_cloudy: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      scattered_clouds: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      clouds: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
      drizzle: 'linear-gradient(135deg, #1a1a2e 0%, #2d4059 50%, #1a1a2e 100%)',
      rain: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      heavy_rain: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f0f 100%)',
      snow: 'linear-gradient(135deg, #2c3e50 0%, #4a5f6f 50%, #2c3e50 100%)',
      thunderstorm: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #2d132c 100%)',
      fog: 'linear-gradient(135deg, #3e3e3e 0%, #4a4a4a 50%, #3e3e3e 100%)',
      mist: 'linear-gradient(135deg, #4a4a4a 0%, #5a5a5a 50%, #4a4a4a 100%)',
      dust: 'linear-gradient(135deg, #5a4632 0%, #8b7355 50%, #5a4632 100%)',
      atmosphere: 'linear-gradient(135deg, #2c3e50 0%, #4a5f6f 50%, #2c3e50 100%)',
      windy: 'linear-gradient(135deg, #1a1a2e 0%, #2d4059 50%, #1a1a2e 100%)',
      default: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
    };

    const dayColors = {
      clear: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      partly_cloudy: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #4facfe 100%)',
      scattered_clouds: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #4facfe 100%)',
      clouds: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 50%, #89f7fe 100%)',
      drizzle: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
      rain: 'linear-gradient(135deg, #4a90e2 0%, #9013fe 50%, #4a90e2 100%)',
      heavy_rain: 'linear-gradient(135deg, #3a506b 0%, #1c2541 50%, #3a506b 100%)',
      snow: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 50%, #e0e0e0 100%)',
      thunderstorm: 'linear-gradient(135deg, #1a1a2e 0%, #2d4059 50%, #1a1a2e 100%)',
      fog: 'linear-gradient(135deg, #d3d3d3 0%, #e8e8e8 50%, #d3d3d3 100%)',
      mist: 'linear-gradient(135deg, #c0c0c0 0%, #d8d8d8 50%, #c0c0c0 100%)',
      dust: 'linear-gradient(135deg, #d4a574 0%, #e8c39e 50%, #d4a574 100%)',
      atmosphere: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 50%, #a8e6cf 100%)',
      windy: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #4facfe 100%)',
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
    };

    return isNightTime ? nightColors[condition] || nightColors.default : dayColors[condition] || dayColors.default;
  };

  useEffect(() => {
    if (!weather) return;

    const weatherMain = weather.weather[0].main;
    const weatherId = weather.weather[0].id;
    const windSpeed = weather.wind?.speed;
    const condition = getWeatherCondition(weatherMain, weatherId, windSpeed);

    // Calculate local time based on city timezone if available
    let currentTime = new Date().getHours();
    if (weather.timezone) {
      const cityTime = new Date((Date.now() / 1000 + weather.timezone) * 1000);
      currentTime = cityTime.getUTCHours();
    }

    const nightTime = currentTime < 6 || currentTime > 18;

    setWeatherCondition(condition);
    setIsNight(nightTime);
    setFallbackColor(getFallbackColor(condition, nightTime));

    const dayNight = nightTime ? 'night' : 'day';
    const selectedVideo = videoUrls[condition]?.[dayNight] || videoUrls.default[dayNight];
    setVideoUrl(selectedVideo);
  }, [weather, isDarkMode, videoUrls]);

  return (
    <div className="weather-background">
      {/* Weather background image */}
      <div className="weather-image-background"></div>

      {/* Video background */}
      {videoUrl && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="weather-video"
          key={videoUrl}
          onError={() => {
            // Fallback to gradient if video fails
            console.warn('Video failed to load, using fallback gradient');
            setVideoUrl('');
          }}
          onLoadStart={() => {
            console.log('Loading video:', videoUrl);
          }}
          onCanPlay={() => {
            console.log('Video ready to play:', videoUrl);
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Fallback gradient background */}
      {!videoUrl && (
        <div
          className="fallback-background"
          style={{
            background: fallbackColor || (isNight
              ? 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)')
          }}
        />
      )}

      {/* Overlay for better readability & Dynamic Aurora Ambient Glow */}
      <div className="background-overlay"></div>
      <div className="ambient-mesh-glow">
        <div className={`glow-orb orb-1 ${isNight ? 'orb-night-1' : 'orb-day-1'}`}></div>
        <div className={`glow-orb orb-2 ${isNight ? 'orb-night-2' : 'orb-day-2'}`}></div>
        <div className={`glow-orb orb-3 ${isNight ? 'orb-night-3' : 'orb-day-3'}`}></div>
      </div>
    </div>
  );
});

WeatherBackground.displayName = 'WeatherBackground';

export default WeatherBackground;