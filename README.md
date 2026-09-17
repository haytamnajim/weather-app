# 🌤️ Weather App

Une application météo moderne construite avec **React** et **Vite**, offrant des prévisions en temps réel, un design glassmorphism et une interface multilingue.

## ✨ Fonctionnalités

- 🌡️ **Météo en temps réel** via OpenWeatherMap API
- 📅 **Prévisions sur 7 jours** avec graphiques interactifs
- 🌍 **Multilingue** (Français / Anglais)
- 🌡️ **Conversion °C / °F** instantanée
- 💎 **Design Glassmorphism** avec animations météo
- 🏙️ **Historique des villes** recherchées
- ⭐ **Villes favorites** sauvegardées
- 🤖 **Chat IA** intégré pour les conseils météo
- 🌧️ **Effets de pluie** animés selon la météo

## 🛠️ Technologies

| Technologie | Usage |
|---|---|
| React 18 | Interface utilisateur |
| Vite | Build tool & Dev server |
| Recharts | Graphiques météo |
| React Icons | Icônes météo |
| OpenWeatherMap API | Données météo |

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/haytamnajim/weather-app.git
cd weather-app

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Ajoutez votre clé API dans .env :
# VITE_OPENWEATHER_API_KEY=votre_cle_api

# Lancer en développement
npm run dev
```

## 🔑 Variables d'environnement

```env
VITE_OPENWEATHER_API_KEY=votre_cle_openweathermap
VITE_N8N_CHAT_URL=votre_url_n8n (optionnel)
```

## 📁 Structure du projet

```
src/
├── components/       # Composants React
│   ├── WeatherCardGlass.jsx
│   ├── ForecastSection.jsx
│   ├── WeatherCharts.jsx
│   └── ...
├── hooks/            # Custom hooks
├── utils/            # Fonctions utilitaires
│   ├── helpers.js
│   └── constants.js
└── App.jsx           # Composant principal
```

## 👨‍💻 Auteur

**Haitam Najim** — Full-Stack Developer & AI Workflow Automation Builder
- 🌐 [haitam-najim.me](https://haitam-najim.me/)
- 💼 [LinkedIn](https://linkedin.com/in/haitam-najim-653b8630a)
- 🐙 [GitHub](https://github.com/haytamnajim)

## 📄 Licence

MIT © 2024 Haitam Najim
