const WIND_PROFILES = {
  calm: {
    label: "Calm High Pressure",
    buffer: 150,
    hint: "Flat pressure gradient: fog usually settles at 800–1,000 m. +150 m buffer recommended."
  },
  "weak-bise": {
    label: "Weak Bise (NE)",
    buffer: 150,
    hint: "Gentle NE wind pushes fog against the pre-Alps (900–1,200 m). +150 m buffer recommended."
  },
  "strong-bise": {
    label: "Strong Bise (NE)",
    buffer: 200,
    hint: "Strong NE damming (Stau) pushes fog up to 1,400–1,700+ m and lifts during the morning. +200 m buffer recommended."
  },
  "sw-foehn": {
    label: "SW Wind / Föhn",
    buffer: 100,
    hint: "Warm/dry SW or Föhn flow erodes fog below 800 m. +100 m buffer is usually enough."
  }
};

const OPEN_METEO_FALLBACK_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=47.4245,47.2494&longitude=9.3767,9.3433&current=temperature_2m,relative_humidity_2m,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,wind_speed_10m,wind_direction_10m,surface_pressure,weather_code&daily=sunshine_duration,temperature_2m_max&timezone=Europe%2FZurich&forecast_days=2";

const SPOTS = [
  {
    id: "pfaender",
    name: "Pfänder",
    area: "Bregenz (AT)",
    elevation: 1064,
    travelMinutes: 35,
    travelText: "~35 min drive + 6-min cable car",
    transport: ["car"],
    gaCovered: false,
    status: "open",
    cableCar: true,
    description:
      "Iconic view across the entire Lake Constance fog blanket and Vorarlberg peaks.",
    note: "Cross-border trip (Austria); check motorway vignette or local roads.",
    links: [
      { label: "Pfänder 360° Panomax Cam", url: "https://pfaender.panomax.com/" },
      { label: "Pfänderbahn Info", url: "https://www.pfaenderbahn.at/" }
    ]
  },
  {
    id: "voegelinsegg",
    name: "Vögelinsegg",
    area: "Above Speicher (AR)",
    elevation: 1084,
    travelMinutes: 15,
    travelText: "~15 min via Appenzeller Bahnen S21/S22 (GA) or car",
    transport: ["public", "car"],
    gaCovered: true,
    status: "open",
    cableCar: false,
    description:
      "Closest possible sun terrace to St. Gallen for a quick coffee or walk on low-fog days.",
    note: "No cable car required; ideal when fog top is under ~930 m.",
    links: []
  },
  {
    id: "st-anton",
    name: "St. Anton",
    area: "Oberegg (AI)",
    elevation: 1110,
    travelMinutes: 25,
    travelText: "~25 min by car or PostAuto (GA)",
    transport: ["public", "car"],
    gaCovered: true,
    status: "open",
    cableCar: false,
    description:
      "Wide terrace ridge overlooking the Rhine Valley fog sea and Lake Constance.",
    note: "Driveable or reachable by PostAuto; great low-ceiling escape.",
    links: [
      { label: "St. Anton Webcam", url: "https://www.st-antonoberegg.ch/webcam.html" }
    ]
  },
  {
    id: "gaebris",
    name: "Oberer Gäbris",
    area: "Gais (AR)",
    elevation: 1251,
    travelMinutes: 25,
    travelText: "~25 min by car from Gais, or GA train to Gais + walk",
    transport: ["public", "car"],
    gaCovered: true,
    status: "open",
    cableCar: false,
    description:
      "Inn with sun terrace and 360° views across the Alpstein. Ideal when the fog top stays below ~1,100 m.",
    note: "Appenzeller Bahnen to Gais is covered by GA; short drive or uphill walk to the inn.",
    links: [
      { label: "Oberer Gäbris Inn", url: "https://oberergaebris.ch/" },
      { label: "Check Live Sun on SunCatcher", url: "https://suncatcher.ch/" }
    ]
  },
  {
    id: "hochhamm",
    name: "Hochhamm",
    area: "Schönengrund / Urnäsch (AR)",
    elevation: 1275,
    travelMinutes: 30,
    travelText: "~30 min drive + short walk",
    transport: ["car"],
    gaCovered: false,
    status: "open",
    cableCar: false,
    description:
      "Quiet Appenzell hilltop with a summit restaurant at almost the same altitude as Gäbris.",
    note: "Great alternative to Gäbris on sunny low-to-mid fog days.",
    links: []
  },
  {
    id: "hundwiler-hoehi",
    name: "Hundwiler Höhi",
    area: "Hundwil (AR)",
    elevation: 1306,
    travelMinutes: 30,
    travelText: "~25–30 min drive + short hike",
    transport: ["car"],
    gaCovered: false,
    status: "open",
    cableCar: false,
    description:
      "Sunny Appenzell ridge west of St. Gallen that often rises just above the Mittelland stratus.",
    note: "Short uphill walk required from nearby parking.",
    links: []
  },
  {
    id: "schwaegalp",
    name: "Schwägalp",
    area: "Pass below Säntis (AR/SG)",
    elevation: 1352,
    travelMinutes: 45,
    travelText: "~45 min by car or PostAuto (GA)",
    transport: ["public", "car"],
    gaCovered: true,
    status: "open",
    cableCar: false,
    description:
      "Driveable mountain pass right at the foot of Säntis with hotel, sun terrace, and winter walks.",
    note: "Open and accessible even while the Säntis cable car is under construction.",
    links: [
      { label: "Schwägalp & Säntis Webcams", url: "https://saentisbahn.ch/webcam-wetter/" }
    ]
  },
  {
    id: "ebenalp",
    name: "Ebenalp",
    area: "Wasserauen (AI)",
    elevation: 1644,
    travelMinutes: 40,
    travelText: "~40 min GA train to Wasserauen + cable car",
    transport: ["public", "car"],
    gaCovered: true,
    status: "closed",
    reopensAfter: "2026-12-18",
    closureReason:
      "Maintenance closure: Nov 2 until ~Dec 18, 2026 (winter schedule resumes mid/late Dec).",
    reopenedNote: "Scheduled winter operations resumed (~Dec 18, 2026); verify live hours on ebenalp.ch.",
    cableCar: true,
    description:
      "Classic Alpstein panorama near Wildkirchli and Aescher when operating.",
    note: "Skip until late December 2026 maintenance finishes.",
    links: [
      { label: "Ebenalp 360° Roundshot", url: "https://ebenalp.roundshot.com/" },
      { label: "Ebenalp Status", url: "https://www.ebenalp.ch/en/welcome" }
    ]
  },
  {
    id: "kronberg",
    name: "Kronberg",
    area: "Jakobsbad (AI)",
    elevation: 1663,
    travelMinutes: 35,
    travelText: "~35 min GA train/car to Jakobsbad + cable car",
    transport: ["public", "car"],
    gaCovered: true,
    status: "open",
    cableCar: true,
    description:
      "Reliable mid-to-high fog escape with summit restaurant and dual valley/summit webcams for instant confirmation.",
    note:
      "Winter timetable (Dec 1, 2026 – Feb 28, 2027): Mon–Fri 09:00–17:00, Sat–Sun/Holidays 08:00–17:00 (annual closure is in March).",
    links: [
      { label: "Summit + Jakobsbad Cams", url: "https://en.kronberg.ch/webcam.html" },
      { label: "360° Roundshot", url: "https://kronberg.roundshot.com/gipfel/" }
    ]
  },
  {
    id: "hoher-kasten",
    name: "Hoher Kasten",
    area: "Brülisau (AI)",
    elevation: 1794,
    travelMinutes: 40,
    travelText: "~40 min car or train + PostAuto to Brülisau + 8-min cable car",
    transport: ["public", "car"],
    gaCovered: true,
    status: "open",
    cableCar: true,
    description:
      "The surest open choice on stubborn Bise days. Features a revolving restaurant and the cleared 360° Europa-Rundweg.",
    note:
      "Winter timetable runs Oct 19, 2026 – Feb 28, 2027 with ascents starting from 08:40.",
    links: [
      { label: "Hoher Kasten Webcam", url: "https://www.hoherkasten.ch/informieren/webcam-wetter/" },
      { label: "360° Roundshot", url: "https://hoherkasten.roundshot.com/" }
    ]
  },
  {
    id: "saentis",
    name: "Säntis Summit",
    area: "Schwägalp (AI/AR/SG)",
    elevation: 2502,
    travelMinutes: 50,
    travelText: "~45 min to Schwägalp + cable car",
    transport: ["public", "car"],
    gaCovered: true,
    status: "closed",
    reopensAfter: "2026-12-18",
    closureReason:
      "Cable car rebuild ('Säntis 2026'): first public guest rides planned for Dec 18, 2026.",
    reopenedNote: "Planned public opening was Dec 18, 2026; verify live operations on saentisbahn.ch.",
    cableCar: true,
    description:
      "Highest peak in the Alpstein—virtually always above any fog deck once reopened.",
    note: "Check saentisbahn.ch after Dec 18, 2026 before relying on summit rides.",
    links: [
      { label: "Säntis 360° Roundshot", url: "https://saentis.roundshot.com/" },
      { label: "Schwägalp & Säntis Cams", url: "https://saentisbahn.ch/webcam-wetter/" }
    ]
  }
];

