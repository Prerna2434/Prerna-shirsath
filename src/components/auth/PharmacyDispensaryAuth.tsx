import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { DEFAULT_USERS } from '../../data/mockData';

interface PharmacyDispensaryAuthProps {
  onSuccess: (user: UserProfile) => void;
  onSwitchPortal?: (portal: 'doctor' | 'patient') => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const PharmacyDispensaryAuth: React.FC<PharmacyDispensaryAuthProps> = ({
  onSuccess,
  onSwitchPortal,
  isModal,
  onClose
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [nabpOrEmail, setNabpOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('CareFirst Pharmacy Hub #402 (San Francisco)');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Registration state
  const [pharmacyName, setPharmacyName] = useState('');
  const [dbaName, setDbaName] = useState('');
  const [ncpdpNumber, setNcpdpNumber] = useState('');
  const [deaReg, setDeaReg] = useState('');
  const [stateBoardLic, setStateBoardLic] = useState('');
  const [picName, setPicName] = useState('');
  const [picLicense, setPicLicense] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [courierRadius, setCourierRadius] = useState('5 Miles (Same-Day 45min SLA)');
  const [wholesaleClearinghouseConsent, setWholesaleClearinghouseConsent] = useState(true);

  const handleDemoLogin = (profile: UserProfile) => {
    onSuccess(profile);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nabpOrEmail || !password) {
      setAlertMsg('Please input your Store NCPDP/Email and Terminal Password.');
      return;
    }
    const loggedInUser: UserProfile = {
      id: `rx-${Date.now()}`,
      name: 'Supervising Pharmacist',
      email: nabpOrEmail.includes('@') ? nabpOrEmail : `${nabpOrEmail}@dispensarynetwork.org`,
      role: 'pharmacist',
      roleTitle: 'Supervising Dispensary Pharmacist',
      tenantId: 'tenant_carefirst_402',
      tenantName: selectedBranch,
      licenseOrNpi: 'NCPDP: 0548192 • RPh Lic: #PH-88912',
      avatar: DEFAULT_USERS.pharmacist.avatar
    };
    onSuccess(loggedInUser);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pharmacyName || !ncpdpNumber || !stateBoardLic || !picName) {
      setAlertMsg('Please complete all regulatory pharmacy accreditation fields.');
      return;
    }
    if (!wholesaleClearinghouseConsent) {
      setAlertMsg('You must agree to the Wholesale Generic Clearinghouse and Telehealth Network Terms.');
      return;
    }

    const newUser: UserProfile = {
      id: `rx-new-${Date.now()}`,
      name: `${picName}, PharmD`,
      email: `${ncpdpNumber.toLowerCase()}@dispensaryhub.com`,
      role: 'pharmacist',
      roleTitle: `Pharmacist-in-Charge (${pharmacyName})`,
      tenantId: `tenant_${ncpdpNumber.toLowerCase()}`,
      tenantName: pharmacyName,
      licenseOrNpi: `NCPDP: ${ncpdpNumber} • Lic: ${stateBoardLic}`,
      avatar: DEFAULT_USERS.pharmacist.avatar
    };
    onSuccess(newUser);
  };

  return (
    <div className="bg-[#ffffff] rounded-3xl border border-[#e5eeff] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden max-w-xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#006b53] to-[#004d3b] p-6 text-white relative">
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-md bg-[#79f9d0]/30 text-[#79f9d0] font-label-sm text-[11px] font-bold uppercase tracking-wider">
            Licensed Pharmacy Partner Portal
          </span>
          <span className="text-xs text-white/70">Store Terminal Access</span>
        </div>
        <h2 className="font-headline-md text-2xl font-bold">
          {authMode === 'login' ? 'Dispensary Terminal Sign In' : 'Enroll Pharmacy Store Partner'}
        </h2>
        <p className="text-xs text-white/80 mt-1">
          {authMode === 'login'
            ? 'Access automated formulary pricing, cleanroom vault telemetry, and courier dispatch'
            : 'Join the wholesale generic arbitrage clearinghouse and fulfill local e-prescriptions'}
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center bg-black/20 p-1 rounded-xl mt-5 max-w-xs backdrop-blur-xs">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setAlertMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              authMode === 'login' ? 'bg-white text-[#006b53] shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Store Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setAlertMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              authMode === 'register' ? 'bg-white text-[#006b53] shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Register Store
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Quick Demo Pharmacist Logins */}
        <div className="p-3.5 bg-[#eff4ff] rounded-2xl border border-[#dce9ff] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#0b1c30] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006c4a] text-[18px]">local_pharmacy</span>
              1-Tap Demo Dispensary Sign In
            </span>
            <span className="text-[11px] text-[#525f75]">Verified NABP Partner</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin(DEFAULT_USERS.pharmacist)}
              className="p-2.5 bg-white hover:bg-[#f8f9ff] border border-[#dce9ff] rounded-xl text-left transition-all group"
            >
              <p className="font-bold text-xs text-[#0b1c30] group-hover:text-[#006b53]">
                Marcus Vance, PharmD
              </p>
              <p className="text-[11px] text-[#525f75]">CareFirst Hub #402 (PIC)</p>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin({
                id: 'rx-metro-hub',
                name: 'Metro Health Central Rx',
                email: 'dispensary@metrocentralrx.org',
                role: 'pharmacist',
                roleTitle: 'Automated Dispensary Console',
                tenantId: 'tenant_ny_presby',
                tenantName: 'Metro Health Central Dispensary',
                licenseOrNpi: 'NCPDP: 0581920 • DEA: BC4820193',
                avatar: DEFAULT_USERS.pharmacist.avatar
              })}
              className="p-2.5 bg-white hover:bg-[#f8f9ff] border border-[#dce9ff] rounded-xl text-left transition-all group"
            >
              <p className="font-bold text-xs text-[#0b1c30] group-hover:text-[#006b53]">
                Metro Health Central Rx
              </p>
              <p className="text-[11px] text-[#525f75]">Cleanroom Vault Lead</p>
            </button>
          </div>
        </div>

        {alertMsg && (
          <div className="p-3 bg-[#ffdad6] text-[#93000a] text-xs rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span>{alertMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {authMode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">
                Active Store Branch / Dispensary Terminal:
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
              >
                <option value="CareFirst Pharmacy Hub #402 (San Francisco)">
                  CareFirst Pharmacy Hub #402 (San Francisco)
                </option>
                <option value="Metro Health Central Dispensary (SOMA)">
                  Metro Health Central Dispensary (SOMA)
                </option>
                <option value="Community Health Rx (Mission District)">
                  Community Health Rx (Mission District)
                </option>
                <option value="Sunset District Apothecary & Vault">
                  Sunset District Apothecary & Vault
                </option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">
                Store NCPDP / NABP Number or Registered Work Email:
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#525f75] text-[18px]">
                  store
                </span>
                <input
                  type="text"
                  value={nabpOrEmail}
                  onChange={(e) => setNabpOrEmail(e.target.value)}
                  placeholder="e.g. 0548192 or m.vance@carefirstrx.com"
                  className="w-full h-10 pl-9 pr-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">
                Dispensary Terminal Access Key / Password:
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#525f75] text-[18px]">
                  key
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-10 pl-9 pr-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#006b53] hover:bg-[#00513e] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span className="material-symbols-outlined text-[18px]">domain_verification</span>
              <span>Sign In & Open Dispensary Matrix</span>
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  Legal Pharmacy Entity Name:
                </label>
                <input
                  type="text"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  placeholder="e.g. Pacific Coast Care Pharmacy Inc."
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  Doing Business As (DBA) / Store Brand:
                </label>
                <input
                  type="text"
                  value={dbaName}
                  onChange={(e) => setDbaName(e.target.value)}
                  placeholder="e.g. CareFirst Hub"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  NCPDP / NABP #:
                </label>
                <input
                  type="text"
                  value={ncpdpNumber}
                  onChange={(e) => setNcpdpNumber(e.target.value)}
                  placeholder="e.g. 0548192"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  State Board License #:
                </label>
                <input
                  type="text"
                  value={stateBoardLic}
                  onChange={(e) => setStateBoardLic(e.target.value)}
                  placeholder="e.g. CA-PHY-9921"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  DEA Registration #:
                </label>
                <input
                  type="text"
                  value={deaReg}
                  onChange={(e) => setDeaReg(e.target.value)}
                  placeholder="e.g. BC9920149"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  Supervising Pharmacist (PIC) Name:
                </label>
                <input
                  type="text"
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  placeholder="e.g. Marcus Vance, PharmD"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  PIC RPh License #:
                </label>
                <input
                  type="text"
                  value={picLicense}
                  onChange={(e) => setPicLicense(e.target.value)}
                  placeholder="e.g. RPH-88912"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="font-bold text-[#0b1c30] block mb-1">
                  Store Physical Address:
                </label>
                <input
                  type="text"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  placeholder="1400 Folsom St, San Francisco, CA 94103"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  Courier Delivery SLA:
                </label>
                <select
                  value={courierRadius}
                  onChange={(e) => setCourierRadius(e.target.value)}
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                >
                  <option value="3 Miles (Express 30min SLA)">3 Miles (Express 30min SLA)</option>
                  <option value="5 Miles (Same-Day 45min SLA)">5 Miles (Same-Day 45min SLA)</option>
                  <option value="15 Miles (Evening Batch Courier)">15 Miles (Evening Batch Courier)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-[#eff4ff] rounded-xl text-xs text-[#3d4a44] space-y-2 border border-[#dce9ff]">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wholesaleClearinghouseConsent}
                  onChange={(e) => setWholesaleClearinghouseConsent(e.target.checked)}
                  className="mt-0.5 accent-[#006b53]"
                />
                <span>
                  Our dispensary certifies storage in an <strong>FDA 21 CFR cold-chain compliant facility</strong> and agrees to honor automatic rate-matched pricing for network generic substitutions.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#006b53] hover:bg-[#00513e] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Register Dispensary Branch & Receive API Keys</span>
            </button>
          </form>
        )}

        {/* Portal Switcher Footer */}
        {onSwitchPortal && (
          <div className="pt-4 border-t border-[#e5eeff] flex items-center justify-between text-xs text-[#525f75]">
            <span>Are you a prescriber or consumer patient?</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onSwitchPortal('doctor')}
                className="text-[#006b53] font-bold hover:underline"
              >
                Doctor Portal
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => onSwitchPortal('patient')}
                className="text-[#006b53] font-bold hover:underline"
              >
                Patient Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
