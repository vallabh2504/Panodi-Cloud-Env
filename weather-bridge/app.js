/* ════════════════════════════════════════════════════
   WeatherBridge — App Logic
   · Open-Meteo API (no key required)
   · Live timezone-aware clocks
   · 7-day forecast
   · Particle canvas background
   ════════════════════════════════════════════════════ */

'use strict';

/* ── CITY CONFIG ── */
const CITIES = {
  aachen: {
    key:       'aachen',
    lat:       50.7753,
    lon:       6.0839,
    tz:        'Europe/Berlin',
    color:     '#60a5fa',
    suffix:    'Aachen',
  },
  hyderabad: {
    key:       'hyderabad',
    lat:       17.3850,
    lon:       78.4867,
    tz:        'Asia/Kolkata',
    color:     '#fb923c',
    suffix:    'Hyderabad',
  },
};

/* ── WMO WEATHER CODE MAP ── */
const WMO = {
  0:  { label: 'Clear Sky',           icon: '☀️',  category: 'clear'  },
  1:  { label: 'Mainly Clear',        icon: '🌤️', category: 'clear'  },
  2:  { label: 'Partly Cloudy',       icon: '⛅',  category: 'clouds' },
  3:  { label: 'Overcast',            icon: '☁️',  category: 'clouds' },
  45: { label: 'Foggy',               icon: '🌫️', category: 'fog'    },
  48: { label: 'Icy Fog',             icon: '🌫️', category: 'fog'    },
  51: { label: 'Light Drizzle',       icon: '🌦️', category: 'drizzle'},
  53: { label: 'Drizzle',             icon: '🌦️', category: 'drizzle'},
  55: { label: 'Dense Drizzle',       icon: '🌧️', category: 'rain'   },
  61: { label: 'Light Rain',          icon: '🌧️', category: 'rain'   },
  63: { label: 'Moderate Rain',       icon: '🌧️', category: 'rain'   },
  65: { label: 'Heavy Rain',          icon: '🌧️', category: 'rain'   },
  66: { label: 'Light Freezing Rain', icon: '🌨️', category: 'snow'   },
  67: { label: 'Freezing Rain',       icon: '🌨️', category: 'snow'   },
  71: { label: 'Light Snow',          icon: '🌨️', category: 'snow'   },
  73: { label: 'Moderate Snow',       icon: '❄️',  category: 'snow'   },
  75: { label: 'Heavy Snow',          icon: '❄️',  category: 'snow'   },
  77: { label: 'Snow Grains',         icon: '❄️',  category: 'snow'   },
  80: { label: 'Light Showers',       icon: '🌦️', category: 'rain'   },
  81: { label: 'Showers',             icon: '🌧️', category: 'rain'   },
  82: { label: 'Heavy Showers',       icon: '⛈️', category: 'storm'  },
  85: { label: 'Snow Showers',        icon: '🌨️', category: 'snow'   },
  86: { label: 'Heavy Snow Showers',  icon: '❄️',  category: 'snow'   },
  95: { label: 'Thunderstorm',        icon: '⛈️', category: 'storm'  },
  96: { label: 'Thunderstorm + Hail', icon: '⛈️', category: 'storm'  },
  99: { label: 'Thunderstorm + Hail', icon: '⛈️', category: 'storm'  },
};

function getWMO(code) {
  return WMO[code] || { label: 'Unknown', icon: '🌡️', category: 'clear' };
}

/* ── OPEN-METEO API ── */
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

async function fetchWeather(city) {
  const params = new URLSearchParams({
    latitude:  city.lat,
    longitude: city.lon,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'visibility',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
    ].join(','),
    timezone:      city.tz,
    wind_speed_unit: 'kmh',
    forecast_days: 7,
  });

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/* ── CLOCK ── */
const DAY_NAMES  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MON_NAMES  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatClock(tz) {
  const now = new Date();
  const parts = {};
  new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    day:    'numeric',
    month:  'short',
    year:   'numeric',
    weekday:'long',
  }).formatToParts(now).forEach(p => { parts[p.type] = p.value; });

  const timeStr = `${parts.hour}:${parts.minute}:${parts.second}`.replace(/^0/, '');
  const ampm    = parts.dayPeriod || '';
  const dateStr = `${parts.weekday}, ${parts.day} ${parts.month} ${parts.year}`;
  return { timeStr, ampm, dateStr };
}

function updateClocks() {
  for (const [key, city] of Object.entries(CITIES)) {
    const { timeStr, ampm, dateStr } = formatClock(city.tz);
    const S = key.charAt(0).toUpperCase() + key.slice(1);
    document.getElementById(`time${S}`).textContent  = timeStr;
    document.getElementById(`ampm${S}`).textContent  = ampm;
    document.getElementById(`date${S}`).textContent  = dateStr;
  }
  updateTimeDiff();
}

function updateTimeDiff() {
  const now = new Date();

  // Get offset minutes for each timezone
  const toMins = (tz) => {
    const utcMs   = now.getTime();
    // Build a date string in the target timezone and parse it
    const tzStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz, year:'numeric', month:'2-digit', day:'2-digit',
      hour:'2-digit', minute:'2-digit', second:'2-digit', hour12: false,
    }).format(now);
    // tzStr like: "2024-02-26, 14:30:00"
    const local = new Date(tzStr.replace(',', ''));
    return local.getTime() / 60000;
  };

  try {
    const acMins = toMins('Europe/Berlin');
    const hyMins = toMins('Asia/Kolkata');
    const diffMins = Math.round(Math.abs(hyMins - acMins));
    const h = Math.floor(diffMins / 60);
    const m = diffMins % 60;
    const diffStr = m === 0 ? `${h}h` : `${h}h ${m}m`;
    const ahead = hyMins > acMins ? 'Hyderabad is ahead' : 'Aachen is ahead';
    document.getElementById('timeDiffValue').textContent = `${diffStr} · ${ahead}`;
  } catch (e) {
    // Fallback: IST is always UTC+5:30, CET is UTC+1 (or CEST UTC+2)
    document.getElementById('timeDiffValue').textContent = '4h 30m – 5h 30m · Hyderabad is ahead';
  }
}

