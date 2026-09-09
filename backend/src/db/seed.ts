/**
 * Seed script — populates each collection with initial data if it is empty.
 * Safe to call on every startup: it checks count before inserting.
 *
 * Run standalone:  npx tsx src/db/seed.ts
 */
import 'dotenv/config';
import { connectDB, disconnectDB } from './connection.js';
import { DispensaryStock } from '../models/DispensaryStock.js';
import { DispensaryOrder } from '../models/DispensaryOrder.js';
import { PrescriptionCase } from '../models/PrescriptionCase.js';
import { ArbitrageTransaction } from '../models/ArbitrageTransaction.js';
import { Tenant } from '../models/Tenant.js';
import { User } from '../models/User.js';

// ---------------------------------------------------------------------------
// Seed data (mirrors frontend/src/data/mockData.ts — source of truth)
// ---------------------------------------------------------------------------

const STOCK_SEED = [
  {
    name: 'Atorvastatin Calcium 20mg',
    genericName: 'Atorvastatin Pure (Lipitor Equiv)',
    formulation: 'Tablet • 30 ct',
    inStockUnits: 420,
    yourPrice: 12.40,
    metroLow: 12.40,
    batchNumber: '#BT-90241',
    expiryDate: '08/2026',
  },
  {
    name: 'Metformin HCl 850mg',
    genericName: 'Metformin Standard (Glucophage)',
    formulation: 'Tablet • 60 ct',
    inStockUnits: 185,
    yourPrice: 8.90,
    metroLow: 8.40,
    batchNumber: '#MF-33128',
    expiryDate: '11/2026',
  },
  {
    name: 'Paracetamol Oral Sol. 250mg/5ml',
    genericName: 'Acetaminophen Pediatric',
    formulation: 'Syrup • 100ml',
    inStockUnits: 88,
    yourPrice: 4.20,
    metroLow: 4.20,
    batchNumber: '#SY-0911',
    expiryDate: '04/2025',
  },
  {
    name: 'Amoxicillin Trihydrate 500mg',
    genericName: 'Amoxicillin Broad-Spectrum',
    formulation: 'Capsule • 21 ct',
    inStockUnits: 14,
    yourPrice: 9.50,
    metroLow: 9.15,
    batchNumber: '#AM-66120',
    expiryDate: '01/2026',
  },
  {
    name: 'Lisinopril Dihydrate 10mg',
    genericName: 'Lisinopril (Prinivil Equiv)',
    formulation: 'Tablet • 90 ct',
    inStockUnits: 310,
    yourPrice: 11.10,
    metroLow: 11.10,
    batchNumber: '#LS-4401',
    expiryDate: '10/2026',
  },
];

const ORDERS_SEED = [
  {
    orderNumber: '#ORD-9082',
    type: 'Delivery' as const,
    timeSlot: 'Slot: 11:30 AM (in 18m)',
    doctorRxNumber: 'Rx #E-9921',
    doctorName: 'Dr. Sarah Lin',
    doctorSpecialty: 'Cardio',
    cryptographicStatus: 'Cryptographically Signed • State Telehealth OK',
    items: [
      { name: 'Atorvastatin Calcium 20mg (30x)', quantity: '30x', price: 12.40 },
      { name: 'Metformin HCl 850mg (60x)', quantity: '60x', price: 8.40 },
    ],
    patientSavings: 32.10,
    totalPrice: 20.80,
  },
  {
    orderNumber: '#ORD-9083',
    type: 'Curbside Pickup' as const,
    timeSlot: 'Ready in 30 mins',
    doctorRxNumber: 'Rx #E-4012',
    doctorName: 'Dr. Ronald Weiss',
    doctorSpecialty: 'Internal Med',
    cryptographicStatus: 'Verified Generic Formulation Match',
    items: [{ name: 'Amoxicillin 500mg (21 ct)', quantity: '21 ct', price: 9.15 }],
    patientSavings: 14.50,
    totalPrice: 9.15,
  },
  {
    orderNumber: '#ORD-9084',
    type: 'Evening Courier' as const,
    timeSlot: 'Slot: 04:00 PM',
    doctorRxNumber: 'Rx #E-8831',
    doctorName: 'Dr. Anita K.',
    doctorSpecialty: 'Pediatrics',
    cryptographicStatus: 'Pediatric Prescription Verification Complete',
    items: [
      { name: 'Paracetamol Sol. 250mg/5ml', quantity: '100ml', price: 4.20 },
      { name: 'Lisinopril 10mg (90 ct)', quantity: '90 ct', price: 11.10 },
    ],
    patientSavings: 44.00,
    totalPrice: 15.30,
  },
];

