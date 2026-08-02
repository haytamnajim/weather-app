import React, { useState } from 'react';
import axios from 'axios';
import { FiMessageCircle, FiSend, FiX } from 'react-icons/fi';

const ChatWidget = ({ weather, onCityChange }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Bonjour ! Je suis votre assistant météo IA. Comment puis-je vous aider ?' }
  ]);
  const [userMsg, setUserMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const N8N_CHAT_URL = 'http://localhost:5678/webhook-test/4579519e-a76f-4d34-8f92-4cf8b33d24bf';

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
      });

      console.log("N8N Response Data:", response.data);

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
      const errorText = err.response 
        ? `Erreur ${err.response.status}: Vérifiez que le workflow n8n est ACTIF et configuré sur POST.` 
        : "Impossible de contacter l'IA. Vérifiez votre connexion ou l'URL n8n localhost.";
      setChatMessages(prev => [...prev, { role: 'assistant', content: errorText }]);
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
    </>
  );
};

export default ChatWidget;
