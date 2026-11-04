import mongoose, { Document, Schema } from 'mongoose';

export type ReportType = 'inundation' | 'river_obstruction' | 'embankment_breach' | 'dry_well' | 'crop_wilting';
export type TrustStatus = 'unverified' | 'corroborated' | 'verified';

export interface ICommunityReport extends Document {
  reportType: ReportType;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    landmark: string;
    district: string;
  };
  waterDepthCm?: number;
  photoUrl?: string;
  trustStatus: TrustStatus;
  verifiedBy?: string;
  verifiedAt?: Date;
  submittedBy: {
    userId: string;
    userName: string;
    userRole: string;
  };
  clusterId?: string;
  isDemo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommunityReportSchema = new Schema<ICommunityReport>(
  {
    reportType: {
      type: String,
      enum: ['inundation', 'river_obstruction', 'embankment_breach', 'dry_well', 'crop_wilting'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      landmark: { type: String, default: 'General Area' },
      district: { type: String, required: true },
    },
    waterDepthCm: { type: Number },
    photoUrl: { type: String },
    trustStatus: {
      type: String,
      enum: ['unverified', 'corroborated', 'verified'],
      default: 'unverified',
    },
    verifiedBy: { type: String },
    verifiedAt: { type: Date },
    submittedBy: {
      userId: { type: String, required: true },
      userName: { type: String, required: true },
      userRole: { type: String, default: 'citizen' },
    },
    clusterId: { type: String },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CommunityReport = mongoose.model<ICommunityReport>(
  'CommunityReport',
  CommunityReportSchema
);