const PRESCRIPTIONS_SEED = [
  {
    rxNumber: 'Rx #MED-9402',
    patientName: 'Robert Chen',
    patientAge: 54,
    patientGender: 'M' as const,
    dob: '11/14/1969',
    mrn: '88201944',
    encounterId: 'ENC-009214-CA',
    isStat: true,
    priority: 'STAT' as const,
    queuedTime: '4m ago',
    prescriberName: 'Dr. Marcus Thorne, MD',
    prescriberTitle: 'Chief of Cardiology',
    prescriberNpi: '1043928110',
    prescriberDea: 'BT9842104',
    clinicName: 'Sutter Health Specialty Clinic',
    clinicAddress: '350 Parnassus Ave, Suite 400 • San Francisco, CA',
    clinicPhone: '(415) 555-0192',
    brandDrug: 'Lipitor (Brand)',
    brandDosage: '20mg Film-Coated Tablet',
    genericDrug: 'Atorvastatin Calcium (Generic)',
    genericEquivRating: 'FDA AB-Rated',
    sig: '1 Tablet by mouth Daily at bedtime (QD)',
    quantity: '90 Tablets',
    refills: 3,
    dawCode: 0,
    icd10: 'E78.00 (Pure Hypercholesterolemia, unspecified)',
    monthlySavings: 79.80,
    brandPrice: 94.20,
    genericPrice: 14.40,
    patientCopayBrand: 85.00,
    patientCopayGeneric: 5.20,
    genericManufacturer: 'Teva Pharmaceuticals USA',
    genericNdc: '00093-7212-98',
    drugInteractions: {
      allergyStatus: 'No Known Adverse Interactions',
      allergyDetails: 'Patient allergy: Penicillin (Hives). Atorvastatin & excipients are fully non-cross-reactive.',
      activeCoMeds: 'Lisinopril 10mg QD • Metformin 500mg BID',
      coMedsDetails: 'CYP3A4 clearance safe. No hepatotoxicity or myopathy flags detected.',
    },
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyuBfqjaKLxrwYWNTP8KYZ-tGZKzf6SA9ybYTOWZfm_jukqUElSEjmRUDYbg7C7JHYscZwi-tOY9EphgZDgZ_o1m8LOWVbMa3EN6D5FqIAtY-joB5y-aFXcu4BLOyxV3A5hkCGjOKHDYpgPWM_4YCRl3uQC57mtkUeh6ikEoFaLxEEZ-4wr4xeAO12LKrD_Z145T_lTQnP-QEjCe-0aM59pN_eyVhGwjXedyaTfBN2NpO1V-hHGhF2nA',
    reviewStatus: 'Pending' as const,
    progressNotes: '',
  },
  {
    rxNumber: 'Rx #MED-9403',
    patientName: 'Sarah Jenkins',
    patientAge: 38,
    patientGender: 'F' as const,
    dob: '04/22/1986',
    mrn: '77192841',
    encounterId: 'ENC-004128-CA',
    isStat: false,
    priority: 'Routine' as const,
    queuedTime: '12m ago',
    prescriberName: 'Dr. Emily Watson, MD',
    prescriberTitle: 'Family Practitioner',
    prescriberNpi: '1948201944',
    prescriberDea: 'BW4418291',
    clinicName: 'St. Jude Family Practice',
    clinicAddress: '1200 Market St • San Francisco, CA',
    clinicPhone: '(415) 555-0382',
    brandDrug: 'Lexapro 10mg Tab',
    brandDosage: '10mg Tablet',
    genericDrug: 'Escitalopram Oxalate 10mg QD',
    genericEquivRating: 'FDA AB-Rated',
    sig: '1 Tablet daily in morning with food',
    quantity: '30 Tablets',
    refills: 2,
    dawCode: 0,
    icd10: 'F41.1 (Generalized Anxiety Disorder)',
    monthlySavings: 42.10,
    brandPrice: 62.00,
    genericPrice: 8.90,
    patientCopayBrand: 48.00,
    patientCopayGeneric: 4.00,
    genericManufacturer: 'Aurobindo Pharma',
    genericNdc: '65862-0210-30',
    drugInteractions: {
      allergyStatus: 'Cleared',
      allergyDetails: 'NKDA. No excipient cross-reactivity.',
      activeCoMeds: 'None reported',
      coMedsDetails: 'Monotherapy initiation. Baseline ECG recommended.',
    },
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6BGx4XX0jh3j7OaM8PHg-mNU_Q7wp_EAf2Mgb-Z9TI0FIjqgcwtEpylMWub5bqlO15Iw2MhtouThwWqPd5vwWrEdF0FQYTwLftOoURu718qbCL3v3ktKyvfgN00scEayXRTSw_VyB9Ot79GnY8tzu7VTLLFb8bPqNGJrtHY9KUxsZMq3n9uIevtOuBZsfCgkRzSQsrd-s2rS5UPme8GxL6YQI83oPRonPaZMfucW2vZfZo_OP0HyQSA',
    reviewStatus: 'Pending' as const,
    progressNotes: '',
  },
  {
    rxNumber: 'Rx #MED-9404',
    patientName: 'David K. Vance',
    patientAge: 67,
    patientGender: 'M' as const,
    dob: '08/09/1959',
    mrn: '66184022',
    encounterId: 'ENC-008891-CA',
    isStat: false,
    priority: 'DDI Alert' as const,
    queuedTime: '18m ago',
    prescriberName: 'Dr. Jonathan Blake, MD',
    prescriberTitle: 'Cardiovascular Interventionist',
    prescriberNpi: '1192840182',
    prescriberDea: 'BB3301928',
    clinicName: 'Pacific Cardiology Group',
    clinicAddress: '900 Hyde St • San Francisco, CA',
    clinicPhone: '(415) 555-0819',
    brandDrug: 'Plavix 75mg',
    brandDosage: '75mg Film-Coated Tablet',
    genericDrug: 'Clopidogrel Bisulfate 75mg',
    genericEquivRating: 'Warning Flagged',
    sig: '1 Tablet daily post-PCI stent',
    quantity: '30 Tablets',
    refills: 1,
    dawCode: 0,
    icd10: 'I25.10 (Atherosclerotic heart disease)',
    monthlySavings: 54.00,
    brandPrice: 85.00,
    genericPrice: 12.50,
    patientCopayBrand: 65.00,
    patientCopayGeneric: 6.00,
    genericManufacturer: 'Sanofi Winthrop / Apotex',
    genericNdc: '60505-2525-03',
    drugInteractions: {
      allergyStatus: 'Caution Required',
      allergyDetails: 'Plavix 75mg + Omeprazole Co-Rx attenuation. CYP2C19 competitive inhibition reduces antiplatelet effect.',
      activeCoMeds: 'Omeprazole 40mg QD',
      coMedsDetails: 'Recommendation: Switch PPI to Pantoprazole to preserve antiplatelet efficacy.',
    },
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxnif5spzjYrRDWrYtDg0rIiI-1NZOho0EyJa_ptKSLK34KPwNYgWOA8tBNpXw0C48Qs7R1oqUn2OlHde16Vn-yLQu2Itwx-d1GP9_KvJwdT3cLv5XarfL8o3iJLU_JsmFBIb11YYV-3EjIibhBiWbgsAAf7pCOcrVfCOvIPTVnPosOK6RmfIZ0hSl1upAnuj0phgBy36elnKoajNRhJ_mvsnSbTXbSjbtU1GwPXRPFW8MIJba2bVrfg',
    reviewStatus: 'Pending' as const,
    progressNotes: '',
  },
  {
    rxNumber: 'Rx #MED-9405',
    patientName: 'Maria Santos',
    patientAge: 42,
    patientGender: 'F' as const,
    dob: '02/17/1982',
    mrn: '90214812',
    encounterId: 'ENC-001294-CA',
    isStat: false,
    priority: 'Refill' as const,
    queuedTime: '25m ago',
    prescriberName: 'Dr. Rebecca Young, MD',
    prescriberTitle: 'Endocrinologist',
    prescriberNpi: '1882019481',
    prescriberDea: 'BY9921401',
    clinicName: 'Metro Endocrinology',
    clinicAddress: '450 Sutter St • San Francisco, CA',
    clinicPhone: '(415) 555-0450',
    brandDrug: 'Glucophage XR 500mg',
    brandDosage: '500mg Extended Release',
    genericDrug: 'Metformin HCl ER 500mg (Teva)',
    genericEquivRating: 'FDA AB-Rated',
    sig: '1 Tablet twice daily with breakfast and dinner',
    quantity: '60 Tablets',
    refills: 5,
    dawCode: 0,
    icd10: 'E11.9 (Type 2 Diabetes Mellitus)',
    monthlySavings: 58.30,
    brandPrice: 72.00,
    genericPrice: 7.20,
    patientCopayBrand: 55.00,
    patientCopayGeneric: 3.50,
    genericManufacturer: 'Teva Pharmaceuticals',
    genericNdc: '00093-7412-06',
    drugInteractions: {
      allergyStatus: 'Cleared',
      allergyDetails: 'No known medication allergies. Renal eGFR: 84 mL/min (Optimal).',
      activeCoMeds: 'Atorvastatin 20mg QD',
      coMedsDetails: 'Standard therapeutic combination. High compliance record.',
    },
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBctmlxuiOS9K3oApFfgR328xcypmQRf5gdVMhBhsucW94vXSxSTVUtJmtC2VbA3Z9JnxwYX6W3S9MP2Xtgc9yiNHxfxsTqZBRQp_TX2znvQOiTES0IJY3LEesxR2esEcatrxA6SQg3jF8FahIw4LJa87isjs5Urw8fUm86InvkUHVD2dzDsTCGXTOVMu9jBlb0KOIY6WNkoCMghMynC01PC9AC7LMu5hyhRcKq_J0Ox-s_Wie33H6lSw',
    reviewStatus: 'Pending' as const,
    progressNotes: '',
  },
  {
    rxNumber: 'Rx #MED-9406',
    patientName: 'Thomas Wu',
    patientAge: 31,
    patientGender: 'M' as const,
    dob: '09/03/1993',
    mrn: '55192830',
    encounterId: 'ENC-006620-CA',
    isStat: false,
    priority: 'Routine' as const,
    queuedTime: '34m ago',
    prescriberName: 'Dr. Kevin Zhao, MD',
    prescriberTitle: 'Pulmonologist',
    prescriberNpi: '1440192841',
    prescriberDea: 'BZ1092841',
    clinicName: 'Bay Area Internal Med',
    clinicAddress: '1500 Owens St • San Francisco, CA',
    clinicPhone: '(415) 555-0921',
    brandDrug: 'Singulair 10mg Tab',
    brandDosage: '10mg Film-Coated Tablet',
    genericDrug: 'Montelukast Sodium 10mg QD',
    genericEquivRating: 'FDA AB-Rated',
    sig: '1 Tablet by mouth every evening',
    quantity: '30 Tablets',
    refills: 3,
    dawCode: 0,
    icd10: 'J45.40 (Moderate persistent asthma)',
    monthlySavings: 64.00,
    brandPrice: 78.50,
    genericPrice: 8.10,
    patientCopayBrand: 60.00,
    patientCopayGeneric: 4.20,
    genericManufacturer: 'Glenmark Pharmaceuticals',
    genericNdc: '68462-0105-30',
    drugInteractions: {
      allergyStatus: 'Cleared',
      allergyDetails: 'Aspirin sensitive asthma noted; montelukast is indicated and protective.',
      activeCoMeds: 'Albuterol HFA inhaler PRN',
      coMedsDetails: 'Synergistic asthma maintenance protocol.',
    },
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxI9GWYoc2_q4TPcvtsW4OrOCRUy2HBpksFnOoYKnMTNV4imb8KfkqAszClGkA_-IDO_EOIwqRM3cw-twmu9gN_rdhCLpfkNuD8b_k2Ulmy4ZtMf4nxNdiM_c1eMVJ6KVfVF-A_DlymwOVljaG7kw0Z1Y9zsxTZDrrGp7aR8dy6GfEn-3u9yuXoG3YZvbO8FV0WsXXo14VFlw_NoxJ19E69JPUfnugj-HWUTRPqmmwpAiFzC515bV3VA',
    reviewStatus: 'Pending' as const,
    progressNotes: '',
  },
];

