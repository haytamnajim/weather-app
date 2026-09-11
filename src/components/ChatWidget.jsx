import React, { useState } from 'react';
import axios from 'axios';
import { FiMessageCircle, FiSend, FiX, FiAlertCircle } from 'react-icons/fi';
import { N8N_CHAT_URL } from '../utils/constants';

const ChatWidget = ({ weather, onCityChange }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Bonjour ! Je suis votre assistant météo IA. Comment puis-je vous aider ?' }
  ]);
  const [userMsg, setUserMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const getFallbackResponse = (message, weatherContext) => {
    const lowerMessage = message.toLowerCase();

    // Simple rule-based fallback
    if (lowerMessage.includes('température') || lowerMessage.includes('temp') || lowerMessage.includes('chaud') || lowerMessage.includes('froid')) {
      if (weatherContext) {
        return `Actuellement, il fait ${Math.round(weatherContext.temp)}°C à ${weatherContext.city} avec ${weatherContext.desc}.`;
      }
      return "Je peux vous donner les informations de température une fois que vous avez sélectionné une ville.";
    }

    if (lowerMessage.includes('humidité') || lowerMessage.includes('humide') || lowerMessage.includes('sec')) {
      if (weatherContext) {
        return "Pour les informations d'humidité détaillées, consultez la section des métriques météo dans l'application.";
      }
      return "Je peux vous donner les informations d'humidité une fois que vous avez sélectionné une ville.";
    }

    if (lowerMessage.includes('vent') || lowerMessage.includes('vente')) {
      if (weatherContext) {
        return "Je peux vous donner les informations sur le vent une fois que vous avez sélectionné une ville.";
      }
      return "Pour les informations sur le vent, veuillez d'abord sélectionner une ville.";
    }

    if (lowerMessage.includes('prévision') || lowerMessage.includes('demain') || lowerMessage.includes('après')) {
      return "Pour les prévisions météo détaillées, consultez la section des prévisions dans l'application.";
    }

    if (lowerMessage.includes('ville') || lowerMessage.includes('changer') || lowerMessage.includes('météo')) {
      const cityMatches = message.match(/(?:à|de|pour)\s+([a-zA-Z\s]+)/i);
      if (cityMatches && cityMatches[1]) {
        const cityName = cityMatches[1].trim();
        return `Je vais chercher la météo pour ${cityName}. Veuillez utiliser la barre de recherche pour confirmer.`;
      }
      return "Pour changer de ville, utilisez la barre de recherche en haut de l'application.";
    }

    // Default fallback responses
    const defaultResponses = [
      "Je suis désolé, le service IA n'est pas disponible actuellement. Je peux vous aider avec les informations de base sur la météo actuelle.",
      "Le service de chat IA est temporairement indisponible. Vous pouvez consulter les informations météo détaillées dans l'application.",
      "Je fonctionne en mode limité. Posez-moi des questions sur la température, l'humidité ou les prévisions pour l'aide de base."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    const newMessage = { role: 'user', content: userMsg };
    setChatMessages(prev => [...prev, newMessage]);
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
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("N8N Response Data:", response.data);
      setIsOffline(false);

      let data = Array.isArray(response.data) ? response.data[0] : response.data;
      let aiResponse = data?.output || data?.response || data?.text || (typeof data === 'string' ? data : null);
      let imageUrl = data?.imageUrl;

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

      if (typeof aiResponse === 'string' && aiResponse.includes('IMAGE_PROMPT:')) {
        aiResponse = aiResponse.split('IMAGE_PROMPT:')[0].trim();
      }

      try {
        let cleanResponse = typeof aiResponse === 'string' ? aiResponse.trim() : aiResponse;

        if (typeof cleanResponse === 'string' && cleanResponse.includes('```')) {
          const match = cleanResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (match) cleanResponse = match[1].trim();
        }

        const parsed = typeof cleanResponse === 'object' ? cleanResponse : JSON.parse(cleanResponse);

        if (parsed && parsed.action === 'change_city' && parsed.city) {
          if (onCityChange) {
            onCityChange(parsed.city);
          }
          aiResponse = `D'accord, je change la ville pour ${parsed.city}. 🌍`;
        }
      } catch {
        // Keep normal text response
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse, imageUrl: imageUrl }]);
    } catch (err) {
      console.error("Chat Error Detailed:", err);
      setIsOffline(true);

      // Use fallback response when AI service is unavailable
      const fallbackResponse = getFallbackResponse(userMsg, weather ? {
        city: weather.name,
        temp: weather.main.temp,
        desc: weather.weather[0].description
      } : null);

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: fallbackResponse,
        isFallback: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
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
            {isOffline && (
              <div className="offline-indicator">
                <FiAlertCircle size="16px" />
                <span>Mode hors-ligne</span>
              </div>
            )}
          </div>
          <div className="chat-messages">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role} ${msg.isFallback ? 'fallback' : ''}`}>
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
              placeholder={isOffline ? "Mode limité - posez des questions simples..." : "Posez une question..."}
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
            />
            <button type="submit">
              <FiSend size="18px" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
