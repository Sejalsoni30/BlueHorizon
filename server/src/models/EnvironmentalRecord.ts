import mongoose, { Document, Schema } from 'mongoose';

export interface IEnvironmentalRecord extends Document {
  catchmentId: string;
  catchmentName: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  weather: {
    temperatureC: number;
    rainfall24hMm: number;
    rainfall6hMm: number;
    soilMoisturePct: number;
    humidityPct: number;
    windSpeedKmh: number;
  };
  hydrology: {
    riverName: string;
    stationName: string;
    stageM: number;
    warningStageM: number;
    dangerStageM: number;
    dischargeCumecs?: number;
    rateOfRiseMPerHr: number;
  };
  drought: {
    spei3: number;
    precipDeficit30dPct: number;
    soilMoistureDeficitPct: number;
    consecutiveDryDays: number;
  };
  qualityFlags: {
    dataQualityScore: number;
    telemetryLatencyHrs: number;
    isStale: boolean;
    isStuckValue: boolean;
    isImputed: boolean;
    sourceDisagreement: boolean;
  };
  isDemo: boolean;
  sourceAttribution: string;
  fetchedAt: Date;
}

const EnvironmentalRecordSchema = new Schema<IEnvironmentalRecord>(
  {
    catchmentId: { type: String, required: true, index: true },
    catchmentName: { type: String, required: true },
    state: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    weather: {
      temperatureC: { type: Number, default: 28 },
      rainfall24hMm: { type: Number, default: 0 },
      rainfall6hMm: { type: Number, default: 0 },
      soilMoisturePct: { type: Number, default: 45 },
      humidityPct: { type: Number, default: 65 },
      windSpeedKmh: { type: Number, default: 12 },
    },
    hydrology: {
      riverName: { type: String, default: 'River' },
      stationName: { type: String, default: 'Station' },
      stageM: { type: Number, default: 10.0 },
      warningStageM: { type: Number, default: 12.0 },
      dangerStageM: { type: Number, default: 14.0 },
      dischargeCumecs: { type: Number },
      rateOfRiseMPerHr: { type: Number, default: 0.0 },
    },
    drought: {
      spei3: { type: Number, default: -0.2 },
      precipDeficit30dPct: { type: Number, default: 0 },
      soilMoistureDeficitPct: { type: Number, default: 20 },
      consecutiveDryDays: { type: Number, default: 0 },
    },
    qualityFlags: {
      dataQualityScore: { type: Number, default: 95 },
      telemetryLatencyHrs: { type: Number, default: 0.5 },
      isStale: { type: Boolean, default: false },
      isStuckValue: { type: Boolean, default: false },
      isImputed: { type: Boolean, default: false },
      sourceDisagreement: { type: Boolean, default: false },
    },
    isDemo: { type: Boolean, default: true },
    sourceAttribution: { type: String, default: 'Open-Meteo CC BY 4.0; CWC Telemetry' },
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const EnvironmentalRecord = mongoose.model<IEnvironmentalRecord>(
  'EnvironmentalRecord',
  EnvironmentalRecordSchema
);