const ARBITRAGE_SEED = [
  {
    orderNumber: '#RX-994821',
    timestamp: 'Seeded',
    originatingTenant: 'NY Presbyterian',
    tenantCode: 'tenant_ny_presby',
    brandMedicine: 'Lipitor 20mg',
    genericMedicine: 'Atorvastatin 20mg',
    equivalenceGrade: 'Therapeutic Grade AB',
    pharmacyName: 'CVS Pharmacy #4129',
    pharmacyDistance: '0.8 miles from patient',
    genericPrice: 12.40,
    brandPrice: 84.00,
    patientSavingsPercent: 85.2,
    doctorReview: 'Dr. R. Vance Approved',
    platformFee: 0.62,
    isSettled: true,
  },
  {
    orderNumber: '#RX-994820',
    timestamp: 'Seeded',
    originatingTenant: 'Apollo Health',
    tenantCode: 'tenant_apollo_rx',
    brandMedicine: 'Crestor 10mg',
    genericMedicine: 'Rosuvastatin 10mg',
    equivalenceGrade: 'Direct Generic Sub',
    pharmacyName: 'Walgreens Hub #102',
    pharmacyDistance: '1.4 miles away',
    genericPrice: 14.20,
    brandPrice: 118.50,
    patientSavingsPercent: 88.0,
    doctorReview: 'Dr. M. Chen Approved',
    platformFee: 0.71,
    isSettled: true,
  },
  {
    orderNumber: '#RX-994819',
    timestamp: 'Seeded',
    originatingTenant: 'Mayo Dispensary',
    tenantCode: 'tenant_mayo_clinic',
    brandMedicine: 'Nexium 40mg DR',
    genericMedicine: 'Esomeprazole 40mg',
    equivalenceGrade: 'Delayed Release USP',
    pharmacyName: 'Rite Aid Express #98',
    pharmacyDistance: 'Mail order dispatch',
    genericPrice: 18.90,
    brandPrice: 96.00,
    patientSavingsPercent: 80.3,
    doctorReview: 'Automated Standing Protocol',
    platformFee: 0.94,
    isSettled: true,
  },
  {
    orderNumber: '#RX-994818',
    timestamp: 'Seeded',
    originatingTenant: 'CVS Direct',
    tenantCode: 'tenant_cvs_direct',
    brandMedicine: 'Zoloft 50mg',
    genericMedicine: 'Sertraline HCl 50mg',
    equivalenceGrade: 'Therapeutic Match AB',
    pharmacyName: 'CVS Pharmacy #8821',
    pharmacyDistance: '0.4 miles away',
    genericPrice: 9.80,
    brandPrice: 65.00,
    patientSavingsPercent: 84.9,
    doctorReview: 'Dr. K. Patel Approved',
    platformFee: 0.49,
    isSettled: true,
  },
];

