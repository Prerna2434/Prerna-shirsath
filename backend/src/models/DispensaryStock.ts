import { Schema, model, Document } from 'mongoose';

export interface IDispensaryStock extends Document {
  name: string;
  genericName: string;
  formulation: string;
  inStockUnits: number;
  isLowStock: boolean;
  yourPrice: number;
  metroLow: number;
  batchNumber: string;
  expiryDate: string;
}

const DispensaryStockSchema = new Schema<IDispensaryStock>(
  {
    name:          { type: String, required: true, trim: true },
    genericName:   { type: String, required: true, trim: true },
    formulation:   { type: String, required: true },
    inStockUnits:  { type: Number, required: true, min: 0 },
    isLowStock:    { type: Boolean, default: false },
    yourPrice:     { type: Number, required: true, min: 0 },
    metroLow:      { type: Number, required: true, min: 0 },
    batchNumber:   { type: String, required: true },
    expiryDate:    { type: String, required: true },
  },
  { timestamps: true },
);

// Auto-flag low stock when inStockUnits drops below 20
DispensaryStockSchema.pre('save', function (next) {
  if (this.isModified('inStockUnits')) {
    this.isLowStock = this.inStockUnits < 20;
  }
  next();
});

export const DispensaryStock = model<IDispensaryStock>('DispensaryStock', DispensaryStockSchema);
