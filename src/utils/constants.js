// Weather API data constants and city data

export const API_KEY = '346871855ae2ee3d144f3306bff7579d';
export const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
export const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Moroccan cities
export const moroccanCities = [
  { name: 'Casablanca', arabicName: 'الدار البيضاء', lat: 33.5731, lon: -7.5898 },
  { name: 'Rabat', arabicName: 'الرباط', lat: 34.0209, lon: -6.8416 },
  { name: 'Marrakech', arabicName: 'مراكش', lat: 31.6295, lon: -7.9811 },
  { name: 'Fes', arabicName: 'فاس', lat: 34.0181, lon: -5.0078 },
  { name: 'Tangier', arabicName: 'طنجة', lat: 35.7595, lon: -5.8340 },
  { name: 'Agadir', arabicName: 'أكادير', lat: 30.4278, lon: -9.5981 },
  { name: 'Meknes', arabicName: 'مكناس', lat: 33.8935, lon: -5.5547 },
  { name: 'Oujda', arabicName: 'وجدة', lat: 34.6867, lon: -1.9114 },
  { name: 'Kenitra', arabicName: 'القنيطرة', lat: 34.2541, lon: -6.5890 },
  { name: 'Tetouan', arabicName: 'تطوان', lat: 35.5889, lon: -5.3626 }
];

// Translations
export const translations = {
  fr: {
    title: 'Météo Maroc',
    search: 'Rechercher une ville...',
    myLocation: 'Ma position',
    home: 'Accueil',
    favorites: 'Favoris',
    alerts: 'Alertes',
    charts: 'Stats',
    settings: 'Paramètres',
    feelsLike: 'Ressenti',
    humidity: 'Humidité',
    wind: 'Vent',
    pressure: 'Pression',
    nextHours: 'Prochaines heures',
    nextDays: 'Prochains jours',
    today: "Aujourd'hui",
    sunrise: 'Lever',
    sunset: 'Coucher',
    loading: 'Chargement...',
    error: 'Erreur de connexion',
    noAlerts: 'Aucune alerte météo en cours',
    heatWarning: 'Chaleur extrême - Restez hydratés !',
    language: 'Langue',
    darkMode: 'Mode sombre',
    tempUnit: 'Unité de température',
    allCities: 'Toutes les villes',
    prayerTimes: 'Heures de prière'
  },
  ar: {
    title: 'طقس المغرب',
    search: 'بحث عن مدينة...',
    myLocation: 'موقعي',
    home: 'الرئيسية',
    favorites: 'المفضلة',
    alerts: 'التنبيهات',
    charts: 'إحصائيات',
    settings: 'الإعدادات',
    feelsLike: 'الإحساس',
    humidity: 'الرطوبة',
    wind: 'الرياح',
    pressure: 'الضغط',
    nextHours: 'الساعات القادمة',
    nextDays: 'الأيام القادمة',
    today: 'اليوم',
    sunrise: 'الشروق',
    sunset: 'الغروب',
    loading: 'جاري التحميل...',
    error: 'خطأ في الاتصال',
    noAlerts: 'لا توجد تنبيهات حاليا',
    heatWarning: 'حرارة شديدة - حافظ على ترطيب جسمك!',
    language: 'اللغة',
    darkMode: 'الوضع الداكن',
    tempUnit: 'وحدة الحرارة',
    allCities: 'جميع المدن',
    prayerTimes: 'أوقات الصلاة'
  }
};