const TENANTS_SEED = [
  {
    name: 'NewYork-Presbyterian Hospital Network',
    identifier: 'tenant_ny_presby',
    isolationMode: 'Separate Schema',
    dbStorage: '412.8 GB',
    connections: '84 / 120',
    redisHitRate: '98.4%',
    status: 'Healthy' as const,
  },
  {
    name: 'Apollo Retail Pharmacy Consortium',
    identifier: 'tenant_apollo_rx',
    isolationMode: 'Separate Schema',
    dbStorage: '689.1 GB',
    connections: '112 / 150',
    redisHitRate: '97.1%',
    status: 'Healthy' as const,
  },
  {
    name: 'CVS Direct Regional Fulfillment',
    identifier: 'tenant_cvs_direct',
    isolationMode: 'Separate Schema',
    dbStorage: '1,024.4 GB',
    connections: '144 / 200',
    redisHitRate: '95.8%',
    status: 'Healthy' as const,
  },
  {
    name: 'Mayo Integrated Health Dispensary',
    identifier: 'tenant_mayo_clinic',
    isolationMode: 'Separate Schema',
    dbStorage: '322.0 GB',
    connections: '42 / 100',
    redisHitRate: '99.1%',
    status: 'Healthy' as const,
  },
];

const USERS_SEED = [
  {
    name: 'Dr. Evelyn Vance, MD',
    email: 'evelyn.vance@metrohealth.org',
    role: 'admin' as const,
    roleTitle: 'Chief Platform Admin & Medical Director',
    tenantId: 'tenant_082',
    tenantName: 'Metro Health Network',
    licenseOrNpi: 'NPI: 1043928110 • CA Lic: #C52910',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFCfPKkB2BWjyQ-UFGa_AGt2LDjt6uMda4zSVzMk003H7PkkoIAzlu0EELvhfojYlymmuHI9Dx_fScl8hcC_3RaSGReUcHiiKO5iyNQF_8kCXwSS0qNr6WLk6vSatLeONFZFQ0NMR8fOSJSYHpZnsUR2dntDBQ-ihdu6DdsayY-OGdhxUDMup6bpnc4sMng3ENjFwYxxBbfWBBikuxpGMlb_9DDGGqgKuS2ZcsnMHoKESOGVpcd3VYsQ',
  },
  {
    name: 'Marcus Vance, PharmD',
    email: 'm.vance@carefirstrx.com',
    role: 'pharmacist' as const,
    roleTitle: 'Supervising Dispensary Pharmacist',
    tenantId: 'tenant_carefirst_402',
    tenantName: 'CareFirst Pharmacy Network #402',
    licenseOrNpi: 'RPh Lic: #PH-88912 • DEA: #BC-9920149',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgqIKKJmkC-BDaRqeUIHYTGVhd11q8Rf4uxEZMzQbF3AFJVSWtklYi2bYl5ID7PL5pPKqrdce0J3TREg7OFKfIGEmsOTZR8ajJRkXC6tgJMZsqGpFv2bH3_kRV704IWR2zPSLEbPXrNgIF9lsWqDyrk5MSE1v47FEyN1nB6AEi4DAwzcNeOgtF2ro9kqjMLDf56eH6KPUc_5cR952aBBzwJVIYeTyv96yBMXTzey4RilXkPg_8HKyzpA',
  },
  {
    name: 'Robert Chen',
    email: 'robert.chen@gmail.com',
    role: 'patient' as const,
    roleTitle: 'Chronic Care Patient',
    phone: '(415) 555-0192',
    address: '742 Mission St, Apt 4B, San Francisco, CA 94107',
    insuranceProvider: 'BlueShield California (RxBIN: 004336)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

// ---------------------------------------------------------------------------
// Seeder
// ---------------------------------------------------------------------------

async function seedCollection<T>(
  label: string,
  model: { countDocuments: () => Promise<number>; insertMany: (docs: T[]) => Promise<unknown> },
  data: T[],
): Promise<void> {
  const count = await model.countDocuments();
  if (count > 0) {
    console.log(`[Seed] ${label}: already has ${count} document(s), skipping.`);
    return;
  }
  await model.insertMany(data);
  console.log(`[Seed] ${label}: inserted ${data.length} document(s).`);
}

export async function seedAll(): Promise<void> {
  await seedCollection('DispensaryStock', DispensaryStock, STOCK_SEED);
  await seedCollection('DispensaryOrder', DispensaryOrder, ORDERS_SEED);
  await seedCollection('PrescriptionCase', PrescriptionCase, PRESCRIPTIONS_SEED);
  await seedCollection('ArbitrageTransaction', ArbitrageTransaction, ARBITRAGE_SEED);
  await seedCollection('Tenant', Tenant, TENANTS_SEED);
  await seedCollection('User', User, USERS_SEED);
}

// ---------------------------------------------------------------------------
// Standalone execution
// ---------------------------------------------------------------------------

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  connectDB()
    .then(() => seedAll())
    .then(() => disconnectDB())
    .then(() => process.exit(0))
    .catch((err: unknown) => {
      console.error('[Seed] Fatal error:', err);
      process.exit(1);
    });
}
