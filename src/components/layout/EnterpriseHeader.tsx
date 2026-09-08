import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';
import { UserProfile } from '../../types';

interface EnterpriseHeaderProps {
  currentView: string;
  onSelectView: (view: string) => void;
  activeMode: 'enterprise' | 'mobile' | 'auth' | 'prd';
  onSelectMode: (mode: 'enterprise' | 'mobile' | 'auth' | 'prd') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: (portal?: 'doctor' | 'patient' | 'pharmacy') => void;
  onLogout?: () => void;
}

export const EnterpriseHeader: React.FC<EnterpriseHeaderProps> = ({
  activeMode,
  onSelectMode,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-[16.25rem] right-0 h-16 bg-[#ffffff]/95 backdrop-blur-xl z-40 px-4 sm:px-6 flex items-center justify-between border-b border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5">
          <img
            src={ASSETS.logo}
            alt="geneticmedicine logo"
            className="h-8 w-auto object-contain shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-title-md text-[15px] font-bold text-[#0b1c30] tracking-tight">
              geneticmedicine
            </span>
            <span className="hidden xl:inline-block font-body-sm text-[11px] text-[#525f75]">
              Clinical Intelligence & Pharmacy Portal
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden md:flex items-center w-72 lg:w-80">
          <span className="material-symbols-outlined absolute left-2.5 text-[#525f75] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine, NDC, tenant ID, orders..."
            className="w-full h-9 pl-9 pr-8 bg-[#eff4ff] rounded-lg font-body-sm text-[13px] text-[#0b1c30] placeholder:text-[#525f75] focus:outline-none focus:bg-[#e5eeff] focus:ring-1 focus:ring-[#00a884] transition-all"
          />
          <span className="absolute right-2 font-label-sm text-[11px] text-[#525f75] bg-[#dce9ff] px-1.5 py-0.5 rounded">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Tools & Mode Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mode Switcher Pill */}
        <div className="flex items-center bg-[#eff4ff] p-1 rounded-xl border border-[#dce9ff] shadow-inner">
          <button
            onClick={() => onSelectMode('enterprise')}
            className={`px-3 py-1 rounded-lg font-label-sm text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
              activeMode === 'enterprise'
                ? 'bg-[#006b53] text-[#ffffff] shadow-sm'
                : 'text-[#525f75] hover:text-[#0b1c30]'
            }`}
            title="Desktop Enterprise Portal screens"
          >
            <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
            <span className="hidden sm:inline">Enterprise Hub</span>
          </button>

          <button
            onClick={() => onSelectMode('mobile')}
            className={`px-3 py-1 rounded-lg font-label-sm text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
              activeMode === 'mobile'
                ? 'bg-[#006b53] text-[#ffffff] shadow-sm'
                : 'text-[#525f75] hover:text-[#0b1c30]'
            }`}
            title="Patient Mobile App with Smart Scanner"
          >
            <span className="material-symbols-outlined text-[16px]">smartphone</span>
            <span className="hidden sm:inline">Patient App</span>
          </button>

          <button
            onClick={() => onSelectMode('auth')}
            className={`px-2.5 py-1 rounded-lg font-label-sm text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
              activeMode === 'auth'
                ? 'bg-[#006b53] text-[#ffffff] shadow-sm'
                : 'text-[#525f75] hover:text-[#0b1c30]'
            }`}
            title="Login & Registration Across 3 Frontend Pages"
          >
            <span className="material-symbols-outlined text-[16px]">passkey</span>
            <span className="hidden md:inline">Sign In / Register</span>
          </button>

          <button
            onClick={() => onSelectMode('prd')}
            className={`px-2.5 py-1 rounded-lg font-label-sm text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
              activeMode === 'prd'
                ? 'bg-[#006b53] text-[#ffffff] shadow-sm'
                : 'text-[#525f75] hover:text-[#0b1c30]'
            }`}
            title="Industry-Level PRD Document"
          >
            <span className="material-symbols-outlined text-[16px]">description</span>
            <span className="hidden lg:inline">PRD Docs</span>
          </button>
        </div>

        {/* System telemetry indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-[#eff4ff] rounded-full border border-[#e5eeff]">
          <span className="w-2 h-2 rounded-full bg-[#006c4a] animate-pulse"></span>
          <span className="font-label-sm text-[11px] text-[#3d4a44] font-medium">
            All Systems Operational
          </span>
        </div>

        {/* Version badge */}
        <span className="hidden sm:inline-block font-label-sm text-[11px] bg-[#d6e3fe] text-[#58657b] px-2 py-0.5 rounded font-semibold">
          v1.0 Prod
        </span>

        {/* Notification bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-1.5 text-[#3d4a44] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
        </button>

        {/* User profile with Interactive Dropdown / Switcher */}
        <div className="relative pl-1 border-l border-[#e5eeff]">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity p-1 rounded-xl hover:bg-[#eff4ff]"
          >
            <div className="text-right hidden xl:block">
              <p className="font-label-md text-[12px] font-semibold text-[#0b1c30] leading-tight">
                {currentUser?.name || 'Guest Provider'}
              </p>
              <p className="font-label-sm text-[11px] text-[#525f75] leading-tight">
                {currentUser?.roleTitle || 'Click to Sign In / Register'}
              </p>
            </div>
            <img
              src={currentUser?.avatar || ASSETS.drEvelynVance}
              alt={currentUser?.name || 'Provider Profile'}
              className="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-[#006b53]/30"
            />
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e5eeff] p-3 space-y-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="pb-2 border-b border-[#eff4ff]">
                <p className="font-bold text-xs text-[#0b1c30]">{currentUser?.name || 'Guest Clinician'}</p>
                <p className="text-[11px] text-[#525f75]">{currentUser?.email || 'Not authenticated'}</p>
                {currentUser?.licenseOrNpi && (
                  <p className="text-[10px] text-[#006c4a] font-semibold mt-0.5">{currentUser.licenseOrNpi}</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-[#525f75] px-1">Switch Portal / Account:</p>
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenAuth?.('doctor');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#0b1c30] hover:bg-[#eff4ff] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#006b53]">clinical_notes</span>
                  <span>Doctor / Clinician Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenAuth?.('patient');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#0b1c30] hover:bg-[#eff4ff] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#006b53]">smartphone</span>
                  <span>Patient Mobile Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenAuth?.('pharmacy');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#0b1c30] hover:bg-[#eff4ff] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#006b53]">local_pharmacy</span>
                  <span>Dispensary Store Login</span>
                </button>
              </div>

              {currentUser && onLogout && (
                <div className="pt-2 border-t border-[#eff4ff]">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign Out Current User</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

