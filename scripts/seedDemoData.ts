import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { EnvironmentalRecord } from '../server/src/models/EnvironmentalRecord.js';
import { CommunityReport } from '../server/src/models/CommunityReport.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bluehorizon';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);

  console.log('Clearing old demo records...');
  await EnvironmentalRecord.deleteMany({ isDemo: true });
  await CommunityReport.deleteMany({ isDemo: true });

  console.log('Seeding benchmark catchments...');
  await EnvironmentalRecord.create([
    {
      catchmentId: 'catchment_pune_01',
      catchmentName: 'Mula-Mutha River Basin (Pune)',
      state: 'Maharashtra',
      coordinates: { lat: 18.5204, lng: 73.8567 },
      weather: {
        temperatureC: 27.4,
        rainfall24hMm: 48.5,
        rainfall6hMm: 18.2,
        soilMoisturePct: 74,
        humidityPct: 82,
        windSpeedKmh: 14,
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
      qualityFlags: {
        dataQualityScore: 94,
        telemetryLatencyHrs: 0.4,
        isStale: false,
        isStuckValue: false,
        isImputed: false,
        sourceDisagreement: false,
      },
      isDemo: true,
      sourceAttribution: 'Open-Meteo CC BY 4.0; CWC Telemetry',
    },
    {
      catchmentId: 'catchment_godavari_02',
      catchmentName: 'Upper Godavari Basin (Nashik)',
      state: 'Maharashtra',
      coordinates: { lat: 19.9975, lng: 73.7898 },
      weather: {
        temperatureC: 29.1,
        rainfall24hMm: 12.0,
        rainfall6hMm: 3.5,
        soilMoisturePct: 32,
        humidityPct: 54,
        windSpeedKmh: 11,
      },
      hydrology: {
        riverName: 'Godavari',
        stationName: 'Holkar Bridge Gauge',
        stageM: 553.1,
        warningStageM: 554.0,
        dangerStageM: 556.2,
        dischargeCumecs: 410,
        rateOfRiseMPerHr: 0.04,
      },
      drought: {
        spei3: -1.68,
        precipDeficit30dPct: 42,
        soilMoistureDeficitPct: 68,
        consecutiveDryDays: 22,
      },
      qualityFlags: {
        dataQualityScore: 88,
        telemetryLatencyHrs: 1.1,
        isStale: false,
        isStuckValue: false,
        isImputed: false,
        sourceDisagreement: false,
      },
      isDemo: true,
      sourceAttribution: 'Open-Meteo CC BY 4.0; CWC Telemetry',
    },
  ]);

  console.log('Seeding initial verified community ground reports...');
  await CommunityReport.create([
    {
      reportType: 'inundation',
      title: 'Water overtopping Sangam Bridge low causeway',
      description: 'River water has reached 30cm over the pedestrian causeway. Current velocity is moderate.',
      location: { lat: 18.5314, lng: 73.8653, landmark: 'Sangam Bridge', district: 'Pune' },
      waterDepthCm: 30,
      trustStatus: 'verified',
      verifiedBy: 'Field Officer Patil (SDRF Volunteer)',
      verifiedAt: new Date(),
      submittedBy: { userId: 'citizen_101', userName: 'Anil Deshmukh', userRole: 'citizen' },
      clusterId: 'cluster_18.531_73.865',
      isDemo: true,
    },
  ]);

  console.log('Database successfully seeded with benchmark demonstration data.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});

