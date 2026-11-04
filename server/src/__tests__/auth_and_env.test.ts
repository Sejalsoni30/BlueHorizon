import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('BlueHorizon Server API Endpoints', () => {
  it('GET /health returns healthy status and service name', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('BlueHorizon-Backend-API');
    expect(res.body.status).toBe('healthy');
  });

  it('GET /api/env/catchments returns verified list of catchments', async () => {
    const res = await request(app).get('/api/env/catchments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.catchments)).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(2);
  });

  it('GET /api/env/latest returns weather, hydrology and data quality scores', async () => {
    const res = await request(app).get('/api/env/latest?catchmentId=catchment_pune_01');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('weather');
    expect(res.body).toHaveProperty('hydrology');
    expect(res.body).toHaveProperty('quality');
    expect(res.body.quality.dataQualityScore).toBeGreaterThanOrEqual(15);
    expect(res.body.isDemo).toBe(true);
  });

  it('GET /api/reports returns community ground reports with trustStatus', async () => {
    const res = await request(app).get('/api/reports');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.reports)).toBe(true);
    expect(res.body.reports.length).toBeGreaterThanOrEqual(1);
    expect(res.body.reports[0]).toHaveProperty('trustStatus');
  });
});