const state = {
  ceiling: 1100,
  wind: "weak-bise",
  transport: "all",
  hideClosed: true
};

const MAX_CHART_ALT = 2600;

const fogSlider = document.getElementById("fog-slider");
const ceilingReadout = document.getElementById("ceiling-readout");
const windButtons = document.querySelectorAll("#wind-buttons .pill-btn");
const windHint = document.getElementById("wind-hint");
const transportButtons = document.querySelectorAll("#transport-buttons .pill-btn");
const hideClosedCheckbox = document.getElementById("hide-closed");
const recBanner = document.getElementById("recommendation-banner");
const altitudeChart = document.getElementById("altitude-chart");
const spotsGrid = document.getElementById("spots-grid");
const liveWeatherBar = document.getElementById("live-weather-bar");
const liveVerdict = document.getElementById("live-verdict");
const liveUpdated = document.getElementById("live-updated");
const liveStationsGrid = document.getElementById("live-stations-grid");
const refreshWeatherBtn = document.getElementById("refresh-weather");

function formatMeters(m) {
  return `${m.toLocaleString("en-US")} m`;
}

function getEffectiveSpot(spot) {
  if (!spot.reopensAfter) return spot;
  const todayIso = new Date().toISOString().slice(0, 10);
  if (todayIso > spot.reopensAfter) {
    return {
      ...spot,
      status: "open",
      closureReason: null,
      note: spot.reopenedNote || spot.note
    };
  }
  return spot;
}

