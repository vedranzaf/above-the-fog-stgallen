const METEOSWISS_CSV_URL =
  "https://data.geo.admin.ch/ch.meteoschweiz.messwerte-aktuell/VQHA80.csv";

const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=47.4245,47.2494&longitude=9.3767,9.3433&current=temperature_2m,relative_humidity_2m,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,wind_speed_10m,wind_direction_10m,surface_pressure,weather_code&daily=sunshine_duration,temperature_2m_max&timezone=Europe%2FZurich&forecast_days=2";

const TARGET_STATIONS = {
  ALT: { name: "Altenrhein", elevation: 398 },
  STG: { name: "St. Gallen", elevation: 776 },
  HOE: { name: "Hörnli", elevation: 1133 },
  SAE: { name: "Säntis", elevation: 2502 }
};

function toNum(val) {
  if (val == null) return null;
  const trimmed = String(val).trim();
  if (!trimmed || trimmed === "-") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function parseUtcStamp(raw) {
  if (!raw || raw.length !== 12) return null;
  const y = raw.slice(0, 4);
  const m = raw.slice(4, 6);
  const d = raw.slice(6, 8);
  const hh = raw.slice(8, 10);
  const mm = raw.slice(10, 12);
  return `${y}-${m}-${d}T${hh}:${mm}:00Z`;
}

function parseMeteoSwissCsv(csvText) {
  const stations = {};
  const lines = csvText.split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.startsWith("Station/")) continue;
    const cols = line.split(";");
    const code = (cols[0] || "").trim();
    if (!TARGET_STATIONS[code]) continue;
    stations[code] = {
      code,
      name: TARGET_STATIONS[code].name,
      elevation: TARGET_STATIONS[code].elevation,
      observedAt: parseUtcStamp((cols[1] || "").trim()),
      temp: toNum(cols[2]),
      sun10m: toNum(cols[4]),
      rh: toNum(cols[6]),
      windDir: toNum(cols[8]),
      windKmh: toNum(cols[9]),
      pressureQnh: toNum(cols[13])
    };
  }
  return stations;
}

function classifyWindProfile(dir, speed) {
  if (dir != null && speed != null) {
    if (dir >= 20 && dir <= 115 && speed >= 20) return "strong-bise";
    if (dir >= 20 && dir <= 115 && speed >= 7) return "weak-bise";
    if (dir >= 150 && dir <= 260 && speed >= 10) return "sw-foehn";
  }
  return "calm";
}

function estimateFog(stations, openMeteo) {
  const stg = stations.STG || {};
  const hoe = stations.HOE || {};
  const sae = stations.SAE || {};

  const sgCur = (openMeteo[0] && openMeteo[0].current) || {};
  const saeCur = (openMeteo[1] && openMeteo[1].current) || {};

  const windDir = hoe.windDir != null ? hoe.windDir : sgCur.wind_direction_10m;
  const windKmh = hoe.windKmh != null ? hoe.windKmh : sgCur.wind_speed_10m;
  const windProfile = classifyWindProfile(windDir, windKmh);

  const sgLowCloud = sgCur.cloud_cover_low != null ? sgCur.cloud_cover_low : 0;
  const saeCloud = saeCur.cloud_cover != null ? saeCur.cloud_cover : 100;

  const valleyDamp = (stg.rh != null && stg.rh >= 85) || sgLowCloud >= 60;
  const summitDry = (sae.rh != null && sae.rh <= 70) || saeCloud < 65;

  let verdict;
  let estimatedCeiling;

  if (valleyDamp && summitDry) {
    verdict = "Classic Fog Day (Sun Above)";
    if (hoe.rh != null && hoe.rh >= 90) {
      estimatedCeiling = windProfile === "strong-bise" ? 1450 : 1300;
    } else if (hoe.rh != null && hoe.rh < 80) {
      estimatedCeiling = windProfile === "weak-bise" ? 1050 : 950;
    } else {
      estimatedCeiling = 1150;
    }
  } else if (stg.rh != null && stg.rh < 80 && sgLowCloud < 40) {
    verdict = "Valley Likely Clear";
    estimatedCeiling = 750;
  } else {
    verdict = "Overcast / High Cloud Likely";
    estimatedCeiling = 1800;
  }

  return { windProfile, estimatedCeiling, verdict };
}

function buildForecastSummary(openMeteo) {
  const sg = openMeteo[0] || {};
  const sae = openMeteo[1] || {};
  const sgDaily = sg.daily || {};
  const saeDaily = sae.daily || {};

  const toHours = (sec) => (sec != null ? Math.round((sec / 3600) * 10) / 10 : null);

  return {
    today: {
      date: (sgDaily.time && sgDaily.time[0]) || null,
      stGallenSunHours: toHours(sgDaily.sunshine_duration && sgDaily.sunshine_duration[0]),
      stGallenMaxTemp: sgDaily.temperature_2m_max ? sgDaily.temperature_2m_max[0] : null,
      saentisSunHours: toHours(saeDaily.sunshine_duration && saeDaily.sunshine_duration[0]),
      saentisMaxTemp: saeDaily.temperature_2m_max ? saeDaily.temperature_2m_max[0] : null
    },
    tomorrow: {
      date: (sgDaily.time && sgDaily.time[1]) || null,
      stGallenSunHours: toHours(sgDaily.sunshine_duration && sgDaily.sunshine_duration[1]),
      stGallenMaxTemp: sgDaily.temperature_2m_max ? sgDaily.temperature_2m_max[1] : null,
      saentisSunHours: toHours(saeDaily.sunshine_duration && saeDaily.sunshine_duration[1]),
      saentisMaxTemp: saeDaily.temperature_2m_max ? saeDaily.temperature_2m_max[1] : null
    },
    stGallenCurrent: sg.current || null,
    saentisCurrent: sae.current || null
  };
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=300");

  try {
    const [csvRes, omRes] = await Promise.all([
      fetch(METEOSWISS_CSV_URL),
      fetch(OPEN_METEO_URL)
    ]);

    if (!csvRes.ok || !omRes.ok) {
      throw new Error(
        `Upstream error (MeteoSwiss ${csvRes.status}, Open-Meteo ${omRes.status})`
      );
    }

    const [csvText, omRaw] = await Promise.all([csvRes.text(), omRes.json()]);
    const openMeteo = Array.isArray(omRaw) ? omRaw : [omRaw];
    const stations = parseMeteoSwissCsv(csvText);
    const derived = estimateFog(stations, openMeteo);
    const forecast = buildForecastSummary(openMeteo);

    res.status(200).json({
      updatedAt: new Date().toISOString(),
      source: "MeteoSwiss VQHA80 + Open-Meteo",
      stations,
      forecast,
      windProfile: derived.windProfile,
      estimatedCeiling: derived.estimatedCeiling,
      verdict: derived.verdict
    });
  } catch (err) {
    res.status(502).json({
      error: err && err.message ? err.message : "Failed to load live weather"
    });
  }
};
