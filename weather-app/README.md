# 🌤️ Week 1: Weather App Dashboard

A responsive, feature-rich weather dashboard built with React and Vite for the **Syntecxhub Web Development Internship (Week 1)**. This application replicates the clean interface of Google Weather while adding interactive charts, city search autocomplete, auto-location detection, and dynamic condition-based background themes.

🚀 **Live Demo:** [https://globally-weather-app.netlify.app/](https://globally-weather-app.netlify.app/)

---

## ✨ Key Features

*   **📍 Auto-Geolocation:** Automatically fetches weather for the user's current location on load via the browser Geolocation API, with a manual GPS re-sync button.
*   **🔍 Search Autocomplete:** Live city search suggestions powered by OpenWeatherMap Geocoding API.
*   **📊 Interactive Weather Charts:** Dynamic hourly trend graphs for Temperature, Precipitation, and Wind using `recharts`.
*   **📅 5-Day Forecast Strip:** Interactive daily cards displaying high/low temperature ranges and weather condition icons.
*   **🌡️ Unit Toggle:** Instant conversion between Celsius (°C) and Fahrenheit (°F).
*   **🎨 Dynamic Weather Themes:** Adaptive background images and glassmorphism UI matching real-time weather conditions (Sunny, Rainy, Cloudy, Snow, Thunderstorm).
*   **📱 Mobile Optimized:** Touch-friendly controls, responsive layout stacking, and smooth horizontal scrolling.

---

## 🛠️ Tech Stack

*   **Frontend Framework:** React.js (Vite)
*   **Styling:** CSS3 (Glassmorphism, CSS Grid, Flexbox, Media Queries)
*   **Charting Library:** Recharts
*   **API Integration:** OpenWeatherMap API (5-Day Forecast & Direct Geocoding)
*   **Hosting & Deployment:** Netlify

---

## 📁 Project Structure

```text
weather-app/
├── public/
├── src/
│   ├── WeatherApp.jsx    # Main Weather Dashboard Logic & API handlers
│   ├── WeatherApp.css    # Responsive Glassmorphism Styling & Themes
│   ├── App.jsx           # Root Component
│   └── main.jsx          # React DOM Entry Point
├── dist/                 # Production Build Output
├── index.html            # HTML Shell with Viewport Meta Tags
├── package.json          # Dependencies and Build Scripts
└── README.md             # Project Documentation
