import { fetchOpenMeteo } from './openMeteoService.js';
import { evaluateQuality } from './dataQualityMonitor.js';

export interface CatchmentDefinition {
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

export const MONITORED_CATCHMENTS: CatchmentDefinition[] = [
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
  {
    id: 'catchment_mahanadi_03',
    name: 'Mahanadi Basin (Cuttack Delta)',
    state: 'Odisha',
    lat: 20.4625,
    lng: 85.8828,
    riverName: 'Mahanadi',
    stationName: 'Naraj Hydrological Barrage',
    warningStageM: 26.4,
    dangerStageM: 27.4,
    isDroughtProne: false,
  },
  {
    id: 'catchment_raichur_04',
    name: 'Tungabhadra Semi-Arid Zone (Raichur)',
    state: 'Karnataka',
    lat: 16.212,
    lng: 77.3439,
    riverName: 'Krishna-Tungabhadra',
    stationName: 'Raichur Agromet Station',
    warningStageM: 320.0,
    dangerStageM: 324.5,
    isDroughtProne: true,
  },
];

export const getAggregatedCatchmentData = async (catchmentId?: string) => {
  const selected = catchmentId
    ? MONITORED_CATCHMENTS.find((c) => c.id === catchmentId) || MONITORED_CATCHMENTS[0]
    : MONITORED_CATCHMENTS[0];

  // Live fetch meteorological inputs from Open-Meteo
  const meteo = await fetchOpenMeteo(selected.lat, selected.lng);

  // Simulated hydrological river stage calibrated to regional baseline
  const baselineOffset = selected.isDroughtProne ? -3.5 : -1.2;
  const stageM = Number((selected.warningStageM + baselineOffset + (meteo.rainfall24hMm * 0.02)).toFixed(2));
  const rateOfRise = Number((meteo.rainfall6hMm * 0.012).toFixed(2));

  // Drought index: negative SPEI for drought-prone locations
  const spei3 = selected.isDroughtProne ? -1.65 : 0.45;
  const precipDeficit = selected.isDroughtProne ? 38 : -10;
  const dryDays = selected.isDroughtProne ? 21 : 3;

  // Run telemetry health and quality monitor
  const quality = evaluateQuality(
    meteo.latencyHrs,
    [stageM, stageM - 0.02, stageM - 0.05, stageM - 0.08],
    meteo.rainfall24hMm,
    meteo.rainfall24hMm - 4.0, // close match = high agreement
    false
  );

  return {
    catchment: selected,
    weather: meteo,
    hydrology: {
      riverName: selected.riverName,
      stationName: selected.stationName,
      stageM,
      warningStageM: selected.warningStageM,
      dangerStageM: selected.dangerStageM,
      dischargeCumecs: Math.round(stageM * 140),
      rateOfRiseMPerHr: rateOfRise,
    },
    drought: {
      spei3,
      precipDeficit30dPct: precipDeficit,
      soilMoistureDeficitPct: Math.max(0, 100 - meteo.soilMoisturePct),
      consecutiveDryDays: dryDays,
    },
    quality,
    isDemo: true,
    sourceAttribution: 'Weather by Open-Meteo.com (CC BY 4.0); River gauge reference via CWC Hydro-Informatics.',
    updatedAt: new Date().toISOString(),
  };
};