function getSpotCondition(spot) {
  if (spot.status === "closed") {
    return { key: "closed", label: "Closed (Maintenance)" };
  }
  const buffer = WIND_PROFILES[state.wind].buffer;
  if (spot.elevation >= state.ceiling + buffer) {
    return { key: "sun", label: "Clear Sun" };
  }
  if (spot.elevation >= state.ceiling) {
    return { key: "border", label: "Borderline (In Buffer)" };
  }
  return { key: "fog", label: "In Fog" };
}

function matchesFilters(spot) {
  if (state.hideClosed && spot.status === "closed") return false;
  if (state.transport !== "all" && !spot.transport.includes(state.transport)) {
    return false;
  }
  return true;
}

function renderRecommendation(filteredSpots) {
  const buffer = WIND_PROFILES[state.wind].buffer;
  const targetElev = state.ceiling + buffer;

  const clearSpots = filteredSpots.filter(
    (s) => s.status === "open" && s.elevation >= targetElev
  );
  const borderlineSpots = filteredSpots.filter(
    (s) => s.status === "open" && s.elevation >= state.ceiling && s.elevation < targetElev
  );

  if (clearSpots.length > 0) {
    const quickest = [...clearSpots].sort((a, b) => a.travelMinutes - b.travelMinutes)[0];
    const surest = [...clearSpots].sort((a, b) => b.elevation - a.elevation)[0];

    recBanner.innerHTML = `
      <div>
        <span class="rec-item-label">Target Elevation (Ceiling + ${buffer} m buffer)</span>
        <div class="rec-item-title">${formatMeters(targetElev)}+</div>
        <div class="rec-item-meta">${clearSpots.length} open spot${clearSpots.length > 1 ? "s" : ""} safely above fog</div>
      </div>
      <div>
        <span class="rec-item-label">Quickest Sunny Escape</span>
        <div class="rec-item-title">${quickest.name} (${formatMeters(quickest.elevation)})</div>
        <div class="rec-item-meta">${quickest.travelText}</div>
      </div>
      <div>
        <span class="rec-item-label">Surest High-Margin Pick</span>
        <div class="rec-item-title">${surest.name} (${formatMeters(surest.elevation)})</div>
        <div class="rec-item-meta">+${surest.elevation - state.ceiling} m above forecast fog ceiling</div>
      </div>
    `;
    return;
  }

  if (borderlineSpots.length > 0) {
    const highest = [...borderlineSpots].sort((a, b) => b.elevation - a.elevation)[0];
    recBanner.innerHTML = `
      <div>
        <span class="rec-item-label">Target Elevation</span>
        <div class="rec-item-title">${formatMeters(targetElev)}+</div>
        <div class="rec-item-meta">No open spots with full buffer</div>
      </div>
      <div>
        <span class="rec-item-label">Best Borderline Option</span>
        <div class="rec-item-title">${highest.name} (${formatMeters(highest.elevation)})</div>
        <div class="rec-item-meta">Check its webcam first—only +${highest.elevation - state.ceiling} m above ceiling</div>
      </div>
    `;
    return;
  }

  recBanner.innerHTML = `
    <div>
      <span class="rec-item-label">High Fog Warning</span>
      <div class="rec-item-title">All matching open spots are inside the fog</div>
      <div class="rec-item-meta">
        At ${formatMeters(state.ceiling)}, wait for a clearer day, broaden transport filters, or check Hoher Kasten (1,794 m) / Säntis after Dec 18.
      </div>
    </div>
  `;
}

