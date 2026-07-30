/* eslint-disable */
import { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './WeatherApp.css';

const API_KEY = '18bce1558c2c081aebe3215e707418bc';

const parseForecastData = (list) => {
  const map = {};

  list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

    if (!map[dayName]) {
      map[dayName] = {
        dayName,
        fullDate: date.toLocaleDateString('en-US', { weekday: 'long' }),
        timeStr: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        hourly: [],
        maxTemp: item.main.temp_max,
        minTemp: item.main.temp_min,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
        mainCondition: item.weather[0].main,
        humidity: item.main.humidity,
        wind: Math.round(item.wind.speed * 3.6),
        pop: Math.round((item.pop || 0) * 100),
      };
    }

    map[dayName].maxTemp = Math.max(map[dayName].maxTemp, item.main.temp_max);
    map[dayName].minTemp = Math.min(map[dayName].minTemp, item.main.temp_min);

    map[dayName].hourly.push({
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      temperature: Math.round(item.main.temp),
      precipitation: Math.round((item.pop || 0) * 100),
      wind: Math.round(item.wind.speed * 3.6),
    });
  });

  return Object.values(map);
};

const getThemeClass = (condition = '') => {
  const cond = condition.toLowerCase();
  if (cond.includes('rain') || cond.includes('drizzle')) return 'theme-rain';
  if (cond.includes('thunder')) return 'theme-thunder';
  if (cond.includes('snow')) return 'theme-snow';
  if (cond.includes('cloud')) return 'theme-cloudy';
  if (cond.includes('clear')) return 'theme-sunny';
  return 'theme-default';
};

const WeatherApp = () => {
  const [cityInfo, setCityInfo] = useState({ name: 'London', country: 'GB' });
  const [unit, setUnit] = useState('metric');
  const [activeTab, setActiveTab] = useState('temperature');
  const [forecastDays, setForecastDays] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const fetchByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
      );
      if (!response.ok) throw new Error('Could not fetch weather for your location.');
      const data = await response.json();
      const processed = parseForecastData(data.list);
      setForecastDays(processed);
      setSelectedDayIndex(0);
      setCityInfo({ name: data.city.name, country: data.city.country });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCity = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${unit}&appid=${API_KEY}`
      );
      if (!response.ok) throw new Error('City not found. Check spelling and try again.');
      const data = await response.json();
      const processed = parseForecastData(data.list);
      setForecastDays(processed);
      setSelectedDayIndex(0);
      setCityInfo({ name: data.city.name, country: data.city.country });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
        () => fetchByCity(cityInfo.name || 'London')
      );
    } else {
      fetchByCity(cityInfo.name || 'London');
    }
  };

  useEffect(() => {
    handleAutoLocation();
  }, [unit]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 2) {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (sugg) => {
    setSearchTerm(`${sugg.name}, ${sugg.country}`);
    setSuggestions([]);
    setShowSuggestions(false);
    fetchByCoords(sugg.lat, sugg.lon);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchByCity(searchTerm.trim());
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentDay = forecastDays[selectedDayIndex];
  const themeClass = currentDay ? getThemeClass(currentDay.description) : 'theme-default';

  return (
    <div className={`app-background ${themeClass}`}>
      <div className="google-weather-card">
        <div className="search-wrapper" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search city (e.g. Dehradun, London)..."
              autoComplete="off"
            />
            <button type="button" className="geo-btn" onClick={handleAutoLocation} title="Use Current Location">
              📍
            </button>
            <button type="submit">Search</button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((sugg, idx) => (
                <li key={idx} onClick={() => handleSelectSuggestion(sugg)}>
                  <strong>{sugg.name}</strong>
                  {sugg.state ? `, ${sugg.state}` : ''} ({sugg.country})
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <div className="error-text">⚠️ {error}</div>}
        {loading && <div className="loading-text">Fetching latest weather data...</div>}

        {!loading && currentDay && (
          <>
            <div className="header-main">
              <div className="left-group">
                <img
                  src={`https://openweathermap.org/img/wn/${currentDay.icon}@2x.png`}
                  alt={currentDay.description}
                  className="main-icon"
                />
                <span className="big-temp">
                  {currentDay.hourly[0]?.temperature ?? Math.round(currentDay.maxTemp)}
                </span>
                
                <div className="unit-toggle">
                  <span 
                    className={unit === 'metric' ? 'active-unit' : ''} 
                    onClick={() => setUnit('metric')}
                  >
                    °C
                  </span>
                  <span className="divider">|</span>
                  <span 
                    className={unit === 'imperial' ? 'active-unit' : ''} 
                    onClick={() => setUnit('imperial')}
                  >
                    °F
                  </span>
                </div>

                <div className="stats-list">
                  <p>Precipitation: {currentDay.pop}%</p>
                  <p>Humidity: {currentDay.humidity}%</p>
                  <p>Wind: {currentDay.wind} {unit === 'metric' ? 'km/h' : 'mph'}</p>
                </div>
              </div>

              <div className="right-group">
                <h2 className="city-title">📍 {cityInfo.name}, {cityInfo.country}</h2>
                <p className="subtitle">{currentDay.fullDate}, {currentDay.timeStr}</p>
                <p className="condition-text">{currentDay.description}</p>
              </div>
            </div>

            <div className="tabs-bar">
              <button
                className={activeTab === 'temperature' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('temperature')}
              >
                Temperature
              </button>
              <button
                className={activeTab === 'precipitation' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('precipitation')}
              >
                Precipitation
              </button>
              <button
                className={activeTab === 'wind' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('wind')}
              >
                Wind
              </button>
            </div>

            <div className="chart-section">
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={currentDay.hourly} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e5a93c" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#e5a93c" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#9aa0a6" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#303134', border: '1px solid #5f6368', borderRadius: '4px', color: '#fff' }} 
                  />
                  <Area
                    type="monotone"
                    dataKey={activeTab}
                    stroke="#e5a93c"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#yellowGradient)"
                    label={{ position: 'top', fill: '#fff', fontSize: 11 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="daily-forecast-strip">
              {forecastDays.map((day, index) => (
                <div
                  key={day.dayName + index}
                  className={`daily-card ${index === selectedDayIndex ? 'selected-day' : ''}`}
                  onClick={() => setSelectedDayIndex(index)}
                >
                  <div className="day-name">{day.dayName}</div>
                  <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt={day.description} />
                  <div className="day-high-low">
                    <span className="high">{Math.round(day.maxTemp)}°</span>
                    <span className="low">{Math.round(day.minTemp)}°</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;