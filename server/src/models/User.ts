import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'citizen' | 'volunteer' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  refreshToken?: string;
  location?: {
    district: string;
    state: string;
  };
  householdProfile?: {
    infantsCount: number;
    elderlyCount: number;
    mobilityImpaired: boolean;
    dwellingType: 'ground_floor' | 'upper_floor' | 'independent_house';
    hasLivestock: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['citizen', 'volunteer', 'admin'], default: 'citizen' },
    refreshToken: { type: String },
    location: {
      district: { type: String, default: 'Pune' },
      state: { type: String, default: 'Maharashtra' },
    },
    householdProfile: {
      infantsCount: { type: Number, default: 0 },
      elderlyCount: { type: Number, default: 0 },
      mobilityImpaired: { type: Boolean, default: false },
      dwellingType: { type: String, enum: ['ground_floor', 'upper_floor', 'independent_house'], default: 'ground_floor' },
      hasLivestock: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