function renderChart(filteredSpots) {
  const buffer = WIND_PROFILES[state.wind].buffer;
  const fogPct = Math.min(100, (state.ceiling / MAX_CHART_ALT) * 100);
  const bufferPct = Math.min(100 - fogPct, (buffer / MAX_CHART_ALT) * 100);

  if (filteredSpots.length === 0) {
    altitudeChart.innerHTML = `<p class="small-note">No spots match your current filter.</p>`;
    return;
  }

  altitudeChart.innerHTML = filteredSpots
    .map((spot) => {
      const cond = getSpotCondition(spot);
      const widthPct = Math.min(100, (spot.elevation / MAX_CHART_ALT) * 100);
      return `
        <div class="chart-row">
          <div class="chart-name" title="${spot.name}">${spot.name}</div>
          <div class="chart-track">
            <div class="chart-bar status-${cond.key}" style="width: ${widthPct}%"></div>
            <div class="chart-fog-zone" style="width: ${fogPct}%"></div>
            <div class="chart-buffer-zone" style="left: ${fogPct}%; width: ${bufferPct}%"></div>
          </div>
          <div class="chart-elev">${formatMeters(spot.elevation)}</div>
        </div>
      `;
    })
    .join("");
}

function renderCards(filteredSpots) {
  if (filteredSpots.length === 0) {
    spotsGrid.innerHTML = `<p class="small-note">No spots match your current filter.</p>`;
    return;
  }

  spotsGrid.innerHTML = filteredSpots
    .map((spot) => {
      const cond = getSpotCondition(spot);
      const gaBadge = spot.gaCovered ? `<span class="meta-pill">GA Covered Transit</span>` : "";
      const carOnlyBadge =
        !spot.transport.includes("public")
          ? `<span class="meta-pill">Car Recommended</span>`
          : "";
      const alertHtml = spot.closureReason
        ? `<div class="spot-alert">${spot.closureReason}</div>`
        : "";
      const linksHtml = spot.links
        .map(
          (l) =>
            `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="spot-link">${l.label} ↗</a>`
        )
        .join("");

      return `
        <article class="spot-card ${spot.status === "closed" ? "is-closed" : ""}">
          <div class="spot-top">
            <div>
              <h3 class="spot-title">${spot.name}</h3>
              <div class="spot-area">${spot.area}</div>
            </div>
            <span class="spot-elev">${formatMeters(spot.elevation)}</span>
          </div>

          <div class="badge-row">
            <span class="status-pill status-${cond.key}">${cond.label}</span>
            ${gaBadge}
            ${carOnlyBadge}
          </div>

          <p class="spot-desc">${spot.description}</p>

          <div class="spot-meta-list">
            <div><strong>Access:</strong> ${spot.travelText}</div>
          </div>

          ${alertHtml}
          <div class="spot-note">${spot.note}</div>

          ${linksHtml ? `<div class="spot-actions">${linksHtml}</div>` : ""}
        </article>
      `;
    })
    .join("");
}

