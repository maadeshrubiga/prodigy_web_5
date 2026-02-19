// Free weather API - no API key needed using wttr.in
let currentUnit = 'C';
let cachedData = null;

const $ = id => document.getElementById(id);

function showError(msg) {
  const el = $('error-msg');
  el.textContent = msg;
  el.classList.add('visible');
}

function clearError() {
  $('error-msg').classList.remove('visible');
}

function showLoading(v) {
  $('loading').style.display = v ? 'block' : 'none';
}

// Get weather from wttr.in API (no API key required)
async function fetchWeather(query) {
  clearError();
  showLoading(true);
  $('weather-display').innerHTML = '';
  $('weather-display').classList.remove('visible');

  try {
    let location;
    
    if (query.startsWith('lat=')) {
      // Geolocation - get city name from coordinates using reverse geocoding
      const params = new URLSearchParams(query);
      const lat = params.get('lat');
      const lon = params.get('lon');
      location = `${lat},${lon}`;
    } else {
      // City search
      location = query.replace('q=', '');
    }
    
    // Fetch from wttr.in (no API key needed)
    const res = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
    
    if (!res.ok) {
      throw new Error('Location not found');
    }
    
    const data = await res.json();
    
    if (!data.current_condition || data.current_condition.length === 0) {
      throw new Error('Weather data not available');
    }
    
    const current = data.current_condition[0];
    const locationInfo = data.nearest_area ? data.nearest_area[0] : { areaName: [{ value: location }], country: [{ value: '' }] };
    
    // Transform data for rendering
    const currentData = {
      name: locationInfo.areaName[0].value,
      sys: { country: locationInfo.country[0].value },
      weather: [{ id: getWeatherId(current.weatherCode), description: current.weatherDesc[0].value }],
      main: {
        temp: parseFloat(current.temp_C),
        feels_like: parseFloat(current.FeelsLikeC),
        temp_max: parseFloat(current.temp_C),
        temp_min: parseFloat(current.temp_C),
        humidity: parseInt(current.humidity),
        pressure: parseInt(current.pressure)
      },
      wind: { speed: parseFloat(current.windspeedKmph) / 3.6, deg: parseInt(current.winddirDegree) },
      visibility: parseFloat(current.visibility) * 1000,
      clouds: { all: parseInt(current.cloudcover) },
      dt: Math.floor(Date.now() / 1000),
      timezone: 0,
      sys: {
        country: locationInfo.country[0].value,
        sunrise: 0,
        sunset: 0
      }
    };
    
    // Get forecast from weatherDesc for next days
    const forecastData = {
      list: [],
      daily: []
    };
    
    // Add nearest area sunrise/sunset if available
    if (locationInfo.sunrise) {
      currentData.sys.sunrise = parseInt(locationInfo.sunrise[0]);
      currentData.sys.sunset = parseInt(locationInfo.sunset[0]);
    }
    
    cachedData = { current: currentData, forecast: forecastData };
    renderWeather(currentData, forecastData, 'C');
    
  } catch(e) {
    showError(e.message || 'Something went wrong. Try again.');
  } finally {
    showLoading(false);
  }
}

// Convert wttr.in weather code to similar ID for emoji
function getWeatherId(code) {
  code = parseInt(code);
  if (code === 113) return 800; // Sunny
  if (code === 116) return 801;  // Partly cloudy
  if (code === 119 || code === 122) return 803; // Cloudy
  if (code >= 200 && code < 300) return code + 200; // Thunderstorm
  if (code >= 300 && code < 400) return 300; // Drizzle
  if (code >= 500 && code < 600) return 500; // Rain
  if (code >= 600 && code < 700) return 600; // Snow
  if (code >= 700 && code < 800) return 700; // Fog
  return 800;
}

function searchWeather() {
  const q = $('search-input').value.trim();
  if (!q) { 
    // Default to a city if empty
    fetchWeather('q=London'); 
    return;
  }
  fetchWeather(`q=${encodeURIComponent(q)}`);
}

