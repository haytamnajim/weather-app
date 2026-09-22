import React from 'react';
import { FiHome, FiCalendar, FiMap, FiAlertTriangle, FiActivity, FiSun, FiCloud, FiTrendingUp } from 'react-icons/fi';

const DashboardNavigation = React.memo(({ activeTab, onTabChange, language = 'fr' }) => {
  const isRTL = language === 'ar';

  const translations = {
    fr: {
      today: 'Aujourd\'hui',
      forecast: 'Prévisions',
      map: 'Carte',
      alerts: 'Alertes',
      health: 'Santé',
      radar: 'Radar',
      stats: 'Statistiques'
    },
    ar: {
      today: 'اليوم',
      forecast: 'التوقعات',
      map: 'الخريطة',
      alerts: 'التنبيهات',
      health: 'الصحة',
      radar: 'الرادار',
      stats: 'الإحصائيات'
    }
  };

  const t = translations[language];

  const tabs = [
    { id: 'today', icon: <FiHome size="20px" />, label: t.today },
    { id: 'forecast', icon: <FiCalendar size="20px" />, label: t.forecast },
    { id: 'map', icon: <FiMap size="20px" />, label: t.map },
    { id: 'alerts', icon: <FiAlertTriangle size="20px" />, label: t.alerts },
    { id: 'health', icon: <FiActivity size="20px" />, label: t.health },
    { id: 'radar', icon: <FiCloud size="20px" />, label: t.radar },
    { id: 'stats', icon: <FiTrendingUp size="20px" />, label: t.stats }
  ];

  return (
    <div className="dashboard-navigation" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="nav-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-label={tab.label}
            aria-pressed={activeTab === tab.id}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

DashboardNavigation.displayName = 'DashboardNavigation';

export default DashboardNavigation;