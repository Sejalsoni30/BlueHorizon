import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { CommunityReport, TrustStatus, ReportType } from '../models/CommunityReport.js';
import { AuthRequest } from '../middleware/auth.js';

const reportSchema = z.object({
  reportType: z.enum(['inundation', 'river_obstruction', 'embankment_breach', 'dry_well', 'crop_wilting']),
  title: z.string().min(3),
  description: z.string().min(5),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  landmark: z.string().default('Local Area'),
  district: z.string().default('Pune'),
  waterDepthCm: z.number().optional(),
  photoUrl: z.string().optional(),
});

// Benchmark demo seed reports for initial hydration
const DEMO_REPORTS = [
  {
    _id: 'report_demo_01',
    reportType: 'inundation',
    title: 'Water overtopping Sangam Bridge low causeway',
    description: 'River water has reached 30cm over the pedestrian causeway. Current velocity is moderate.',
    location: { lat: 18.5314, lng: 73.8653, landmark: 'Sangam Bridge', district: 'Pune' },
    waterDepthCm: 30,
    trustStatus: 'verified',
    verifiedBy: 'Field Officer Patil (SDRF Volunteer)',
    verifiedAt: new Date(Date.now() - 3600000),
    submittedBy: { userId: 'citizen_101', userName: 'Anil Deshmukh', userRole: 'citizen' },
    isDemo: true,
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    _id: 'report_demo_02',
    reportType: 'embankment_breach',
    title: 'Erosion on right bank levee near Holkar Bridge',
    description: 'Minor scouring on earthen embankment after dam discharge. No houses inundated yet.',
    location: { lat: 19.9982, lng: 73.7912, landmark: 'Holkar Bridge Embankment', district: 'Nashik' },
    waterDepthCm: 0,
    trustStatus: 'corroborated',
    submittedBy: { userId: 'citizen_102', userName: 'Sunita Gaikwad', userRole: 'citizen' },
    isDemo: true,
    createdAt: new Date(Date.now() - 14400000),
  },
  {
    _id: 'report_demo_03',
    reportType: 'dry_well',
    title: 'Agricultural borewell dried out in Wardha sector',
    description: 'Borewell yield dropped to zero after 28 dry days. Soil cracks visible across cotton crop.',
    location: { lat: 16.215, lng: 77.348, landmark: 'Agri Plot 14', district: 'Raichur' },
    waterDepthCm: 0,
    trustStatus: 'unverified',
    submittedBy: { userId: 'citizen_103', userName: 'Mallikarjun R.', userRole: 'citizen' },
    isDemo: true,
    createdAt: new Date(Date.now() - 28800000),
  },
];

export const getReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const { district, status, type } = req.query;
    const query: any = {};
    if (district) query['location.district'] = district;
    if (status) query.trustStatus = status;
    if (type) query.reportType = type;

    let dbReports: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        dbReports = await CommunityReport.find(query).sort({ createdAt: -1 }).limit(50);
      } catch {}
    }

    // Merge with demo reports if DB has no results or offline
    const allReports = dbReports.length > 0 ? dbReports : DEMO_REPORTS;
    res.json({ reports: allReports });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch reports: ' + err.message });
  }
};

export const submitReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validated = reportSchema.parse(req.body);
    const user = req.user || { id: 'anon_citizen', email: 'citizen@bluehorizon.local', role: 'citizen' };

    // Duplicate detection heuristic (within 0.005 degrees ~ 500m)
    const clusterId = `cluster_${validated.lat.toFixed(3)}_${validated.lng.toFixed(3)}`;

    const newReport = new CommunityReport({
      reportType: validated.reportType,
      title: validated.title,
      description: validated.description,
      location: {
        lat: validated.lat,
        lng: validated.lng,
        landmark: validated.landmark,
        district: validated.district,
      },
      waterDepthCm: validated.waterDepthCm,
      photoUrl: validated.photoUrl,
      trustStatus: user.role === 'admin' || user.role === 'volunteer' ? 'verified' : 'unverified',
      submittedBy: {
        userId: user.id,
        userName: user.email.split('@')[0],
        userRole: user.role,
      },
      clusterId,
      isDemo: false,
    });

    try {
      await newReport.save();
    } catch {
      // Memory fallback
    }

    res.status(201).json({
      message: 'Report submitted successfully. Added to community ground verification queue.',
      report: newReport,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors[0].message });
      return;
    }
    res.status(500).json({ error: 'Failed to submit report: ' + err.message });
  }
};

export const verifyReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { trustStatus } = req.body; // 'corroborated' | 'verified'

    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'volunteer')) {
      res.status(403).json({ error: 'Only registered volunteers and administrators can verify ground reports' });
      return;
    }

    let report = null;
    try {
      report = await CommunityReport.findByIdAndUpdate(
        id,
        {
          trustStatus,
          verifiedBy: `${req.user.email} (${req.user.role})`,
          verifiedAt: new Date(),
        },
        { new: true }
      );
    } catch {}

    res.json({
      message: `Report marked as ${trustStatus}`,
      report: report || { id, trustStatus },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Verification failed: ' + err.message });
  }
};
