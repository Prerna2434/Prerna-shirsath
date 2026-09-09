import { Schema, model, Document } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  identifier: string;
  isolationMode: string;
  dbStorage: string;
  connections: string;
  redisHitRate: string;
  status: 'Healthy' | 'Warning' | 'Syncing';
}

const TenantSchema = new Schema<ITenant>(
  {
    name:          { type: String, required: true },
    identifier:    { type: String, required: true, unique: true },
    isolationMode: { type: String, required: true },
    dbStorage:     { type: String, required: true },
    connections:   { type: String, required: true },
    redisHitRate:  { type: String, required: true },
    status:        { type: String, required: true, enum: ['Healthy', 'Warning', 'Syncing'], default: 'Healthy' },
  },
  { timestamps: true },
);

export const Tenant = model<ITenant>('Tenant', TenantSchema);