function syncControlsFromState() {
  fogSlider.value = String(state.ceiling);
  windButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.wind === state.wind);
  });
}

function updateUI() {
  ceilingReadout.textContent = formatMeters(state.ceiling);
  windHint.textContent = WIND_PROFILES[state.wind].hint;

  const filtered = SPOTS.map(getEffectiveSpot).filter(matchesFilters);
  renderRecommendation(filtered);
  renderChart(filtered);
  renderCards(filtered);
}

function formatCompass(deg) {
  if (deg == null) return "—";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(((deg % 360) / 45)) % 8];
}

function formatMetric(val, unit, decimals = 1) {
  if (val == null) return "—";
  return `${Number(val).toFixed(decimals)}${unit}`;
}

function formatLocalTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-CH", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Zurich"
  });
}

function renderLiveWeather(data) {
  if (!liveWeatherBar) return;

  liveVerdict.className = "live-verdict";
  if (data.verdict.includes("Fog")) {
    liveVerdict.classList.add("verdict-fog");
  } else if (data.verdict.includes("Clear")) {
    liveVerdict.classList.add("verdict-clear");
  } else {
    liveVerdict.classList.add("verdict-overcast");
  }
  liveVerdict.textContent = `${data.verdict} · Est. ceiling ~${formatMeters(data.estimatedCeiling)}`;

  const stgTime = data.stations && data.stations.STG && data.stations.STG.observedAt;
  const timeLabel = formatLocalTime(stgTime || data.updatedAt);
  liveUpdated.textContent = `${data.source}${timeLabel ? ` · ${timeLabel} CET` : ""}`;

  const stg = (data.stations && data.stations.STG) || {};
  const hoe = (data.stations && data.stations.HOE) || {};
  const sae = (data.stations && data.stations.SAE) || {};
  const today = (data.forecast && data.forecast.today) || {};

  const stationCards = [
    {
      name: "St. Gallen",
      elev: "776 m",
      line1: `${formatMetric(stg.temp, "°C")} · ${formatMetric(stg.rh, "%", 0)} RH`,
      line2: `Wind: ${formatCompass(stg.windDir)} ${formatMetric(stg.windKmh, " km/h", 0)}`
    },
    {
      name: "Hörnli (Ridge)",
      elev: "1,133 m",
      line1: `${formatMetric(hoe.temp, "°C")} · ${formatMetric(hoe.rh, "%", 0)} RH`,
      line2: `Wind: ${formatCompass(hoe.windDir)} ${formatMetric(hoe.windKmh, " km/h", 0)}`
    },
    {
      name: "Säntis",
      elev: "2,502 m",
      line1: `${formatMetric(sae.temp, "°C")} · ${formatMetric(sae.rh, "%", 0)} RH`,
      line2: `Wind: ${formatCompass(sae.windDir)} ${formatMetric(sae.windKmh, " km/h", 0)}`
    },
    {
      name: "Today's Sun Forecast",
      elev: "SG vs. Säntis",
      line1: `St. Gallen: ${today.stGallenSunHours != null ? `${today.stGallenSunHours} h` : "—"}`,
      line2: `Säntis: ${today.saentisSunHours != null ? `${today.saentisSunHours} h` : "—"}`
    }
  ];

  liveStationsGrid.innerHTML = stationCards
    .map(
      (c) => `
      <div class="live-station-card">
        <div class="live-station-head">
          <span>${c.name}</span>
          <span class="live-station-elev">${c.elev}</span>
        </div>
        <div class="live-station-metrics">
          <div>${c.line1}</div>
          <div>${c.line2}</div>
        </div>
      </div>
    `
    )
    .join("");
}

