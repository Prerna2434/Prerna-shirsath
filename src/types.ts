export interface TenantSchema {
  id: string;
  name: string;
  identifier: string;
  isolationMode: string;
  dbStorage: string;
  connections: string;
  redisHitRate: string;
  status: 'Healthy' | 'Warning' | 'Syncing';
}

export interface ArbitrageTransaction {
  id: string;
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

export interface DispensaryStockItem {
  id: string;
  name: string;
  genericName: string;
  formulation: string;
  inStockUnits: number;
  isLowStock?: boolean;
  yourPrice: number;
  metroLow: number;
  batchNumber: string;
  expiryDate: string;
}

export interface DispensaryOrder {
  id: string;
  orderNumber: string;
  type: 'Delivery' | 'Curbside Pickup' | 'Evening Courier';
  timeSlot: string;
  doctorRxNumber: string;
  doctorName: string;
  doctorSpecialty: string;
  cryptographicStatus: string;
  items: {
    name: string;
    quantity: string;
    price: number;
  }[];
  patientSavings: number;
  totalPrice: number;
  isDispatched?: boolean;
  trackingId?: string;
}

export interface PrescriptionCase {
  id: string;
  rxNumber: string;
  patientName: string;
  patientAge: number;
  patientGender: 'M' | 'F';
  dob: string;
  mrn: string;
  encounterId: string;
  isStat?: boolean;
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
  drugInteractions: {
    allergyStatus: string;
    allergyDetails: string;
    activeCoMeds: string;
    coMedsDetails: string;
  };
  thumbnailUrl: string;
}

export interface CompetingPharmacy {
  rank: number;
  name: string;
  license: string;
  rating: number;
  reviewCount: number;
  genericProduct: string;
  manufacturer: string;
  ndc: string;
  patientPrice: number;
  copay: number;
  savingsPercentage: number;
  savingsDollars: number;
  fulfillmentSla: string;
  distanceOrCarrier: string;
  isDefault?: boolean;
  isBrandOnly?: boolean;
}
