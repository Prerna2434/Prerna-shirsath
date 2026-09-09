import { Schema, model, Document } from 'mongoose';

interface DrugInteractions {
  allergyStatus: string;
  allergyDetails: string;
  activeCoMeds: string;
  coMedsDetails: string;
}

export interface IPrescriptionCase extends Document {
  rxNumber: string;
  patientName: string;
  patientAge: number;
  patientGender: 'M' | 'F';
  dob: string;
  mrn: string;
  encounterId: string;
  isStat: boolean;
  priority: 'STAT' | 'Routine' | 'DDI Alert' | 'Refill';
  queuedTime: string;
  prescriberName: string;
  prescriberTitle: string;
  prescriberNpi: string;
  prescriberDea: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  brandDrug: string;
  brandDosage: string;
  genericDrug: string;
  genericEquivRating: string;
  sig: string;
  quantity: string;
  refills: number;
  dawCode: number;
  icd10: string;
  monthlySavings: number;
  brandPrice: number;
  genericPrice: number;
  patientCopayBrand: number;
  patientCopayGeneric: number;
  genericManufacturer: string;
  genericNdc: string;
  drugInteractions: DrugInteractions;
  thumbnailUrl: string;
  /** Doctor review status set during e-prescription workflow */
  reviewStatus: 'Pending' | 'Generic Approved' | 'Brand Locked' | 'Rejected';
  /** Clinical progress notes appended during review */
  progressNotes: string;
}

const DrugInteractionsSchema = new Schema<DrugInteractions>(
  {
    allergyStatus: { type: String, required: true },
    allergyDetails: { type: String, required: true },
    activeCoMeds: { type: String, required: true },
    coMedsDetails: { type: String, required: true },
  },
  { _id: false },
);

const PrescriptionCaseSchema = new Schema<IPrescriptionCase>(
  {
    rxNumber:            { type: String, required: true, unique: true },
    patientName:         { type: String, required: true },
    patientAge:          { type: Number, required: true, min: 0 },
    patientGender:       { type: String, required: true, enum: ['M', 'F'] },
    dob:                 { type: String, required: true },
    mrn:                 { type: String, required: true },
    encounterId:         { type: String, required: true },
    isStat:              { type: Boolean, default: false },
    priority:            { type: String, required: true, enum: ['STAT', 'Routine', 'DDI Alert', 'Refill'] },
    queuedTime:          { type: String, required: true },
    prescriberName:      { type: String, required: true },
    prescriberTitle:     { type: String, required: true },
    prescriberNpi:       { type: String, required: true },
    prescriberDea:       { type: String, required: true },
    clinicName:          { type: String, required: true },
    clinicAddress:       { type: String, required: true },
    clinicPhone:         { type: String, required: true },
    brandDrug:           { type: String, required: true },
    brandDosage:         { type: String, required: true },
    genericDrug:         { type: String, required: true },
    genericEquivRating:  { type: String, required: true },
    sig:                 { type: String, required: true },
    quantity:            { type: String, required: true },
    refills:             { type: Number, required: true, min: 0 },
    dawCode:             { type: Number, required: true },
    icd10:               { type: String, required: true },
    monthlySavings:      { type: Number, required: true },
    brandPrice:          { type: Number, required: true },
    genericPrice:        { type: Number, required: true },
    patientCopayBrand:   { type: Number, required: true },
    patientCopayGeneric: { type: Number, required: true },
    genericManufacturer: { type: String, required: true },
    genericNdc:          { type: String, required: true },
    drugInteractions:    { type: DrugInteractionsSchema, required: true },
    thumbnailUrl:        { type: String, required: true },
    reviewStatus:        { type: String, default: 'Pending', enum: ['Pending', 'Generic Approved', 'Brand Locked', 'Rejected'] },
    progressNotes:       { type: String, default: '' },
  },
  { timestamps: true },
);

export const PrescriptionCase = model<IPrescriptionCase>('PrescriptionCase', PrescriptionCaseSchema);
