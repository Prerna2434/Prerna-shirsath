import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { DEFAULT_USERS } from '../../data/mockData';

interface PatientAuthProps {
  onSuccess: (user: UserProfile) => void;
  onSwitchPortal?: (portal: 'doctor' | 'pharmacy') => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const PatientAuth: React.FC<PatientAuthProps> = ({
  onSuccess,
  onSwitchPortal,
  isModal,
  onClose
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useOtp, setUseOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Registration fields
  const [name, setName] = useState('');
  const [dob, setDob] = useState('1969-11-14');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('742 Mission St, Apt 4B, San Francisco, CA');
  const [zipCode, setZipCode] = useState('94107');
  const [insuranceChoice, setInsuranceChoice] = useState<'insured' | 'cash'>('insured');
  const [insuranceProvider, setInsuranceProvider] = useState('BlueShield California (RxBIN: 004336)');
  const [optInGenericAlerts, setOptInGenericAlerts] = useState(true);

  const handleDemoLogin = (user: UserProfile) => {
    onSuccess(user);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) {
      setAlertMsg('Please enter your mobile phone number or email.');
      return;
    }
    const loggedUser: UserProfile = {
      id: `pat-${Date.now()}`,
      name: phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'Robert Chen',
      email: phoneOrEmail.includes('@') ? phoneOrEmail : 'robert.chen@gmail.com',
      phone: !phoneOrEmail.includes('@') ? phoneOrEmail : '(415) 555-0192',
      role: 'patient',
      roleTitle: 'Verified Patient',
      address: `${address}, ${zipCode}`,
      insuranceProvider: insuranceProvider,
      avatar: DEFAULT_USERS.patient.avatar
    };
    onSuccess(loggedUser);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !zipCode) {
      setAlertMsg('Please fill out your name, email, and delivery zip code.');
      return;
    }
    const newUser: UserProfile = {
      id: `pat-new-${Date.now()}`,
      name,
      email,
      phone,
      role: 'patient',
      roleTitle: 'Registered Generic Medicine Patient',
      address: `${address}, ${zipCode}`,
      insuranceProvider: insuranceChoice === 'insured' ? insuranceProvider : 'Cash Pay Discount Tier',
      avatar: DEFAULT_USERS.patient.avatar
    };
    onSuccess(newUser);
  };

