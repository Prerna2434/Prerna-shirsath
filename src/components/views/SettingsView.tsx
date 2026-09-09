import React, { useState } from 'react';
import { UserProfile } from '../../types';

interface SettingsViewProps {
  currentUser?: UserProfile | null;
}

const Toggle: React.FC<{ checked: boolean; onChange: () => void; label: string; sub?: string }> = ({
  checked,
  onChange,
  label,
  sub,
}) => (
  <div className="flex items-center justify-between py-3 border-b border-[#f0f4ff] last:border-0">
    <div>
      <p className="text-sm font-semibold text-[#0b1c30]">{label}</p>
      {sub && <p className="text-[11px] text-[#525f75] mt-0.5">{sub}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#006b53]/30 ${
        checked ? 'bg-[#006b53]' : 'bg-[#bcc7c1]'
      }`}
      style={{ width: 40, height: 22 }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-[18px]' : 'translate-x-0'
        }`}
        style={{ width: 18, height: 18 }}
      />
    </button>
  </div>
);

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser }) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [saved, setSaved] = useState(false);

  // Preferences
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    ddiAlerts: true,
    lowStockAlerts: true,
    darkMode: false,
    compactView: false,
    autoApproveGeneric: false,
  });

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const isDoctor = currentUser?.role === 'doctor' || currentUser?.role === 'admin';
  const isPharmacist = currentUser?.role === 'pharmacist';

  const roleColor: Record<string, string> = {
    admin: 'bg-[#006b53] text-white',
    doctor: 'bg-[#006c4a] text-white',
    pharmacist: 'bg-[#525f75] text-white',
    patient: 'bg-[#d6e3fe] text-[#0b1c30]',
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Toast */}
      {saved && (
        <div className="fixed top-20 right-6 z-50 bg-[#006b53] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#79f9d0]/30 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[20px] text-[#79f9d0]">check_circle</span>
          <span className="text-sm font-medium">Profile settings saved successfully.</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=006b53&color=fff'}
              alt={currentUser?.name || 'User'}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#006b53]/20 shadow-md"
            />
            <span
              className={`absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                roleColor[currentUser?.role || 'admin']
              }`}
            >
              {currentUser?.role || 'admin'}
            </span>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-[#0b1c30] truncate">{currentUser?.name || 'Platform User'}</h1>
            <p className="text-sm text-[#525f75] mt-0.5">{currentUser?.roleTitle || 'No title set'}</p>

            {currentUser?.licenseOrNpi && (
              <p className="text-[11px] text-[#006c4a] font-semibold mt-1 font-mono">{currentUser.licenseOrNpi}</p>
            )}
            {(currentUser?.tenantName || currentUser?.organization) && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="material-symbols-outlined text-[14px] text-[#525f75]">apartment</span>
                <span className="text-[12px] text-[#525f75]">
                  {currentUser?.tenantName || currentUser?.organization}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <h2 className="text-sm font-bold text-[#0b1c30] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#006b53]">edit</span>
          Edit Profile
        </h2>
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525f75] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#e5eeff] rounded-xl text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#00a884]/40 focus:border-[#00a884] transition-all"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525f75] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#e5eeff] rounded-xl text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#00a884]/40 focus:border-[#00a884] transition-all"
              placeholder="you@organization.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525f75] mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full h-10 px-3 bg-[#f8f9ff] border border-[#e5eeff] rounded-xl text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#00a884]/40 focus:border-[#00a884] transition-all"
              placeholder="(XXX) XXX-XXXX"
            />
          </div>

          {/* Doctor/pharmacist-only fields */}
          {(isDoctor || isPharmacist) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525f75] mb-1.5">
                  NPI / License No.
                </label>
                <input
                  type="text"
                  defaultValue={currentUser?.licenseOrNpi || ''}
                  readOnly
                  className="w-full h-10 px-3 bg-[#eff4ff] border border-[#e5eeff] rounded-xl text-sm text-[#525f75] font-mono cursor-not-allowed"
                  title="License number is managed by your administrator"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#525f75] mb-1.5">
                  Organization
                </label>
                <input
                  type="text"
                  defaultValue={currentUser?.tenantName || currentUser?.organization || ''}
                  readOnly
                  className="w-full h-10 px-3 bg-[#eff4ff] border border-[#e5eeff] rounded-xl text-sm text-[#525f75] cursor-not-allowed"
                  title="Organization is managed by your administrator"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-[#006b53] hover:bg-[#00513e] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <h2 className="text-sm font-bold text-[#0b1c30] mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#006b53]">tune</span>
          Notifications &amp; Preferences
        </h2>
        <p className="text-[11px] text-[#525f75] mb-4">Customize your platform experience and alert settings.</p>

        <Toggle
          checked={prefs.emailNotifications}
          onChange={() => togglePref('emailNotifications')}
          label="Email Notifications"
          sub="Receive daily digests and important alerts"
        />
        <Toggle
          checked={prefs.ddiAlerts}
          onChange={() => togglePref('ddiAlerts')}
          label="DDI Alert Notifications"
          sub="Drug-drug interaction warnings in the prescription queue"
        />
        <Toggle
          checked={prefs.lowStockAlerts}
          onChange={() => togglePref('lowStockAlerts')}
          label="Low Stock Alerts"
          sub="Get notified when dispensary items fall below threshold"
        />
        <Toggle
          checked={prefs.compactView}
          onChange={() => togglePref('compactView')}
          label="Compact View Mode"
          sub="Reduce row height in tables for higher data density"
        />
        {isDoctor && (
          <Toggle
            checked={prefs.autoApproveGeneric}
            onChange={() => togglePref('autoApproveGeneric')}
            label="Auto-Approve Generic Substitution"
            sub="Automatically approve AB-rated generics unless DDI flagged"
          />
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#ffdad6] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <h2 className="text-sm font-bold text-[#ba1a1a] mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          Danger Zone
        </h2>
        <p className="text-[11px] text-[#525f75] mb-4">These actions are irreversible. Proceed with caution.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="px-4 py-2 border border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-xl text-sm font-bold transition-colors"
            onClick={() => alert('This action would be confirmed via a secure 2FA prompt in production.')}
          >
            Reset API Credentials
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-[#ffdad6] text-[#93000a] hover:bg-[#ba1a1a]/20 rounded-xl text-sm font-bold transition-colors"
            onClick={() => alert('Account deletion requires administrator approval in production.')}
          >
            Request Account Deletion
          </button>
        </div>
      </div>
    </div>
  );
};