function getLocation() {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.');
    return;
  }
  
  showLoading(true);
  
  navigator.geolocation.getCurrentPosition(
    pos => fetchWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`),
    (error) => {
      showLoading(false);
      
      let errorMessage = 'Location access denied. Try searching by city name.';
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied. Please allow location access or search for a city manually.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
      }
      
      if (window.location.protocol === 'file:') {
        errorMessage = 'Geolocation may be blocked. Please use a local server or search for a city manually.';
      }
      
      showError(errorMessage);
    }
  );
}

function toF(c) { return (c * 9/5 + 32).toFixed(1); }
function displayTemp(c, unit) {
  return unit === 'C' ? `${Math.round(c)}°` : `${Math.round(toF(c))}°`;
}

function weatherEmoji(id, isDay) {
  if (id >= 200 && id < 300) return '⛈️';
  if (id >= 300 && id < 400) return '🌦️';
  if (id >= 500 && id < 600) {
    if (id === 511) return '🌨️';
    return id < 502 ? '🌧️' : '⛈️';
  }
  if (id >= 600 && id < 700) return '❄️';
  if (id >= 700 && id < 800) return id === 781 ? '🌪️' : '🌫️';
  if (id === 800) return isDay ? '☀️' : '🌙';
  if (id === 801) return isDay ? '🌤️' : '🌙';
  if (id === 802) return '⛅';
  if (id >= 803) return '☁️';
  return '🌡️';
}

function windDir(deg) {
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(deg / 45) % 8] || 'N';
}

function formatDay(unix) {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return days[new Date(unix * 1000).getDay()];
}

function getDailyForecast(list) {
  return [];
}

function renderWeather(d, fData, unit) {
  const isDay = true;
  const icon = weatherEmoji(d.weather[0].id, isDay);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  let html = `
  <div class="hero-card">
    <div class="hero-top">
      <div>
        <div class="location-name">${d.name}</div>
        <div class="location-country">${d.sys.country} · ${dateStr}</div>
      </div>
      <div class="datetime">
        <div style="font-size:1.1rem; font-family:'Syne',sans-serif; font-weight:700;">
          ${new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}
        </div>
        <div style="margin-top:4px;">${d.weather[0].description}</div>
      </div>
    </div>

    <div class="temp-row">
      <div>
        <div class="temp-main" id="temp-main">${displayTemp(d.main.temp, unit)}</div>
        <div class="condition-text">${d.weather[0].description}</div>
        <div class="feels-like">Feels like <span id="temp-feels">${displayTemp(d.main.feels_like, unit)}</span>${unit}</div>
      </div>
      <div style="flex:1;"></div>
      <div style="text-align:right;">
        <div class="weather-icon-big">${icon}</div>
        <div class="temp-unit-toggle" style="justify-content:flex-end; margin-top:12px;">
          <button class="unit-btn ${unit==='C'?'active':''}" onclick="switchUnit('C')">°C</button>
          <button class="unit-btn ${unit==='F'?'active':''}" onclick="switchUnit('F')">°F</button>
        </div>
      </div>
    </div>

    <div style="display:flex; gap: 20px; flex-wrap:wrap; font-size:0.85rem; color:var(--muted);">
      <span>↑ <strong id="temp-high" style="color:var(--text)">${displayTemp(d.main.temp_max, unit)}</strong>${unit}</span>
      <span>↓ <strong id="temp-low" style="color:var(--text)">${displayTemp(d.main.temp_min, unit)}</strong>${unit}</span>
    </div>
  </div>

  <div class="section-title">Conditions</div>
  <div class="stats-grid">
    <div class="stat-card" style="animation-delay:0.05s">
      <div class="stat-icon">💧</div>
      <div class="stat-label">Humidity</div>
      <div class="stat-value">${d.main.humidity}%</div>
    </div>
    <div class="stat-card" style="animation-delay:0.1s">
      <div class="stat-icon">🌬️</div>
      <div class="stat-label">Wind</div>
      <div class="stat-value">${(d.wind.speed * 3.6).toFixed(1)} <small style="font-size:0.8rem;color:var(--muted)">km/h</small></div>
      <div style="font-size:0.8rem;color:var(--muted);margin-top:4px;">
        <span class="wind-arrow" style="transform:rotate(${d.wind.deg}deg);display:inline-block">→</span>
        ${windDir(d.wind.deg || 0)}
      </div>
    </div>
    <div class="stat-card" style="animation-delay:0.15s">
      <div class="stat-icon">👁️</div>
      <div class="stat-label">Visibility</div>
      <div class="stat-value">${(d.visibility / 1000).toFixed(1)} <small style="font-size:0.8rem;color:var(--muted)">km</small></div>
    </div>
    <div class="stat-card" style="animation-delay:0.2s">
      <div class="stat-icon">🔵</div>
      <div class="stat-label">Pressure</div>
      <div class="stat-value">${d.main.pressure} <small style="font-size:0.8rem;color:var(--muted)">hPa</small></div>
    </div>
    <div class="stat-card" style="animation-delay:0.25s">
      <div class="stat-icon">☁️</div>
      <div class="stat-label">Cloud Cover</div>
      <div class="stat-value">${d.clouds.all}%</div>
    </div>
  </div>
  `;

  const wd = $('weather-display');
  wd.innerHTML = html;
  wd.classList.add('visible');
}

function switchUnit(unit) {
  if (!cachedData || unit === currentUnit) return;
  currentUnit = unit;
  renderWeather(cachedData.current, cachedData.forecast, unit);
}

$('search-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') searchWeather();
});

// Default search when page loads
window.addEventListener('load', () => {
  $('search-input').value = 'London';
  searchWeather();
});
