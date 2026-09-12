import React, { useState, useEffect, useMemo } from 'react';

const WeatherBackground = React.memo(({ weather, isDarkMode }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('');
  const [isNight, setIsNight] = useState(false);

  // Memoize video URLs to avoid unnecessary recalculations
  const videoUrls = useMemo(() => ({
    clear: {
      day: 'https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4', // Sunny day
      night: 'https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4' // Clear night
    },
    clouds: {
      day: 'https://videos.pexels.com/video-files/2078732/2078732-hd_1920_1080_25fps.mp4', // Cloudy day
      night: 'https://videos.pexels.com/video-files/855029/855029-hd_1920_1080_30fps.mp4' // Cloudy night
    },
    rain: {
      day: 'https://videos.pexels.com/video-files/5432215/5432215-hd_1920_1080_30fps.mp4', // Rainy day
      night: 'https://videos.pexels.com/video-files/5432215/5432215-hd_1920_1080_30fps.mp4' // Rainy night
    },
    snow: {
      day: 'https://videos.pexels.com/video-files/852804/852804-hd_1920_1080_25fps.mp4', // Snowy day
      night: 'https://videos.pexels.com/video-files/852804/852804-hd_1920_1080_25fps.mp4' // Snowy night
    },
    thunderstorm: {
      day: 'https://videos.pexels.com/video-files/1754656/1754656-hd_1920_1080_30fps.mp4', // Thunderstorm
      night: 'https://videos.pexels.com/video-files/1754656/1754656-hd_1920_1080_30fps.mp4' // Thunderstorm night
    },
    mist: {
      day: 'https://videos.pexels.com/video-files/2756393/2756393-hd_1920_1080_25fps.mp4', // Foggy day
      night: 'https://videos.pexels.com/video-files/2756393/2756393-hd_1920_1080_25fps.mp4' // Foggy night
    },
    default: {
      day: 'https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4', // Default sunny
      night: 'https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4' // Default night
    }
  }), []);

  useEffect(() => {
    if (!weather) return;

    const condition = weather.weather[0].main.toLowerCase();
    const currentTime = new Date().getHours();
    const nightTime = currentTime < 6 || currentTime > 18;

    setWeatherCondition(condition);
    setIsNight(nightTime);

    const dayNight = nightTime ? 'night' : 'day';
    const selectedVideo = videoUrls[condition]?.[dayNight] || videoUrls.default[dayNight];
    setVideoUrl(selectedVideo);
  }, [weather, isDarkMode, videoUrls]);

  return (
    <div className="weather-background">
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
            console.warn('Video failed to load, using fallback');
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
            background: isNight
              ? 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
          }}
        />
      )}

      {/* Overlay for better readability */}
      <div className="background-overlay"></div>
    </div>
  );
});

WeatherBackground.displayName = 'WeatherBackground';

export default WeatherBackground;