import { Schema, model, Document } from 'mongoose';

interface OrderItem {
  name: string;
  quantity: string;
  price: number;
}

export interface IDispensaryOrder extends Document {
  orderNumber: string;
  type: 'Delivery' | 'Curbside Pickup' | 'Evening Courier';
  timeSlot: string;
  doctorRxNumber: string;
  doctorName: string;
  doctorSpecialty: string;
  cryptographicStatus: string;
  items: OrderItem[];
  patientSavings: number;
  totalPrice: number;
  isDispatched: boolean;
  trackingId?: string;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    name:     { type: String, required: true },
    quantity: { type: String, required: true },
    price:    { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const DispensaryOrderSchema = new Schema<IDispensaryOrder>(
  {
    orderNumber:          { type: String, required: true, unique: true },
    type:                 { type: String, required: true, enum: ['Delivery', 'Curbside Pickup', 'Evening Courier'] },
    timeSlot:             { type: String, required: true },
    doctorRxNumber:       { type: String, required: true },
    doctorName:           { type: String, required: true },
    doctorSpecialty:      { type: String, required: true },
    cryptographicStatus:  { type: String, required: true },
    items:                { type: [OrderItemSchema], required: true },
    patientSavings:       { type: Number, required: true, min: 0 },
    totalPrice:           { type: Number, required: true, min: 0 },
    isDispatched:         { type: Boolean, default: false },
    trackingId:           { type: String },
  },
  { timestamps: true },
);

export const DispensaryOrder = model<IDispensaryOrder>('DispensaryOrder', DispensaryOrderSchema);