async function fetchOpenMeteoFallback() {
  const res = await fetch(OPEN_METEO_FALLBACK_URL);
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  const raw = await res.json();
  const list = Array.isArray(raw) ? raw : [raw];
  const sg = list[0] || {};
  const sae = list[1] || {};
  const sgCur = sg.current || {};
  const saeCur = sae.current || {};
  const sgDaily = sg.daily || {};
  const saeDaily = sae.daily || {};

  const dir = sgCur.wind_direction_10m;
  const spd = sgCur.wind_speed_10m;
  let windProfile = "calm";
  if (dir >= 20 && dir <= 115 && spd >= 20) windProfile = "strong-bise";
  else if (dir >= 20 && dir <= 115 && spd >= 7) windProfile = "weak-bise";
  else if (dir >= 150 && dir <= 260 && spd >= 10) windProfile = "sw-foehn";

  const sgLow = sgCur.cloud_cover_low != null ? sgCur.cloud_cover_low : 0;
  const saeCloud = saeCur.cloud_cover != null ? saeCur.cloud_cover : 100;
  let verdict = "Overcast / High Cloud Likely";
  let estimatedCeiling = 1800;

  if ((sgCur.relative_humidity_2m >= 85 || sgLow >= 60) && (saeCur.relative_humidity_2m <= 70 || saeCloud < 65)) {
    verdict = "Classic Fog Day (Sun Above)";
    estimatedCeiling = windProfile === "strong-bise" ? 1400 : 1150;
  } else if (sgCur.relative_humidity_2m < 80 && sgLow < 40) {
    verdict = "Valley Likely Clear";
    estimatedCeiling = 750;
  }

  const toHours = (sec) => (sec != null ? Math.round((sec / 3600) * 10) / 10 : null);

  return {
    updatedAt: new Date().toISOString(),
    source: "Open-Meteo (Fallback)",
    stations: {
      STG: {
        temp: sgCur.temperature_2m,
        rh: sgCur.relative_humidity_2m,
        windDir: sgCur.wind_direction_10m,
        windKmh: sgCur.wind_speed_10m
      },
      HOE: {},
      SAE: {
        temp: saeCur.temperature_2m,
        rh: saeCur.relative_humidity_2m,
        windDir: saeCur.wind_direction_10m,
        windKmh: saeCur.wind_speed_10m
      }
    },
    forecast: {
      today: {
        stGallenSunHours: toHours(sgDaily.sunshine_duration && sgDaily.sunshine_duration[0]),
        saentisSunHours: toHours(saeDaily.sunshine_duration && saeDaily.sunshine_duration[0])
      }
    },
    windProfile,
    estimatedCeiling,
    verdict
  };
}

async function loadLiveWeather() {
  if (refreshWeatherBtn) refreshWeatherBtn.disabled = true;
  if (liveVerdict) liveVerdict.textContent = "Refreshing live weather…";

  try {
    let data;
    try {
      const apiRes = await fetch("/api/weather");
      if (!apiRes.ok) throw new Error(`API HTTP ${apiRes.status}`);
      data = await apiRes.json();
    } catch (_) {
      data = await fetchOpenMeteoFallback();
    }

    if (typeof data.estimatedCeiling === "number") {
      state.ceiling = Math.min(2000, Math.max(700, Math.round(data.estimatedCeiling / 50) * 50));
    }
    if (data.windProfile && WIND_PROFILES[data.windProfile]) {
      state.wind = data.windProfile;
    }

    syncControlsFromState();
    renderLiveWeather(data);
    updateUI();
  } catch (err) {
    if (liveVerdict) {
      liveVerdict.textContent = "Live weather unavailable—adjust sliders manually below.";
    }
    if (liveUpdated) liveUpdated.textContent = "";
  } finally {
    if (refreshWeatherBtn) refreshWeatherBtn.disabled = false;
  }
}

fogSlider.addEventListener("input", (e) => {
  state.ceiling = Number(e.target.value);
  updateUI();
});

windButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    windButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.wind = btn.dataset.wind;
    updateUI();
  });
});

transportButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    transportButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.transport = btn.dataset.transport;
    updateUI();
  });
});

hideClosedCheckbox.addEventListener("change", (e) => {
  state.hideClosed = e.target.checked;
  updateUI();
});

if (refreshWeatherBtn) {
  refreshWeatherBtn.addEventListener("click", loadLiveWeather);
}

updateUI();
loadLiveWeather();
