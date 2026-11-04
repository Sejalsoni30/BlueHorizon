import { Router } from 'express';
import { getReports, submitReport, verifyReport } from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getReports);
router.post('/submit', submitReport);
router.patch('/:id/verify', authenticateToken, verifyReport);

export default router;

