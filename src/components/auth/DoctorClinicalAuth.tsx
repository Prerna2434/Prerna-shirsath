import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { DEFAULT_USERS } from '../../data/mockData';

interface DoctorClinicalAuthProps {
  onSuccess: (user: UserProfile) => void;
  onSwitchPortal?: (portal: 'patient' | 'pharmacy') => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const DoctorClinicalAuth: React.FC<DoctorClinicalAuthProps> = ({
  onSuccess,
  onSwitchPortal,
  isModal,
  onClose
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenant, setTenant] = useState('Metro Health Network (tenant_082)');
  const [mfaCode, setMfaCode] = useState('');

  // Register fields
  const [fullName, setFullName] = useState('');
  const [npiNumber, setNpiNumber] = useState('');
  const [deaNumber, setDeaNumber] = useState('');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [stateLicense, setStateLicense] = useState('');
  const [epcsConsent, setEpcsConsent] = useState(true);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const handleDemoLogin = (profile: UserProfile) => {
    onSuccess(profile);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAlertMsg('Please provide your institutional email and credentials.');
      return;
    }
    // Successful login simulation
    const loggedInUser: UserProfile = {
      id: `doc-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
      email: email,
      role: 'doctor',
      roleTitle: 'Attending Physician',
      tenantId: 'tenant_082',
      tenantName: tenant,
      licenseOrNpi: 'NPI: 1948201944 • Verified Active',
      avatar: DEFAULT_USERS.admin.avatar
    };
    onSuccess(loggedInUser);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !npiNumber || !stateLicense) {
      setAlertMsg('Please complete all required clinical credential fields.');
      return;
    }
    if (!epcsConsent) {
      setAlertMsg('You must agree to EPCS digital identity and state telehealth certification.');
      return;
    }

    const newUser: UserProfile = {
      id: `doc-new-${Date.now()}`,
      name: fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}, MD`,
      email,
      role: 'doctor',
      roleTitle: `${specialty} Specialist`,
      tenantId: 'tenant_082',
      tenantName: tenant,
      licenseOrNpi: `NPI: ${npiNumber} • Lic: ${stateLicense}`,
      avatar: DEFAULT_USERS.admin.avatar
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
            Clinical Prescriber & Admin Portal
          </span>
          <span className="text-xs text-white/70">NCPDP SCRIPT 2017071</span>
        </div>
        <h2 className="font-headline-md text-2xl font-bold">
          {authMode === 'login' ? 'Clinician Secure Sign In' : 'Register Prescriber Account'}
        </h2>
        <p className="text-xs text-white/80 mt-1">
          {authMode === 'login'
            ? 'Access FHIR R4 e-prescriptions, clinical reviews, and formulary substitution engine'
            : 'Enroll with DEA / NPI credentials to issue cryptographically signed generic substitutions'}
        </p>

        {/* Toggle Login / Register */}
        <div className="flex items-center bg-black/20 p-1 rounded-xl mt-5 max-w-xs backdrop-blur-xs">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setAlertMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              authMode === 'login' ? 'bg-white text-[#006b53] shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setAlertMsg(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              authMode === 'register' ? 'bg-white text-[#006b53] shadow-xs' : 'text-white/80 hover:text-white'
            }`}
          >
            New Registration
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Quick 1-Click Demo Clinician Login */}
        <div className="p-3.5 bg-[#eff4ff] rounded-2xl border border-[#dce9ff] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#0b1c30] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006c4a] text-[18px]">verified_user</span>
              1-Tap Demo Clinical Sign In
            </span>
            <span className="text-[11px] text-[#525f75]">Instant verification</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin(DEFAULT_USERS.admin)}
              className="p-2.5 bg-white hover:bg-[#f8f9ff] border border-[#dce9ff] rounded-xl text-left transition-all group"
            >
              <p className="font-bold text-xs text-[#0b1c30] group-hover:text-[#006b53]">
                Dr. Evelyn Vance, MD
              </p>
              <p className="text-[11px] text-[#525f75]">Chief Platform Admin</p>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin({
                ...DEFAULT_USERS.admin,
                id: 'doc-thorne',
                name: 'Dr. Marcus Thorne, MD',
                roleTitle: 'Chief of Cardiology (Sutter Health)',
                licenseOrNpi: 'NPI: 1043928110 • DEA: BT9842104'
              })}
              className="p-2.5 bg-white hover:bg-[#f8f9ff] border border-[#dce9ff] rounded-xl text-left transition-all group"
            >
              <p className="font-bold text-xs text-[#0b1c30] group-hover:text-[#006b53]">
                Dr. Marcus Thorne, MD
              </p>
              <p className="text-[11px] text-[#525f75]">Cardiology Prescriber</p>
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
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">
                Institutional Healthcare Organization / Tenant:
              </label>
              <select
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
                className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
              >
                <option value="Metro Health Network (tenant_082)">Metro Health Network (tenant_082)</option>
                <option value="NewYork-Presbyterian (tenant_ny_presby)">NewYork-Presbyterian (tenant_ny_presby)</option>
                <option value="Sutter Health Specialty (tenant_sutter)">Sutter Health Specialty (tenant_sutter)</option>
                <option value="Apollo Retail Consortium (tenant_apollo_rx)">Apollo Retail Consortium (tenant_apollo_rx)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">
                Work Email / Provider ID:
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#525f75] text-[18px]">
                  badge
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. evelyn.vance@metrohealth.org"
                  className="w-full h-10 pl-9 pr-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">
                Prescriber Password / SSO Key:
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

            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">
                MFA Authenticator Token (Optional):
              </label>
              <input
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="e.g. 840 291"
                className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#006b53] hover:bg-[#00513e] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
              <span>Authenticate & Open Clinical Portal</span>
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  Full Name & Title:
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Emily Watson, MD"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  Primary Medical Specialty:
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Family Medicine">Family Medicine</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Psychiatry">Psychiatry</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  NPI Number (10-Digit):
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={npiNumber}
                  onChange={(e) => setNpiNumber(e.target.value)}
                  placeholder="e.g. 1948201944"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  DEA Registration #:
                </label>
                <input
                  type="text"
                  value={deaNumber}
                  onChange={(e) => setDeaNumber(e.target.value)}
                  placeholder="e.g. BW4418291"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  State Medical License #:
                </label>
                <input
                  type="text"
                  value={stateLicense}
                  onChange={(e) => setStateLicense(e.target.value)}
                  placeholder="e.g. CA-Lic #A98210"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  Institutional Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. dr.watson@stjudehealth.org"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>
            </div>

            <div className="p-3 bg-[#eff4ff] rounded-xl text-xs text-[#3d4a44] space-y-2 border border-[#dce9ff]">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={epcsConsent}
                  onChange={(e) => setEpcsConsent(e.target.checked)}
                  className="mt-0.5 accent-[#006b53]"
                />
                <span>
                  I attest under penalty of law that I am an authorized prescriber and agree to the <strong>DEA EPCS Dual-Factor Cryptographic E-Prescribing Agreement</strong>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#006b53] hover:bg-[#00513e] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              <span>Register & Provision Clinical Account</span>
            </button>
          </form>
        )}

        {/* Portal Switcher Footer */}
        {onSwitchPortal && (
          <div className="pt-4 border-t border-[#e5eeff] flex items-center justify-between text-xs text-[#525f75]">
            <span>Are you a patient or retail pharmacy?</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onSwitchPortal('patient')}
                className="text-[#006b53] font-bold hover:underline"
              >
                Patient Sign In
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => onSwitchPortal('pharmacy')}
                className="text-[#006b53] font-bold hover:underline"
              >
                Pharmacy Hub
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
