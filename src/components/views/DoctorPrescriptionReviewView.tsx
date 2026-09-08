import React, { useState } from 'react';
import { PRESCRIPTION_CASES } from '../../data/mockData';
import { PrescriptionCase } from '../../types';

export const DoctorPrescriptionReviewView: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(PRESCRIPTION_CASES[0].id);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [confirmedCheckboxes, setConfirmedCheckboxes] = useState({
    equivalence: true,
    patientInformed: true
  });
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [approvalStatus, setApprovalStatus] = useState<Record<string, 'approved' | 'brand_locked' | 'rejected'>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedCase = PRESCRIPTION_CASES.find(c => c.id === selectedCaseId) || PRESCRIPTION_CASES[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApproveGeneric = () => {
    setApprovalStatus(prev => ({ ...prev, [selectedCase.id]: 'approved' }));
    showToast(`Prescription ${selectedCase.rxNumber} approved for Generic Substitution. Saved patient $${selectedCase.monthlySavings.toFixed(2)}/mo.`);
  };

  const handleMaintainBrand = () => {
    setApprovalStatus(prev => ({ ...prev, [selectedCase.id]: 'brand_locked' }));
    showToast(`DAW-1 Dispense As Written locked for ${selectedCase.brandDrug}. Routed to Brand fulfillment.`);
  };

  const handleReject = () => {
    setApprovalStatus(prev => ({ ...prev, [selectedCase.id]: 'rejected' }));
    showToast(`Prescription ${selectedCase.rxNumber} flagged for Physician Clinical Callback.`);
  };

  const filteredCases = PRESCRIPTION_CASES.filter(c => {
    if (filterPriority === 'ALL') return true;
    if (filterPriority === 'STAT') return c.priority === 'STAT';
    if (filterPriority === 'ROUTINE') return c.priority === 'Routine';
    if (filterPriority === 'DDI') return c.priority === 'DDI Alert';
    if (filterPriority === 'REFILLS') return c.priority === 'Refill';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#006b53] text-[#ffffff] px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#79f9d0]/30 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[20px] text-[#79f9d0]">check_circle</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md bg-[#006b53] text-[#ffffff] font-label-sm text-[11px] font-bold uppercase tracking-wider">
              FHIR R4 Inbound E-Prescription Queue
            </span>
            <span className="font-code-num text-xs text-[#525f75]">
              HL7 v2.8 / NCPDP SCRIPT 2017071 Compliant
            </span>
          </div>
          <h1 className="font-headline-md text-xl sm:text-2xl font-bold text-[#0b1c30]">
            Doctor Clinical Review & E-Prescription Validation
          </h1>
          <p className="font-body-sm text-xs sm:text-sm text-[#525f75]">
            Authorized Prescriber Portal • Automated Generic Equivalence & Drug-Drug Interaction (DDI) Clearance
          </p>
        </div>

        <div className="flex items-center gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#e5eeff]">
          <div className="text-right">
            <p className="font-label-md text-xs font-bold text-[#0b1c30]">
              Queue Status: 14 Inbound Today
            </p>
            <p className="font-label-sm text-[11px] text-[#006c4a] font-medium">
              88.7% Substitution Rate • 0 DDI Conflicts
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center text-[#006b53] border border-[#dce9ff]">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Inbound Queue List (3 cols) */}
        <div className="lg:col-span-3 bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
            <h3 className="font-headline-sm text-sm font-bold text-[#0b1c30]">
              Inbound Queue ({filteredCases.length})
            </h3>
            <span className="font-code-num text-[11px] text-[#525f75]">Live Feed</span>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1">
            {['ALL', 'STAT', 'ROUTINE', 'DDI', 'REFILLS'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterPriority(f)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  filterPriority === f
                    ? 'bg-[#006b53] text-[#ffffff]'
                    : 'bg-[#eff4ff] text-[#525f75] hover:bg-[#e5eeff]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Prescriptions List */}
          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredCases.map((c) => {
              const isSelected = c.id === selectedCase.id;
              const status = approvalStatus[c.id];
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#eff4ff] border-[#00a884] ring-1 ring-[#00a884]'
                      : 'bg-[#ffffff] border-[#e5eeff] hover:bg-[#f8f9ff]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#0b1c30]">{c.patientName}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      c.priority === 'STAT'
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : c.priority === 'DDI Alert'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-[#d6e3fe] text-[#0e1c2f]'
                    }`}>
                      {c.priority}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#525f75] truncate">{c.brandDrug}</p>
                  <p className="text-[10px] text-[#006c4a] font-semibold truncate">
                    Sub: {c.genericDrug}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[#525f75] mt-2 pt-1 border-t border-[#e5eeff]">
                    <span>{c.queuedTime}</span>
                    <span className="font-bold text-[#006c4a]">
                      Save ${c.monthlySavings.toFixed(0)}/mo
                    </span>
                  </div>

                  {status && (
                    <div className="mt-1.5 text-[10px] font-bold text-center py-0.5 rounded bg-[#006c4a]/10 text-[#006c4a]">
                      {status === 'approved' ? '✓ Generic Approved' : status === 'brand_locked' ? 'Brand Locked' : 'Rejected'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Tamper-Resistant Security Form Document Viewer (5 cols) */}
        <div className="lg:col-span-5 bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006b53] text-[20px]">
                security
              </span>
              <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
                E-Prescription Document
              </h3>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-lg border border-[#dce9ff]">
              <button
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                className="p-1 hover:bg-[#ffffff] rounded text-[#525f75]"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[16px]">zoom_out</span>
              </button>
              <span className="text-xs font-semibold px-1 text-[#0b1c30]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(130, prev + 10))}
                className="p-1 hover:bg-[#ffffff] rounded text-[#525f75]"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[16px]">zoom_in</span>
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1 hover:bg-[#ffffff] rounded text-[#525f75]"
                title="Reset Zoom"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              </button>
            </div>
          </div>

          {/* Tamper Resistant Prescription Security Slip Container */}
          <div
            className="border-2 border-[#bccac2] rounded-xl p-5 bg-[#fafcf9] space-y-4 shadow-sm transition-transform origin-top"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* Top Microprint Header */}
            <div className="border-b border-[#bccac2] pb-3 text-center space-y-0.5">
              <div className="text-[9px] uppercase tracking-widest text-[#525f75] font-bold">
                ★ TAMPER-RESISTANT CALIFORNIA OFFICIAL PRESCRIPTION FORM ★
              </div>
              <h4 className="font-bold text-sm text-[#0b1c30] uppercase tracking-wide">
                {selectedCase.clinicName}
              </h4>
              <p className="text-[11px] text-[#525f75]">{selectedCase.clinicAddress}</p>
              <p className="text-[10px] text-[#525f75]">
                {selectedCase.prescriberName} • NPI: {selectedCase.prescriberNpi} • DEA: {selectedCase.prescriberDea}
              </p>
            </div>

            {/* Patient Header Box */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-[#ffffff] p-3 rounded-lg border border-[#e5eeff]">
              <div>
                <span className="text-[#525f75] text-[10px] block">PATIENT NAME & DOB:</span>
                <span className="font-bold text-[#0b1c30]">{selectedCase.patientName}</span>
                <span className="text-[11px] text-[#525f75] block">
                  DOB: {selectedCase.dob} ({selectedCase.patientAge}y / {selectedCase.patientGender})
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#525f75] text-[10px] block">MRN & ENCOUNTER:</span>
                <span className="font-code-num font-bold text-[#0b1c30]">MRN #{selectedCase.mrn}</span>
                <span className="text-[11px] text-[#525f75] block">{selectedCase.encounterId}</span>
              </div>
            </div>

            {/* Rx Medication Details */}
            <div className="bg-[#ffffff] p-4 rounded-lg border border-[#006b53]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-[#006b53]">℞</span>
                <span className="text-[10px] font-bold text-[#525f75] bg-[#eff4ff] px-2 py-0.5 rounded">
                  {selectedCase.rxNumber}
                </span>
              </div>
              <div>
                <h5 className="font-bold text-sm text-[#0b1c30]">{selectedCase.brandDrug}</h5>
                <p className="text-xs text-[#3d4a44] font-medium">{selectedCase.brandDosage}</p>
              </div>
              <div className="p-2 bg-[#eff4ff] rounded text-xs space-y-1">
                <p><span className="font-bold text-[#0b1c30]">SIG:</span> {selectedCase.sig}</p>
                <p><span className="font-bold text-[#0b1c30]">Quantity:</span> {selectedCase.quantity} • <span className="font-bold text-[#0b1c30]">Refills:</span> {selectedCase.refills}</p>
                <p><span className="font-bold text-[#0b1c30]">ICD-10:</span> {selectedCase.icd10}</p>
              </div>
            </div>

            {/* DAW Box and Digital Signature */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 bg-[#ffffff] rounded border border-[#e5eeff]">
                <span className="text-[10px] font-bold text-[#525f75] block">DISPENSE AS WRITTEN:</span>
                <span className="font-bold text-[#006c4a] flex items-center gap-1 text-xs mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">check_box</span>
                  DAW-0 (Generic Allowed)
                </span>
              </div>
              <div className="p-2.5 bg-[#ffffff] rounded border border-[#e5eeff] text-right">
                <span className="text-[10px] font-bold text-[#525f75] block">DIGITAL SIGNATURE:</span>
                <span className="text-[10px] text-[#006b53] font-semibold block truncate">
                  SHA-256: 8f92..b401
                </span>
                <span className="text-[9px] text-[#525f75]">Verified Telehealth OK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Clinical Review & Generic Approval Engine (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Patient Safety & Interactions */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006c4a]">health_and_safety</span>
                Patient Safety & DDI Check
              </h3>
              <span className="px-2 py-0.5 rounded bg-[#006c4a]/10 text-[#006c4a] font-bold text-[11px]">
                Passed
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#eff4ff] rounded-lg">
                <span className="font-bold text-[#0b1c30] block">Allergy Profile:</span>
                <p className="text-[#3d4a44]">{selectedCase.drugInteractions.allergyDetails}</p>
              </div>
              <div className="p-2.5 bg-[#eff4ff] rounded-lg">
                <span className="font-bold text-[#0b1c30] block">Active Co-Medications:</span>
                <p className="text-[#3d4a44]">{selectedCase.drugInteractions.activeCoMeds}</p>
                <p className="text-[11px] text-[#525f75] mt-1">{selectedCase.drugInteractions.coMedsDetails}</p>
              </div>
            </div>
          </div>

          {/* Generic Equivalence Savings Card */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-sm font-bold text-[#0b1c30]">
                Generic Equivalence Economics
              </h3>
              <span className="px-2 py-0.5 rounded bg-[#79f9d0]/30 text-[#00513e] font-bold text-[11px]">
                {selectedCase.genericEquivRating}
              </span>
            </div>

            <div className="p-3 bg-[#eff4ff] rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#525f75]">Brand Reference:</span>
                <span className="font-bold text-[#0b1c30]">{selectedCase.brandDrug} (${selectedCase.brandPrice.toFixed(2)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#006c4a] font-semibold">Generic Substitute:</span>
                <span className="font-bold text-[#006c4a]">{selectedCase.genericDrug} (${selectedCase.genericPrice.toFixed(2)})</span>
              </div>
              <div className="pt-2 border-t border-[#dce9ff] flex justify-between items-center">
                <span className="font-bold text-[#0b1c30]">Patient Monthly Savings:</span>
                <span className="font-headline-sm text-base font-bold text-[#006c4a]">
                  +${selectedCase.monthlySavings.toFixed(2)} / mo
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#525f75]">
              Manufacturer: {selectedCase.genericManufacturer} • NDC: {selectedCase.genericNdc}
            </p>
          </div>

          {/* Attestation & Approval Actions */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-5 space-y-4">
            <h4 className="font-label-md text-xs font-bold text-[#0b1c30] uppercase tracking-wider">
              Clinical Attestation & Routing
            </h4>

            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedCheckboxes.equivalence}
                  onChange={(e) => setConfirmedCheckboxes({ ...confirmedCheckboxes, equivalence: e.target.checked })}
                  className="mt-0.5 accent-[#006b53]"
                />
                <span className="text-[#3d4a44]">
                  I certify FDA therapeutic bioequivalence and confirm no DAW-1 brand override is clinically required.
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedCheckboxes.patientInformed}
                  onChange={(e) => setConfirmedCheckboxes({ ...confirmedCheckboxes, patientInformed: e.target.checked })}
                  className="mt-0.5 accent-[#006b53]"
                />
                <span className="text-[#3d4a44]">
                  Patient informed of generic availability and agreed to price-match substitution.
                </span>
              </label>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleApproveGeneric}
                disabled={!confirmedCheckboxes.equivalence}
                className="w-full py-2.5 px-4 bg-[#006b53] hover:bg-[#00513e] disabled:opacity-50 text-[#ffffff] rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Approve Generic Substitution (${selectedCase.genericPrice.toFixed(2)})
              </button>

              <button
                onClick={handleMaintainBrand}
                className="w-full py-2 px-4 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#525f75] rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                Maintain Brand-Name (DAW-1 Medical Necessity)
              </button>

              <button
                onClick={handleReject}
                className="w-full py-1.5 px-4 text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
                Reject / Request Physician Callback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