/* ── RENDER WEATHER ── */
function renderWeather(cityKey, data) {
  const S    = cityKey.charAt(0).toUpperCase() + cityKey.slice(1);
  const curr = data.current;
  const daily= data.daily;
  const wmo  = getWMO(curr.weather_code);

  // Temperature
  document.getElementById(`temp${S}`).textContent   = Math.round(curr.temperature_2m);
  document.getElementById(`desc${S}`).textContent   = wmo.label;
  document.getElementById(`feels${S}`).textContent  = `Feels like ${Math.round(curr.apparent_temperature)}°C`;

  // Weather icon
  document.getElementById(`icon${S}`).textContent   = wmo.icon;

  // Metrics
  document.getElementById(`hum${S}`).textContent    = `${curr.relative_humidity_2m}%`;
  document.getElementById(`wind${S}`).textContent   = Math.round(curr.wind_speed_10m);
  document.getElementById(`rain${S}`).textContent   = curr.precipitation.toFixed(1);

  const visKm = curr.visibility != null
    ? (curr.visibility / 1000).toFixed(1) + ' km'
    : '—';
  document.getElementById(`vis${S}`).textContent = visKm;

  // Condition data-attr for CSS theming
  document.getElementById(`card${S}`).setAttribute('data-condition', wmo.category);

  // Forecast
  renderForecast(`forecast${S}`, daily, CITIES[cityKey].color);
}

function renderForecast(containerId, daily, accentColor) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  daily.time.forEach((dateStr, i) => {
    const date   = new Date(dateStr + 'T12:00:00');
    const dayName = i === 0 ? 'Today' : DAY_NAMES[date.getDay()].slice(0, 3);
    const wmo    = getWMO(daily.weather_code[i]);
    const max    = Math.round(daily.temperature_2m_max[i]);
    const min    = Math.round(daily.temperature_2m_min[i]);

    const div    = document.createElement('div');
    div.className = 'forecast-day';
    div.innerHTML = `
      <div class="forecast-day-name">${dayName}</div>
      <span class="forecast-day-icon">${wmo.icon}</span>
      <div class="forecast-day-max">${max}°</div>
      <div class="forecast-day-min">${min}°</div>
    `;
    container.appendChild(div);
  });
}

/* ── HEADER DATE ── */
function updateHeaderDate() {
  const now = new Date();
  const str = now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  document.getElementById('headerDate').textContent = str;
}

function updateLastUpdated() {
  const now = new Date();
  const t   = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('lastUpdated').textContent = t;
}

/* ── LOADER HELPERS ── */
function showLoader(cityKey)  {
  document.getElementById(`loader${cap(cityKey)}`).classList.remove('hidden');
}
function hideLoader(cityKey) {
  document.getElementById(`loader${cap(cityKey)}`).classList.add('hidden');
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ── LOAD ALL WEATHER ── */
async function loadAllWeather() {
  const btn = document.getElementById('refreshBtn');
  btn.classList.add('spinning');

  showLoader('aachen');
  showLoader('hyderabad');

  const tasks = Object.values(CITIES).map(async (city) => {
    try {
      const data = await fetchWeather(city);
      renderWeather(city.key, data);
    } catch (err) {
      console.error(`Failed to fetch ${city.key}:`, err);
      showError(city.key);
    } finally {
      hideLoader(city.key);
    }
  });

  await Promise.allSettled(tasks);
  btn.classList.remove('spinning');
  updateLastUpdated();
}

function showError(cityKey) {
  const S = cap(cityKey);
  document.getElementById(`temp${S}`).textContent  = '—';
  document.getElementById(`desc${S}`).textContent  = 'Unable to load';
  document.getElementById(`feels${S}`).textContent = 'Please check your connection';
  document.getElementById(`icon${S}`).textContent  = '⚠️';
}

/* ════════════════════════════════════════════════════
   PARTICLE CANVAS BACKGROUND
   ════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); spawnParticles(); });

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x    = Math.random() * W;
      this.y    = initial ? Math.random() * H : H + 10;
      this.r    = Math.random() * 1.5 + 0.5;
      this.vy   = -(Math.random() * 0.4 + 0.15);
      this.vx   = (Math.random() - 0.5) * 0.2;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      // Alternate between Aachen-blue and Hyderabad-orange hues
      const hue = Math.random() < 0.5
        ? Math.random() * 30 + 200   // blues/purples 200-230
        : Math.random() * 30 + 20;   // oranges 20-50
      this.color = `hsla(${hue}, 80%, 70%, `;
    }
    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.life += 1;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + alpha + ')';
      ctx.fill();
    }
  }

  function spawnParticles() {
    const count = Math.min(80, Math.floor(W / 20));
    particles = Array.from({ length: count }, () => new Particle());
  }
  spawnParticles();

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ════════════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════════════ */
function init() {
  // Clocks — update every second
  updateClocks();
  setInterval(updateClocks, 1000);

  // Header date
  updateHeaderDate();

  // Refresh button
  document.getElementById('refreshBtn').addEventListener('click', () => {
    loadAllWeather();
  });

  // Particles
  initParticles();

  // Load weather immediately, then every 10 minutes
  loadAllWeather();
  setInterval(loadAllWeather, 10 * 60 * 1000);
}

// Kick off when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
