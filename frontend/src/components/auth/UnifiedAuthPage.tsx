import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { DoctorClinicalAuth } from './DoctorClinicalAuth';
import { PatientAuth } from './PatientAuth';
import { PharmacyDispensaryAuth } from './PharmacyDispensaryAuth';

interface UnifiedAuthPageProps {
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onNavigateToPortal: (mode: 'enterprise' | 'mobile') => void;
  initialTab?: 'doctor' | 'patient' | 'pharmacy';
}

export const UnifiedAuthPage: React.FC<UnifiedAuthPageProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  onNavigateToPortal,
  initialTab = 'doctor'
}) => {
  const [activePortalTab, setActivePortalTab] = useState<'doctor' | 'patient' | 'pharmacy'>(initialTab);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleSuccess = (user: UserProfile) => {
    onLoginSuccess(user);
    setSuccessBanner(`Successfully authenticated as ${user.name} (${user.roleTitle})`);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner / Hero */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-[#006c4a]/10 text-[#006c4a] font-label-sm text-xs font-bold uppercase tracking-wider">
          Unified Authentication Gateway
        </span>
        <h1 className="font-headline-md text-2xl sm:text-3xl font-bold text-[#0b1c30]">
          Login & Registration Across 3 Frontend Portals
        </h1>
        <p className="font-body-sm text-xs sm:text-sm text-[#525f75]">
          Select the tailored login and registration interface for your role: Clinicians & Admins, Patients, or Licensed Dispensary Partners.
        </p>
      </div>

      {/* Current Active Session Status Card */}
      {currentUser && (
        <div className="p-4 bg-[#eff4ff] rounded-2xl border border-[#dce9ff] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-[#006b53]/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-[#0b1c30]">{currentUser.name}</p>
                <span className="px-2 py-0.5 rounded-full bg-[#006b53] text-white text-[10px] font-bold uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-[#525f75]">{currentUser.roleTitle} • {currentUser.email}</p>
              {currentUser.licenseOrNpi && (
                <p className="text-[11px] text-[#006c4a] font-semibold">{currentUser.licenseOrNpi}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToPortal(currentUser.role === 'patient' ? 'mobile' : 'enterprise')}
              className="px-3.5 py-1.5 bg-[#006b53] hover:bg-[#00513e] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">
                {currentUser.role === 'patient' ? 'smartphone' : 'dashboard'}
              </span>
              <span>Open My Portal</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 text-[#ba1a1a] border border-[#ffdad6] font-semibold text-xs rounded-xl transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Success Notification Alert */}
      {successBanner && (
        <div className="p-3.5 bg-[#eff4ff] border border-[#006b53]/30 rounded-2xl text-xs text-[#00513e] font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#006b53]">check_circle</span>
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => onNavigateToPortal(activePortalTab === 'patient' ? 'mobile' : 'enterprise')}
            className="text-[#006b53] font-bold underline hover:no-underline"
          >
            Launch Screen →
          </button>
        </div>
      )}

      {/* Three Frontend Portal Selector Tabs */}
      <div className="flex items-center justify-center">
        <div className="bg-[#ffffff] p-1.5 rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex flex-wrap gap-1">
          <button
            onClick={() => setActivePortalTab('doctor')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              activePortalTab === 'doctor'
                ? 'bg-[#006b53] text-[#ffffff] shadow-xs'
                : 'text-[#525f75] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
            <span>1. Doctor & Clinical Portal</span>
          </button>

          <button
            onClick={() => setActivePortalTab('patient')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              activePortalTab === 'patient'
                ? 'bg-[#006b53] text-[#ffffff] shadow-xs'
                : 'text-[#525f75] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">smartphone</span>
            <span>2. Patient Mobile App</span>
          </button>

          <button
            onClick={() => setActivePortalTab('pharmacy')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              activePortalTab === 'pharmacy'
                ? 'bg-[#006b53] text-[#ffffff] shadow-xs'
                : 'text-[#525f75] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">local_pharmacy</span>
            <span>3. Pharmacy & Dispensary Partner</span>
          </button>
        </div>
      </div>

      {/* Active Screen Container */}
      <div className="pt-2">
        {activePortalTab === 'doctor' && (
          <DoctorClinicalAuth
            onSuccess={handleSuccess}
            onSwitchPortal={(portal) => setActivePortalTab(portal)}
          />
        )}

        {activePortalTab === 'patient' && (
          <PatientAuth
            onSuccess={handleSuccess}
            onSwitchPortal={(portal) => setActivePortalTab(portal)}
          />
        )}

        {activePortalTab === 'pharmacy' && (
          <PharmacyDispensaryAuth
            onSuccess={handleSuccess}
            onSwitchPortal={(portal) => setActivePortalTab(portal)}
          />
        )}
      </div>
    </div>
  );
};
