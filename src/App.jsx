import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './MinimalistStyles.css'
import WeatherCardGlass from './components/WeatherCardGlass'
import WeatherCharts from './components/WeatherCharts'
import {
  WiDaySunny, WiCloud, WiRain, WiSnow, WiFog
} from 'react-icons/wi'
import { FiSearch, FiSun, FiCloud, FiCloudRain, FiMessageCircle, FiSend, FiX } from 'react-icons/fi'
import RainEffect from './components/RainEffect'
import { MOROCCAN_CITIES } from './utils/cities'

function App() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Bonjour ! Je suis votre assistant météo IA. Comment puis-je vous aider ?' }
  ])
  const [userMsg, setUserMsg] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const N8N_CHAT_URL = 'http://localhost:5678/webhook-test/4579519e-a76f-4d34-8f92-4cf8b33d24bf'

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    const newMessage = { role: 'user', content: userMsg };
    setChatMessages([...chatMessages, newMessage]);
    setUserMsg('');
    setIsTyping(true);

    try {
      const response = await axios.post(N8N_CHAT_URL, {
        message: userMsg,
        history: chatMessages,
        weatherContext: weather ? {
          city: weather.name,
          temp: weather.main.temp,
          desc: weather.weather[0].description
        } : null
      }, {
        headers: {
          // 'ngrok-skip-browser-warning': 'true'
        }
      });

      console.log("N8N Response Data:", response.data);

      let data = Array.isArray(response.data) ? response.data[0] : response.data;
      let aiResponse = data?.output || data?.response || data?.text || (typeof data === 'string' ? data : null);
      let imageUrl = data?.imageUrl;

      // Recherche automatique si toujours rien (on ignore les expressions n8n brutes)
      if (!aiResponse && !imageUrl && typeof data === 'object') {
        const firstStringKey = Object.keys(data).find(k =>
          typeof data[k] === 'string' &&
          data[k].length > 5 &&
          !data[k].includes('{{')
        );
        if (firstStringKey) aiResponse = data[firstStringKey];
      }

      if (!aiResponse && !imageUrl) {
        aiResponse = "Erreur de format : n8n a envoyé un objet sans champ 'text' ou 'imageUrl'. Vérifiez votre nœud final.";
        console.warn("Possible malformed response:", data);
      }

      // Nettoyage : Si IMAGE_PROMPT est présent, on le retire du texte affiché
      if (typeof aiResponse === 'string' && aiResponse.includes('IMAGE_PROMPT:')) {
        aiResponse = aiResponse.split('IMAGE_PROMPT:')[0].trim();
      }

      // Logique d'Action IA : Détection de JSON dans la réponse
      try {
        let cleanResponse = typeof aiResponse === 'string' ? aiResponse.trim() : aiResponse;

        // Extraction du JSON si entouré de backticks (ex: ```json ... ```)
        if (typeof cleanResponse === 'string' && cleanResponse.includes('```')) {
          const match = cleanResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (match) cleanResponse = match[1].trim();
        }

        const data = typeof cleanResponse === 'object' ? cleanResponse : JSON.parse(cleanResponse);

        if (data && data.action === 'change_city' && data.city) {
          fetchData(data.city);
          aiResponse = `D'accord, je change la ville pour ${data.city}. 🌍`;
        }
      } catch (e) {
        // Ce n'était pas du JSON valide, on garde la réponse texte normale
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse, imageUrl: imageUrl }]);
    } catch (err) {
      console.error("Chat Error Detailed:", err);
      const errorText = err.response ? `Erreur ${err.response.status}: Vérifiez que le workflow n8n est ACTIF et configuré sur POST.` : "Impossible de contacter l'IA. Vérifiez votre connexion ou l'URL n8n localhost.";
      setChatMessages(prev => [...prev, { role: 'assistant', content: errorText }]);
    } finally {
      setIsTyping(false);
    }
  }

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const API_KEY = '346871855ae2ee3d144f3306bff7579d'

  const fetchData = async (cityName) => {
    if (!cityName) return;
    setLoading(true)
    setError('')
    try {
      const wUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},MA&appid=${API_KEY}&units=metric&lang=fr`;
      const fUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},MA&appid=${API_KEY}&units=metric&lang=fr`;

      const [wRes, fRes] = await Promise.all([
        axios.get(wUrl),
        axios.get(fUrl),
        new Promise(resolve => setTimeout(resolve, 2000)) // Délai artificiel pour voir l'animation
      ])

      setWeather(wRes.data)
      setForecast(fRes.data)
    } catch (err) {
      setError('Ville non trouvée')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData('Casablanca')
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (input.trim()) {
      fetchData(input.trim())
      setInput('')
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

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
  }

  const handleSelectSuggestion = (city) => {
    setInput(city);
    fetchData(city);
    setInput('');
    setSuggestions([]);
    setShowSuggestions(false);
  }

  const getWeatherIcon = (id, size = "1em") => {
    if (id >= 200 && id < 600) return <FiCloudRain size={size} />;
    if (id >= 600 && id < 700) return <WiSnow size={size} />;
    if (id >= 700 && id < 800) return <WiFog size={size} />;
    if (id === 800) return <FiSun size={size} />;
    return <FiCloud size={size} />;
  }

  return (
    <div className={`fast-app ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header-top">
        <h1>Météo Maroc</h1>

        <div className="toggleWrapper">
          <input
            className="input"
            id="dn"
            type="checkbox"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
          />
          <label className="toggle" htmlFor="dn">
            <span className="toggle__handler">
              <span className="crater crater--1"></span>
              <span className="crater crater--2"></span>
              <span className="crater crater--3"></span>
            </span>
            <span className="star star--1"></span>
            <span className="star star--2"></span>
            <span className="star star--3"></span>
            <span className="star star--4"></span>
            <span className="star star--5"></span>
            <span className="star star--6"></span>
          </label>
        </div>
      </div>

      <div className="search-container">
        <form className="searchBox" onSubmit={handleSearch}>
          <input
            className="searchInput"
            type="text"
            value={input}
            onChange={handleInputChange}
            onFocus={() => input.length > 1 && setShowSuggestions(true)}
            placeholder="Chercher une ville..."
          />
          <button className="searchButton" type="submit">
            <FiSearch size="20px" />
          </button>

          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list glass">
              {suggestions.map((city, index) => (
                <li key={index} onClick={() => handleSelectSuggestion(city)}>
                  {city}
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>

      {weather && weather.weather[0].main.toLowerCase().includes('rain') && <RainEffect />}

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loader-container">
          <div className="loader">
            <svg id="cloud" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <defs>
                <filter id="roundness">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"></feGaussianBlur>
                  <feColorMatrix
                    values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10"
                  ></feColorMatrix>
                </filter>
                <mask id="shapes">
                  <g fill="white">
                    <polygon points="50 37.5 80 75 20 75 50 37.5"></polygon>
                    <circle cx="20" cy="60" r="15"></circle>
                    <circle cx="80" cy="60" r="15"></circle>
                    <g>
                      <circle cx="20" cy="60" r="15"></circle>
                      <circle cx="20" cy="60" r="15"></circle>
                      <circle cx="20" cy="60" r="15"></circle>
                    </g>
                  </g>
                </mask>
                <mask id="clipping" clipPathUnits="userSpaceOnUse">
                  <g id="lines" filter="url(#roundness)">
                    <g mask="url(#shapes)" stroke="white">
                      <line x1="-50" y1="-40" x2="150" y2="-40"></line>
                      <line x1="-50" y1="-31" x2="150" y2="-31"></line>
                      <line x1="-50" y1="-22" x2="150" y2="-22"></line>
                      <line x1="-50" y1="-13" x2="150" y2="-13"></line>
                      <line x1="-50" y1="-4" x2="150" y2="-4"></line>
                      <line x1="-50" y1="5" x2="150" y2="5"></line>
                      <line x1="-50" y1="14" x2="150" y2="14"></line>
                      <line x1="-50" y1="23" x2="150" y2="23"></line>
                      <line x1="-50" y1="32" x2="150" y2="32"></line>
                      <line x1="-50" y1="41" x2="150" y2="41"></line>
                      <line x1="-50" y1="50" x2="150" y2="50"></line>
                      <line x1="-50" y1="59" x2="150" y2="59"></line>
                      <line x1="-50" y1="68" x2="150" y2="68"></line>
                      <line x1="-50" y1="77" x2="150" y2="77"></line>
                      <line x1="-50" y1="86" x2="150" y2="86"></line>
                      <line x1="-50" y1="95" x2="150" y2="95"></line>
                      <line x1="-50" y1="104" x2="150" y2="104"></line>
                      <line x1="-50" y1="113" x2="150" y2="113"></line>
                      <line x1="-50" y1="122" x2="150" y2="122"></line>
                      <line x1="-50" y1="131" x2="150" y2="131"></line>
                      <line x1="-50" y1="140" x2="150" y2="140"></line>
                    </g>
                  </g>
                </mask>
              </defs>
              <rect
                x="0"
                y="0"
                width="100"
                height="100"
                rx="0"
                ry="0"
                mask="url(#clipping)"
              ></rect>
              <g>
                <path
                  d="M33.52,68.12 C35.02,62.8 39.03,58.52 44.24,56.69 C49.26,54.93 54.68,55.61 59.04,58.4 C59.04,58.4 56.24,60.53 56.24,60.53 C55.45,61.13 55.68,62.37 56.63,62.64 C56.63,62.64 67.21,65.66 67.21,65.66 C67.98,65.88 68.75,65.3 68.74,64.5 C68.74,64.5 68.68,53.5 68.68,53.5 C68.67,52.51 67.54,51.95 66.75,52.55 C66.75,52.55 64.04,54.61 64.04,54.61 C57.88,49.79 49.73,48.4 42.25,51.03 C35.2,53.51 29.78,59.29 27.74,66.49 C27.29,68.08 28.22,69.74 29.81,70.19 C30.09,70.27 30.36,70.31 30.63,70.31 C31.94,70.31 33.14,69.44 33.52,68.12Z"
                ></path>
                <path
                  d="M69.95,74.85 C68.35,74.4 66.7,75.32 66.25,76.92 C64.74,82.24 60.73,86.51 55.52,88.35 C50.51,90.11 45.09,89.43 40.73,86.63 C40.73,86.63 43.53,84.51 43.53,84.51 C44.31,83.91 44.08,82.67 43.13,82.4 C43.13,82.4 32.55,79.38 32.55,79.38 C31.78,79.16 31.02,79.74 31.02,80.54 C31.02,80.54 31.09,91.54 31.09,91.54 C31.09,92.53 32.22,93.09 33.01,92.49 C33.01,92.49 35.72,90.43 35.72,90.43 C39.81,93.63 44.77,95.32 49.84,95.32 C52.41,95.32 55,94.89 57.51,94.01 C64.56,91.53 69.99,85.75 72.02,78.55 C72.47,76.95 71.54,75.3 69.95,74.85Z"
                ></path>
              </g>
            </svg>
          </div>
        </div>
      ) : (
        <main className="content">
          <div className="main-weather-col">
            {weather && <WeatherCardGlass weather={weather} />}
          </div>

          {forecast && (() => {
            const dailyData = [];
            const days = {};
            forecast.list.forEach(item => {
              const date = new Date(item.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'long' });
              if (!days[date]) {
                days[date] = {
                  dt: item.dt,
                  temp_min: item.main.temp,
                  temp_max: item.main.temp,
                  icon: item.weather[0].id
                };
                dailyData.push(days[date]);
              } else {
                days[date].temp_min = Math.min(days[date].temp_min, item.main.temp);
                days[date].temp_max = Math.max(days[date].temp_max, item.main.temp);
              }
            });

            const slicedData = dailyData.slice(0, 5);
            const globalMin = Math.min(...slicedData.map(d => d.temp_min));
            const globalMax = Math.max(...slicedData.map(d => d.temp_max));
            const totalRange = globalMax - globalMin;

            return (
              <section className="forecast-section">
                <h3 className="forecast-title">Prévisions</h3>
                <div className="forecast-list">
                  {slicedData.map((day, idx) => {
                    const left = ((day.temp_min - globalMin) / totalRange) * 100;
                    const width = ((day.temp_max - day.temp_min) / totalRange) * 100;

                    return (
                      <div key={idx} className="forecast-item">
                        <span className="day">{idx === 0 ? "Aujourd'hui" : new Date(day.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                        <span className="f-icon">{getWeatherIcon(day.icon, "22px")}</span>
                        <span className="f-temp low">{Math.round(day.temp_min)}°</span>
                        <div className="temp-bar-container">
                          <div className="temp-bar-bg"></div>
                          <div
                            className="temp-bar-fill"
                            style={{
                              left: `${left}%`,
                              width: `${Math.max(width, 5)}%`
                            }}
                          ></div>
                        </div>
                        <span className="f-temp high">{Math.round(day.temp_max)}°</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })()}

          {forecast && <WeatherCharts forecast={forecast} isDarkMode={isDarkMode} />}
        </main>
      )}


      <button
        className="chat-toggle-btn"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        {isChatOpen ? <FiX size="28px" /> : <FiMessageCircle size="28px" />}
      </button>

      {isChatOpen && (
        <div className="chat-window glass">
          <div className="chat-header">
            <h4>Assistant IA</h4>
          </div>
          <div className="chat-messages">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                {msg.content}
                {msg.imageUrl && (
                  <img src={msg.imageUrl} alt="IA Look" className="chat-image" />
                )}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble assistant typing">
                <span>.</span><span>.</span><span>.</span>
              </div>
            )}
          </div>
          <form className="chat-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Posez une question..."
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
            />
            <button type="submit">
              <FiSend size="18px" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
