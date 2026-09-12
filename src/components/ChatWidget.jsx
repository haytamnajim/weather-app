import React, { useState } from 'react';
import axios from 'axios';
import { FiMessageCircle, FiSend, FiX, FiAlertCircle } from 'react-icons/fi';
import { N8N_CHAT_URL, translations } from '../utils/constants';

const ChatWidget = ({ weather, onCityChange, language = 'fr' }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [userMsg, setUserMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const isRTL = language === 'ar';

  const t = (key) => {
    return translations[language]?.[key] || translations.fr[key] || key;
  };

  const getInitialMessage = () => {
    return isRTL
      ? 'مرحباً! أنا مساعدك الذكي للطقس. كيف يمكنني مساعدتك؟'
      : 'Bonjour ! Je suis votre assistant météo IA. Comment puis-je vous aider ?';
  };

  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: getInitialMessage() }
  ]);

  const getFallbackResponse = (message, weatherContext) => {
    const lowerMessage = message.toLowerCase();

    // Arabic and French keywords
    const tempKeywords = isRTL
      ? ['حرارة', 'درجة', 'حار', 'بارد', 'درجة حرارة']
      : ['température', 'temp', 'chaud', 'froid'];

    const humidityKeywords = isRTL
      ? ['رطوبة', 'رطب', 'جاف']
      : ['humidité', 'humide', 'sec'];

    const windKeywords = isRTL
      ? ['رياح', 'هواء']
      : ['vent', 'vente'];

    const forecastKeywords = isRTL
      ? ['توقعات', 'غدا', 'بعد']
      : ['prévision', 'demain', 'après'];

    const cityKeywords = isRTL
      ? ['مدينة', 'تغيير', 'طقس']
      : ['ville', 'changer', 'météo'];

    // Simple rule-based fallback
    if (tempKeywords.some(keyword => lowerMessage.includes(keyword))) {
      if (weatherContext) {
        return isRTL
          ? `حالياً، درجة الحرارة ${Math.round(weatherContext.temp)}°C في ${weatherContext.city} مع ${weatherContext.desc}.`
          : `Actuellement, il fait ${Math.round(weatherContext.temp)}°C à ${weatherContext.city} avec ${weatherContext.desc}.`;
      }
      return isRTL
        ? "يمكنني إعطائك معلومات درجة الحرارة بمجرد اختيار مدينة."
        : "Je peux vous donner les informations de température une fois que vous avez sélectionné une ville.";
    }

    if (humidityKeywords.some(keyword => lowerMessage.includes(keyword))) {
      if (weatherContext) {
        return isRTL
          ? "للمعلومات التفصيلية عن الرطوبة، راجع قسم مقاييس الطقس في التطبيق."
          : "Pour les informations d'humidité détaillées, consultez la section des métriques météo dans l'application.";
      }
      return isRTL
        ? "يمكنني إعطائك معلومات الرطوبة بمجرد اختيار مدينة."
        : "Je peux vous donner les informations d'humidité une fois que vous avez sélectionné une ville.";
    }

    if (windKeywords.some(keyword => lowerMessage.includes(keyword))) {
      if (weatherContext) {
        return isRTL
          ? "يمكنني إعطائك معلومات الرياح بمجرد اختيار مدينة."
          : "Je peux vous donner les informations sur le vent une fois que vous avez sélectionné une ville.";
      }
      return isRTL
        ? "للمعلومات عن الرياح، يرجى اختيار مدينة أولاً."
        : "Pour les informations sur le vent, veuillez d'abord sélectionner une ville.";
    }

    if (forecastKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return isRTL
        ? "للتوقعات التفصيلية، راجع قسم التوقعات في التطبيق."
        : "Pour les prévisions météo détaillées, consultez la section des prévisions dans l'application.";
    }

    if (cityKeywords.some(keyword => lowerMessage.includes(keyword))) {
      const cityMatches = message.match(/(?:في|من|لـ|à|de|pour)\s+([a-zA-Z\s\u0600-\u06FF]+)/i);
      if (cityMatches && cityMatches[1]) {
        const cityName = cityMatches[1].trim();
        return isRTL
          ? `سأبحث عن طقس ${cityName}. يرجى استخدام شريط البحث للتأكيد.`
          : `Je vais chercher la météo pour ${cityName}. Veuillez utiliser la barre de recherche pour confirmer.`;
      }
      return isRTL
        ? "لتغيير المدينة، استخدم شريط البحث في أعلى التطبيق."
        : "Pour changer de ville, utilisez la barre de recherche en haut de l'application.";
    }

    // Default fallback responses
    const defaultResponses = isRTL
      ? [
          "أنا آسف، خدمة الذكاء الاصطناعي غير متاحة حالياً. يمكنني مساعدتك بمعلومات أساسية عن الطقس الحالي.",
          "خدمة الدردشة غير متاحة مؤقتاً. يمكنك الاطلاع على معلومات الطقس التفصيلية في التطبيق.",
          "أنا أعمل في وضع محدود. اسألني عن درجة الحرارة أو الرطوبة أو التوقعات للحصول على مساعدة أساسية."
        ]
      : [
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
          aiResponse = isRTL
            ? `حسناً، سأغير المدينة إلى ${parsed.city}. 🌍`
            : `D'accord, je change la ville pour ${parsed.city}. 🌍`;
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
        <div className="chat-window glass" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="chat-header">
            <h4>{t('assistant')}</h4>
            {isOffline && (
              <div className="offline-indicator">
                <FiAlertCircle size="16px" />
                <span>{t('offlineMode')}</span>
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
              placeholder={isOffline ? t('limitedMode') : t('askQuestion')}
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              dir={isRTL ? 'rtl' : 'ltr'}
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
