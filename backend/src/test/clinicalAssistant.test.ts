import { describe, it, expect } from 'vitest';
import { getFallbackClinicalResponse } from '../services/clinicalAssistant.js';

describe('AI Clinical Pharmacy Fallback & Guidance Engine', () => {
  it('provides comprehensive clinical overview for Lipitor and Atorvastatin', () => {
    const response = getFallbackClinicalResponse('What is the generic equivalent of Lipitor 20mg?');

    expect(response).toContain('Lipitor (Atorvastatin Calcium) Clinical Overview');
    expect(response).toContain('FDA AB-Rated');
    expect(response).toContain('HMG-CoA Reductase Inhibitor');
    expect(response).toContain('DAW-0');
    expect(response).toContain('89.5% savings');
  });

  it('provides critical DDI and renal precautions for Metformin / Glucophage', () => {
    const response = getFallbackClinicalResponse('What are common drug interactions with Metformin?');

    expect(response).toContain('Metformin Extended-Release');
    expect(response).toContain('Iodinated Contrast Agents');
    expect(response).toContain('lactic acidosis');
    expect(response).toContain('eGFR < 30');
    expect(response).toContain('90.0% reduction');
  });

  it('provides NCPDP DAW codes reference guide from DAW-0 through DAW-5', () => {
    const response = getFallbackClinicalResponse('Explain DAW-0 vs DAW-1 prescription codes');

    expect(response).toContain('NCPDP Dispense As Written (DAW) Codes Reference');
    expect(response).toContain('DAW 0');
    expect(response).toContain('No Product Selection Indicated');
    expect(response).toContain('DAW 1');
    expect(response).toContain('Substitution Not Allowed by Prescriber');
    expect(response).toContain('DAW 2');
    expect(response).toContain('DAW 3');
    expect(response).toContain('DAW 5');
  });

  it('explains FDA Orange Book therapeutic bioequivalence codes (AB, AP, AN)', () => {
    const response = getFallbackClinicalResponse('Explain AB-rated therapeutic equivalence in the Orange Book');

    expect(response).toContain('FDA Orange Book Therapeutic Equivalence Codes');
    expect(response).toContain('"A" Codes');
    expect(response).toContain('AB');
    expect(response).toContain('AP');
    expect(response).toContain('AN');
    expect(response).toContain('"B" Codes');
  });

  it('explains platform generic arbitrage economics and PBM spread elimination', () => {
    const response = getFallbackClinicalResponse('How much can a patient save switching to generics?');

    expect(response).toContain('Platform Generic Arbitrage Economics');
    expect(response).toContain('85% to 92%');
    expect(response).toContain('PBM');
    expect(response).toMatch(/annual/i);
  });

  it('handles unrecognized medical queries gracefully with FDA Anda standards advice', () => {
    const response = getFallbackClinicalResponse('What is the guidance on Ondansetron ODT 4mg?');

    expect(response).toContain('Clinical Pharmacological Assessment');
    expect(response).toContain('Ondansetron ODT 4mg');
    expect(response).toContain('FDA Orange Book');
    expect(response).toContain('ANDA');
    expect(response).toContain('pharmacist or physician');
  });
});
