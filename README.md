# 🌦️ Rubi Weather

> **Weather Intelligence** — A stunning, zero-API-key weather app built with pure HTML, CSS & JavaScript.

## 🚀 Quick Start


> 💡 **Tip:** Works by simply double-clicking `weather-app.html` in your file explorer!

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **City Search** | Search any city, town, or region worldwide |
| 📍 **GPS Detection** | One-click auto-detect your current location |
| 🌡️ **Live Temperature** | Real-time temp with °C / °F toggle |
| 🤔 **Feels Like** | Apparent temperature based on wind & humidity |
| 💧 **Humidity** | Current relative humidity percentage |
| 🌬️ **Wind** | Speed (km/h) + 16-point compass direction |
| 👁️ **Visibility** | Atmospheric visibility in km |
| 🔵 **Pressure** | Surface atmospheric pressure in hPa |
| ☁️ **Cloud Cover** | Sky cloud coverage percentage |
| 🌈 **UV Index** | Real-time UV radiation index |
| 📅 **3-Day Forecast** | High/low temps for next 3 days |
| 🗺️ **Interactive Map** | Leaflet.js + OpenStreetMap, dark-themed |
| ☀️ **Sun Arc** | Animated sunrise → sunset progress arc |
| 🌙 **Day/Night Icons** | Weather emoji adapts to time of day |

---

## 🛠️ Tech Stack

```
🏗️  Architecture: Single-file HTML + CSS + JS
🌐  Weather Data:  wttr.in          (free, no key)
📍  Geocoding:     Nominatim / OSM  (free, no key)
🗺️  Map Engine:    Leaflet.js       (free, no key)
🧭  Map Tiles:     OpenStreetMap    (free, no key)
🔤  Fonts:         Google Fonts — Syne + DM Sans
```

## 🎨 Design System

```
🎨 Theme:        Dark cinematic — deep navy (#080c14)
💎 Glassmorphism: Frosted card surfaces with backdrop-blur
✨ Accent:        Ocean blue (#4fa3e0)
🔤 Typography:   Syne (display) + DM Sans (body)
🌟 Effects:      Star field · Radial glows · Floating icons
📐 Layout:       Responsive CSS Grid + Flexbox
🎭 Animations:   fadeUp · float · pinDrop · sun arc pulse
```

### 🌈 Colour Palette

```
██████  #080c14  — Background (deep space navy)
██████  #4fa3e0  — Accent (ocean blue)
██████  #e8edf5  — Text (cool white)
██████  #e06e4f  — Error (warm coral)
██████  rgba(255,255,255,0.04)  — Surface (glass)
```

---

## 📁 Project Structure

```
rubi-weather/
│
├── 📄 weather-app.html     ← Everything lives here (single file)
│   ├── 🎨 <style>          ← All CSS (600+ lines, fully commented)
│   ├── 🏗️  <body>          ← Semantic HTML structure
│   └── ⚙️  <script>        ← All JavaScript logic
│
└── 📘 README.md            ← You're reading it!
```

---

## ⚙️ How It Works

```
User enters city name
        │
        ▼
🔍 Nominatim geocodes city → lat/lon
        │
        ▼
🌐 wttr.in fetches live weather JSON
        │
        ├──► 🌡️  Current temp, feels like, condition
        ├──► 💧  Humidity, wind, pressure, UV, cloud
        ├──► 📅  3-day high/low forecast
        └──► ☀️  Sunrise & sunset times
        │
        ▼
🗺️ Leaflet.js renders OSM map at lat/lon
        │
        ▼
🎨 DOM updates with animations & transitions
```

---

## 🌍 Browser Support

| Browser | Support |
|---|---|
| 🟢 Chrome 90+ | ✅ Full support |
| 🟢 Firefox 88+ | ✅ Full support |
| 🟢 Safari 14+ | ✅ Full support |
| 🟢 Edge 90+ | ✅ Full support |
| 🟡 IE 11 | ❌ Not supported |

> 📱 **Mobile friendly** — fully responsive on phones & tablets!

---

