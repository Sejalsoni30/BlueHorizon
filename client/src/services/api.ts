const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface Catchment {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  riverName: string;
  stationName: string;
  warningStageM: number;
  dangerStageM: number;
  isDroughtProne: boolean;
}

export interface EnvironmentalData {
  catchment: Catchment;
  weather: {
    temperatureC: number;
    rainfall24hMm: number;
    rainfall6hMm: number;
    soilMoisturePct: number;
    humidityPct: number;
    windSpeedKmh: number;
    latencyHrs: number;
  };
  hydrology: {
    riverName: string;
    stationName: string;
    stageM: number;
    warningStageM: number;
    dangerStageM: number;
    dischargeCumecs: number;
    rateOfRiseMPerHr: number;
  };
  drought: {
    spei3: number;
    precipDeficit30dPct: number;
    soilMoistureDeficitPct: number;
    consecutiveDryDays: number;
  };
  quality: {
    dataQualityScore: number;
    telemetryLatencyHrs: number;
    isStale: boolean;
    isStuckValue: boolean;
    isImputed: boolean;
    sourceDisagreement: boolean;
    flags: string[];
  };
  isDemo: boolean;
  sourceAttribution: string;
  updatedAt: string;
}

export const fetchCatchments = async (): Promise<Catchment[]> => {
  try {
    const res = await fetch(`${API_BASE}/env/catchments`);
    if (res.ok) {
      const data = await res.json();
      return data.catchments;
    }
  } catch (e) {
    console.warn('API error, using cached catchments:', e);
  }
  return [
    {
      id: 'catchment_pune_01',
      name: 'Mula-Mutha River Basin (Pune)',
      state: 'Maharashtra',
      lat: 18.5204,
      lng: 73.8567,
      riverName: 'Mula-Mutha',
      stationName: 'Bund Garden Gauge 04',
      warningStageM: 535.5,
      dangerStageM: 537.0,
      isDroughtProne: false,
    },
    {
      id: 'catchment_godavari_02',
      name: 'Upper Godavari Basin (Nashik)',
      state: 'Maharashtra',
      lat: 19.9975,
      lng: 73.7898,
      riverName: 'Godavari',
      stationName: 'Holkar Bridge Gauge',
      warningStageM: 554.0,
      dangerStageM: 556.2,
      isDroughtProne: true,
    },
  ];
};

export const fetchLatestEnvironmentalData = async (catchmentId?: string): Promise<EnvironmentalData> => {
  try {
    const res = await fetch(`${API_BASE}/env/latest?catchmentId=${catchmentId || ''}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('API error, using synthetic local data:', e);
  }

  // Local fallback with real scientific values
  return {
    catchment: {
      id: 'catchment_pune_01',
      name: 'Mula-Mutha River Basin (Pune)',
      state: 'Maharashtra',
      lat: 18.5204,
      lng: 73.8567,
      riverName: 'Mula-Mutha',
      stationName: 'Bund Garden Gauge 04',
      warningStageM: 535.5,
      dangerStageM: 537.0,
      isDroughtProne: false,
    },
    weather: {
      temperatureC: 27.4,
      rainfall24hMm: 48.5,
      rainfall6hMm: 18.2,
      soilMoisturePct: 74,
      humidityPct: 82,
      windSpeedKmh: 14,
      latencyHrs: 0.4,
    },
    hydrology: {
      riverName: 'Mula-Mutha',
      stationName: 'Bund Garden Gauge 04',
      stageM: 534.8,
      warningStageM: 535.5,
      dangerStageM: 537.0,
      dischargeCumecs: 840,
      rateOfRiseMPerHr: 0.18,
    },
    drought: {
      spei3: 0.15,
      precipDeficit30dPct: -8,
      soilMoistureDeficitPct: 26,
      consecutiveDryDays: 2,
    },
    quality: {
      dataQualityScore: 94,
      telemetryLatencyHrs: 0.4,
      isStale: false,
      isStuckValue: false,
      isImputed: false,
      sourceDisagreement: false,
      flags: ['All sensor checks normal'],
    },
    isDemo: true,
    sourceAttribution: 'Weather by Open-Meteo.com (CC BY 4.0); River gauge reference via CWC.',
    updatedAt: new Date().toISOString(),
  };
};

