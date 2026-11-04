import { Router, Request, Response } from 'express';
import { MONITORED_CATCHMENTS, getAggregatedCatchmentData } from '../services/dataPipeline.js';

const router = Router();

// Get list of monitored catchments
router.get('/catchments', (_req: Request, res: Response) => {
  res.json({
    count: MONITORED_CATCHMENTS.length,
    catchments: MONITORED_CATCHMENTS,
  });
});

// Get real-time aggregated telemetry for a catchment
router.get('/latest', async (req: Request, res: Response) => {
  try {
    const catchmentId = req.query.catchmentId as string | undefined;
    const data = await getAggregatedCatchmentData(catchmentId);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch environmental data: ' + error.message });
  }
});

export default router;