  return (
    <div className="bg-[#ffffff] rounded-3xl border border-[#e5eeff] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden max-w-md mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#006b53] to-[#004d3b] p-6 text-white relative">
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
            Patient Mobile App
          </span>
          <span className="text-xs text-white/70">Save Up to 90%</span>
        </div>
        <h2 className="font-headline-md text-2xl font-bold">
          {authMode === 'login' ? 'Patient Sign In' : 'Create Patient Account'}
        </h2>
        <p className="text-xs text-white/80 mt-1">
          {authMode === 'login'
            ? 'Track your generic prescriptions, 1-tap reorders, and courier delivery'
            : 'Join 412,000+ patients saving hundreds on wholesale generic medications'}
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center bg-black/20 p-1 rounded-xl mt-5 backdrop-blur-xs">
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
            Register Account
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* Quick Demo Logins */}
        <div className="p-3 bg-[#eff4ff] rounded-2xl border border-[#dce9ff] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#0b1c30] flex items-center gap-1">
              <span className="material-symbols-outlined text-[#006c4a] text-[16px]">touch_app</span>
              1-Tap Demo Patient Sign In
            </span>
            <span className="text-[10px] text-[#525f75]">Quick Test</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin(DEFAULT_USERS.patient)}
              className="p-2 bg-white hover:bg-[#f8f9ff] border border-[#dce9ff] rounded-xl text-left transition-all"
            >
              <p className="font-bold text-xs text-[#0b1c30]">Robert Chen</p>
              <p className="text-[10px] text-[#006c4a]">Saved $83.30/mo</p>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin({
                id: 'pat-sarah',
                name: 'Sarah Jenkins',
                email: 'sarah.jenkins@gmail.com',
                phone: '(415) 555-0382',
                role: 'patient',
                roleTitle: 'Verified Patient',
                address: '1200 Market St, San Francisco, CA 94102',
                insuranceProvider: 'Aetna Rx (RxBIN: 610502)',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
              })}
              className="p-2 bg-white hover:bg-[#f8f9ff] border border-[#dce9ff] rounded-xl text-left transition-all"
            >
              <p className="font-bold text-xs text-[#0b1c30]">Sarah Jenkins</p>
              <p className="text-[10px] text-[#006c4a]">Saved $42.10/mo</p>
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
          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">
                Mobile Number or Email Address:
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#525f75] text-[18px]">
                  smartphone
                </span>
                <input
                  type="text"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="(415) 555-0192 or robert@gmail.com"
                  className="w-full h-10 pl-9 pr-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>
            </div>

            {!useOtp ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#0b1c30]">Password:</label>
                  <button
                    type="button"
                    onClick={() => setUseOtp(true)}
                    className="text-[11px] text-[#006b53] font-semibold hover:underline"
                  >
                    Log in with SMS Code instead
                  </button>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#525f75] text-[18px]">
                    lock
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
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#0b1c30]">4-Digit SMS Code:</label>
                  <button
                    type="button"
                    onClick={() => setUseOtp(false)}
                    className="text-[11px] text-[#006b53] font-semibold hover:underline"
                  >
                    Use Password instead
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="e.g. 4821"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] tracking-widest font-mono text-center border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#006b53] hover:bg-[#00513e] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all mt-3"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Sign In & Open Prescriptions</span>
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">
                Full Legal Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Robert Chen"
                className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  Date of Birth:
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>

              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  Mobile Number:
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(415) 555-0192"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#0b1c30] block mb-1">
                Email Address:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="robert.chen@gmail.com"
                className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="font-bold text-[#0b1c30] block mb-1">
                  Delivery Address:
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street Address, Apt"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>
              <div>
                <label className="font-bold text-[#0b1c30] block mb-1">
                  Zip Code:
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="94107"
                  className="w-full h-10 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                />
              </div>
            </div>

            {/* Insurance Option */}
            <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff] space-y-2">
              <span className="font-bold text-[#0b1c30] block">Insurance / Payment Preference:</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="ins"
                    checked={insuranceChoice === 'insured'}
                    onChange={() => setInsuranceChoice('insured')}
                    className="accent-[#006b53]"
                  />
                  <span>I have insurance (RxBIN)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="ins"
                    checked={insuranceChoice === 'cash'}
                    onChange={() => setInsuranceChoice('cash')}
                    className="accent-[#006b53]"
                  />
                  <span>Cash / 90% Generic Pay</span>
                </label>
              </div>

              {insuranceChoice === 'insured' && (
                <input
                  type="text"
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                  placeholder="Insurance Provider & Member ID"
                  className="w-full h-8 px-2.5 bg-white rounded-lg text-xs border border-[#dce9ff] mt-1"
                />
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={optInGenericAlerts}
                onChange={(e) => setOptInGenericAlerts(e.target.checked)}
                className="accent-[#006b53]"
              />
              <span className="text-[#3d4a44]">
                Alert me whenever local pharmacies drop prices on my recurring prescriptions.
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3 bg-[#006b53] hover:bg-[#00513e] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all mt-3"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Create Account & Start Saving</span>
            </button>
          </form>
        )}

        {/* Footer Link */}
        {onSwitchPortal && (
          <div className="pt-3 border-t border-[#e5eeff] flex items-center justify-between text-[11px] text-[#525f75]">
            <span>Are you a clinician or pharmacy?</span>
            <button
              type="button"
              onClick={() => onSwitchPortal('doctor')}
              className="text-[#006b53] font-bold hover:underline"
            >
              Doctor / Pharmacy Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
