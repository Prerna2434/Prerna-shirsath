import React, { useState } from 'react';

export const PrdViewerModal: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'requirements' | 'architecture' | 'traceability'>('overview');

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e5eeff]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#006b53] text-[#ffffff] font-label-sm text-[11px] font-bold uppercase tracking-wider">
              Official PRD Specification • v1.0
            </span>
            <span className="font-code-num text-xs text-[#525f75]">Doc Ref: PRD-GM-2026-09</span>
          </div>
          <h1 className="font-headline-md text-xl sm:text-2xl font-bold text-[#0b1c30]">
            GeneticMedicine: Unified Clinical Arbitrage & Multi-Tenant Pharmacy Platform
          </h1>
          <p className="font-body-sm text-xs sm:text-sm text-[#525f75]">
            Engineering & Product Requirements Specification • Production Release
          </p>
        </div>

        {/* Section tabs */}
        <div className="flex items-center bg-[#eff4ff] p-1 rounded-xl border border-[#dce9ff] text-xs">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSection === 'overview' ? 'bg-[#006b53] text-white shadow-xs' : 'text-[#525f75]'
            }`}
          >
            Overview & Goals
          </button>
          <button
            onClick={() => setActiveSection('requirements')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSection === 'requirements' ? 'bg-[#006b53] text-white shadow-xs' : 'text-[#525f75]'
            }`}
          >
            Functional Scope
          </button>
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSection === 'architecture' ? 'bg-[#006b53] text-white shadow-xs' : 'text-[#525f75]'
            }`}
          >
            Architecture & Schemas
          </button>
          <button
            onClick={() => setActiveSection('traceability')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSection === 'traceability' ? 'bg-[#006b53] text-white shadow-xs' : 'text-[#525f75]'
            }`}
          >
            Compliance Matrix
          </button>
        </div>
      </div>

      {/* Section 1: Overview & Goals */}
      {activeSection === 'overview' && (
        <div className="space-y-6 text-sm text-[#3d4a44]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
              <span className="font-bold text-xs uppercase text-[#525f75] block">Target Patient Out-of-Pocket</span>
              <p className="font-headline-md text-2xl font-bold text-[#006c4a] mt-1">-85% to -90%</p>
              <p className="text-xs text-[#525f75] mt-1">Replacing brand name spreads with FDA AB-rated generics.</p>
            </div>
            <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
              <span className="font-bold text-xs uppercase text-[#525f75] block">Inter-Dispensary Latency</span>
              <p className="font-headline-md text-2xl font-bold text-[#0b1c30] mt-1">&lt; 2.0 Seconds</p>
              <p className="text-xs text-[#525f75] mt-1">Real-time Redis caching and price match query engine.</p>
            </div>
            <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
              <span className="font-bold text-xs uppercase text-[#525f75] block">Regulatory Rigor</span>
              <p className="font-headline-md text-2xl font-bold text-[#006b53] mt-1">FDA 21 CFR Part 11</p>
              <p className="text-xs text-[#525f75] mt-1">NCPDP SCRIPT 2017071 & state telehealth signature standards.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">1. Executive Problem Statement</h3>
            <p className="leading-relaxed">
              Patients across the United States continuously pay inflated brand-name prescription prices due to opaque Pharmacy Benefit Manager (PBM) formularies and pharmacy spread pricing. Although FDA Orange Book AB-rated generic equivalents possess identical bioavailability and clinical efficacy, retail point-of-sale friction and manual paper prescription workflows inhibit immediate patient savings. GeneticMedicine unifies multi-tenant hospital networks, licensed community dispensaries, and patient mobile applications into a single cryptographically secure clearinghouse.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">2. Stakeholder Personas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
                <p className="font-bold text-sm text-[#0b1c30]">Dr. Evelyn Vance, MD</p>
                <p className="text-[#006c4a] font-semibold">Chief Platform Admin</p>
                <p className="mt-1 text-[#525f75]">Oversees multi-tenant database partitions, settlement ledger streams, and regional compliance standards.</p>
              </div>
              <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
                <p className="font-bold text-sm text-[#0b1c30]">Marcus Vance, PharmD</p>
                <p className="text-[#006c4a] font-semibold">Supervising Dispensary Pharmacist</p>
                <p className="mt-1 text-[#525f75]">Maintains live wholesale price-matching, manages cleanroom cold-chain telemetry, and dispatches courier orders.</p>
              </div>
              <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
                <p className="font-bold text-sm text-[#0b1c30]">Robert Chen</p>
                <p className="text-[#006c4a] font-semibold">Chronic Care Patient (Cardiology)</p>
                <p className="mt-1 text-[#525f75]">Scans physical paper prescriptions with mobile camera, unlocks 90% generic price drops, and orders same-day courier.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Functional Scope */}
      {activeSection === 'requirements' && (
        <div className="space-y-4 text-xs text-[#3d4a44]">
          <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">Functional Requirements Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-[#e5eeff] rounded-xl overflow-hidden">
              <thead className="bg-[#eff4ff] text-[#525f75] font-bold">
                <tr>
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Module</th>
                  <th className="p-2.5">Requirement Statement</th>
                  <th className="p-2.5">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eff4ff]">
                <tr>
                  <td className="p-2.5 font-bold text-[#006b53]">FR-DISP-01</td>
                  <td className="p-2.5 font-semibold text-[#0b1c30]">Dispensary Console</td>
                  <td className="p-2.5">Terminal must provide real-time price match comparison against regional lowest generic rate and 1-click rate matching.</td>
                  <td className="p-2.5 text-[#006c4a] font-semibold">Verified Live</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-[#006b53]">FR-CLIN-02</td>
                  <td className="p-2.5 font-semibold text-[#0b1c30]">Doctor E-Rx Review</td>
                  <td className="p-2.5">Inspect tamper-resistant security prescription slips with zoom controls, review DDI/allergy check, and attest DAW-0 substitution.</td>
                  <td className="p-2.5 text-[#006c4a] font-semibold">Verified Live</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-[#006b53]">FR-PRICE-03</td>
                  <td className="p-2.5 font-semibold text-[#0b1c30]">Arbitrage Engine</td>
                  <td className="p-2.5">Algorithmic weighting calibration across price, ETA, dispensary quality, and platform margin with normalization.</td>
                  <td className="p-2.5 text-[#006c4a] font-semibold">Verified Live</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-[#006b53]">FR-SCAN-04</td>
                  <td className="p-2.5 font-semibold text-[#0b1c30]">Optical Scanner</td>
                  <td className="p-2.5">Mobile HUD viewfinder with laser scan line, auto-deskew detection, and 99.2% OCR extraction of drug, patient, and doctor info.</td>
                  <td className="p-2.5 text-[#006c4a] font-semibold">Verified Live</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-[#006b53]">FR-TENANT-05</td>
                  <td className="p-2.5 font-semibold text-[#0b1c30]">Multi-Tenant Ops</td>
                  <td className="p-2.5">PostgreSQL 16.2 separate schema partitions and live clearinghouse arbitrage settlement ledger with 5% platform fee accrual.</td>
                  <td className="p-2.5 text-[#006c4a] font-semibold">Verified Live</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 3: Architecture & Schemas */}
      {activeSection === 'architecture' && (
        <div className="space-y-4 text-xs text-[#3d4a44]">
          <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">Database Schema Partition Architecture</h3>
          <p className="leading-relaxed">
            The platform utilizes PostgreSQL 16.2 configured with separate schemas per healthcare tenant (e.g. <span className="font-mono bg-[#eff4ff] px-1 py-0.5 rounded">tenant_ny_presby</span>, <span className="font-mono bg-[#eff4ff] px-1 py-0.5 rounded">tenant_apollo_rx</span>, <span className="font-mono bg-[#eff4ff] px-1 py-0.5 rounded">tenant_cvs_direct</span>). This architecture eliminates cross-tenant data leakage while allowing global aggregate analytics for market price benchmarking through secure readonly replication views.
          </p>

          <div className="p-4 bg-[#eff4ff] rounded-xl font-mono text-[11px] text-[#0b1c30] space-y-1">
            <p className="text-[#006c4a] font-bold">-- PostgreSQL 16.2 Tenant Schema Blueprint</p>
            <p>CREATE SCHEMA tenant_ny_presby;</p>
            <p>CREATE TABLE tenant_ny_presby.prescriptions (</p>
            <p className="pl-4">id UUID PRIMARY KEY DEFAULT gen_random_uuid(),</p>
            <p className="pl-4">rx_number VARCHAR(32) UNIQUE NOT NULL,</p>
            <p className="pl-4">patient_id UUID NOT NULL,</p>
            <p className="pl-4">brand_drug_ndc VARCHAR(16) NOT NULL,</p>
            <p className="pl-4">generic_drug_ndc VARCHAR(16) NOT NULL,</p>
            <p className="pl-4">daw_code INT DEFAULT 0,</p>
            <p className="pl-4">monthly_savings NUMERIC(10,2),</p>
            <p className="pl-4">sha256_digital_seal VARCHAR(64) NOT NULL</p>
            <p>);</p>
          </div>
        </div>
      )}

      {/* Section 4: Compliance Matrix */}
      {activeSection === 'traceability' && (
        <div className="space-y-4 text-xs text-[#3d4a44]">
          <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">Regulatory & Telehealth Compliance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] space-y-1">
              <span className="font-bold text-[#006c4a]">HIPAA Security Rule & BAA Compliance</span>
              <p className="text-[#525f75]">All PHI (Protected Health Information) is encrypted at rest via AES-256 and in transit via TLS 1.3 with strict tenant token isolation.</p>
            </div>
            <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] space-y-1">
              <span className="font-bold text-[#006c4a]">FDA Orange Book Bioequivalence</span>
              <p className="text-[#525f75]">Only products holding therapeutic equivalence ratings of AB, AP, or AN can be mapped for automated pharmacy substitutions.</p>
            </div>
            <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] space-y-1">
              <span className="font-bold text-[#006c4a]">DEA Controlled Substance EPCS Ready</span>
              <p className="text-[#525f75]">Cryptographic identity proofing and dual-factor authorization tokens ready for federal e-prescribing standards.</p>
            </div>
            <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] space-y-1">
              <span className="font-bold text-[#006c4a]">NCPDP SCRIPT 2017071 Compliance</span>
              <p className="text-[#525f75]">Standardized electronic prescription messages between physician EHRs and retail pharmacy management systems.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
