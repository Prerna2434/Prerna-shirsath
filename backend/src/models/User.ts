import { Schema, model, Document } from 'mongoose';

export type UserRole = 'doctor' | 'pharmacist' | 'patient' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  tenantId?: string;
  tenantName?: string;
  organization?: string;
  licenseOrNpi?: string;
  avatar: string;
  phone?: string;
  address?: string;
  insuranceProvider?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name:              { type: String, required: true },
    email:             { type: String, required: true, unique: true, lowercase: true },
    role:              { type: String, required: true, enum: ['doctor', 'pharmacist', 'patient', 'admin'] },
    roleTitle:         { type: String, required: true },
    tenantId:          { type: String },
    tenantName:        { type: String },
    organization:      { type: String },
    licenseOrNpi:      { type: String },
    avatar:            { type: String, required: true },
    phone:             { type: String },
    address:           { type: String },
    insuranceProvider: { type: String },
  },
  { timestamps: true },
);

export const User = model<IUser>('User', UserSchema);
