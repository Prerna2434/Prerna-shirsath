import { Schema, model, Document } from 'mongoose';

export interface IArbitrageTransaction extends Document {
  orderNumber: string;
  timestamp: string;
  originatingTenant: string;
  tenantCode: string;
  brandMedicine: string;
  genericMedicine: string;
  equivalenceGrade: string;
  pharmacyName: string;
  pharmacyDistance: string;
  genericPrice: number;
  brandPrice: number;
  patientSavingsPercent: number;
  doctorReview: string;
  platformFee: number;
  isSettled: boolean;
}

const ArbitrageTransactionSchema = new Schema<IArbitrageTransaction>(
  {
    orderNumber:           { type: String, required: true, unique: true },
    timestamp:             { type: String, required: true },
    originatingTenant:     { type: String, required: true },
    tenantCode:            { type: String, required: true },
    brandMedicine:         { type: String, required: true },
    genericMedicine:       { type: String, required: true },
    equivalenceGrade:      { type: String, required: true },
    pharmacyName:          { type: String, required: true },
    pharmacyDistance:      { type: String, required: true },
    genericPrice:          { type: Number, required: true, min: 0 },
    brandPrice:            { type: Number, required: true, min: 0 },
    patientSavingsPercent: { type: Number, required: true, min: 0, max: 100 },
    doctorReview:          { type: String, required: true },
    platformFee:           { type: Number, required: true, min: 0 },
    isSettled:             { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const ArbitrageTransaction = model<IArbitrageTransaction>(
  'ArbitrageTransaction',
  ArbitrageTransactionSchema,
);
