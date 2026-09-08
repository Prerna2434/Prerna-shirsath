/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EnterpriseHeader } from './components/layout/EnterpriseHeader';
import { EnterpriseSidebar } from './components/layout/EnterpriseSidebar';
import { DispensaryMatrixView } from './components/views/DispensaryMatrixView';
import { PriceComparisonEngineView } from './components/views/PriceComparisonEngineView';
import { DoctorPrescriptionReviewView } from './components/views/DoctorPrescriptionReviewView';
import { GlobalPlatformOperationsView } from './components/views/GlobalPlatformOperationsView';
import { PatientMobileApp } from './components/mobile/PatientMobileApp';
import { PrdViewerModal } from './components/docs/PrdViewerModal';
import { UnifiedAuthPage } from './components/auth/UnifiedAuthPage';
import { DEFAULT_USERS } from './data/mockData';
import { UserProfile } from './types';

export default function App() {
  const [activeMode, setActiveMode] = useState<'enterprise' | 'mobile' | 'auth' | 'prd'>('enterprise');
  const [currentView, setCurrentView] = useState<string>('dispensary');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEFAULT_USERS.admin);
  const [initialAuthTab, setInitialAuthTab] = useState<'doctor' | 'patient' | 'pharmacy'>('doctor');

  const handleOpenAuth = (portalTab?: 'doctor' | 'patient' | 'pharmacy') => {
    if (portalTab) {
      setInitialAuthTab(portalTab);
    }
    setActiveMode('auth');
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      {/* Global Enterprise Top Header */}
      <EnterpriseHeader
        currentView={currentView}
        onSelectView={setCurrentView}
        activeMode={activeMode}
        onSelectMode={setActiveMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Layout Body */}
      {activeMode === 'enterprise' && (
        <div className="pt-16 flex">
          {/* Sidebar */}
          <EnterpriseSidebar
            currentView={currentView}
            onSelectView={setCurrentView}
            isOpenMobile={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
          />

          {/* Main Content Area */}
          <main className="flex-1 lg:pl-[16.25rem] min-w-0 transition-all">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Mobile Sidebar Hamburger & Quick View Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#ffffff] p-3 rounded-2xl border border-[#e5eeff] shadow-[0_1px_6px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="lg:hidden p-2 text-[#525f75] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-xl"
                    title="Open Navigation"
                  >
                    <span className="material-symbols-outlined text-[20px]">menu</span>
                  </button>
                  <span className="text-xs font-bold text-[#525f75] uppercase tracking-wider hidden sm:inline">
                    Enterprise Portal Views:
                  </span>
                </div>

                {/* 4 Core Authoritative Views Quick Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                  <button
                    onClick={() => setCurrentView('dispensary')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      currentView === 'dispensary'
                        ? 'bg-[#006b53] text-[#ffffff] shadow-xs'
                        : 'bg-[#eff4ff] text-[#525f75] hover:bg-[#e5eeff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">local_pharmacy</span>
                    <span>1. Dispensary Matrix</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('price-comparison')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      currentView === 'price-comparison'
                        ? 'bg-[#006b53] text-[#ffffff] shadow-xs'
                        : 'bg-[#eff4ff] text-[#525f75] hover:bg-[#e5eeff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">query_stats</span>
                    <span>2. Price Engine</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('doctor-prescriptions')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      currentView === 'doctor-prescriptions'
                        ? 'bg-[#006b53] text-[#ffffff] shadow-xs'
                        : 'bg-[#eff4ff] text-[#525f75] hover:bg-[#e5eeff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
                    <span>3. Doctor E-Prescription</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('multi-tenant')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      currentView === 'multi-tenant'
                        ? 'bg-[#006b53] text-[#ffffff] shadow-xs'
                        : 'bg-[#eff4ff] text-[#525f75] hover:bg-[#e5eeff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">hub</span>
                    <span>4. Multi-Tenant Clearinghouse</span>
                  </button>
                </div>
              </div>

              {/* Dynamic View Rendering */}
              {currentView === 'dispensary' && (
                <DispensaryMatrixView
                  currentUser={currentUser}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}
              {currentView === 'price-comparison' && <PriceComparisonEngineView />}
              {currentView === 'doctor-prescriptions' && <DoctorPrescriptionReviewView />}
              {currentView === 'multi-tenant' && <GlobalPlatformOperationsView />}
              {currentView === 'catalog' && <PriceComparisonEngineView />}
              {currentView === 'fulfillment' && (
                <DispensaryMatrixView
                  currentUser={currentUser}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}
              {currentView === 'settlement' && <GlobalPlatformOperationsView />}
              {currentView === 'tenant-schemas' && <GlobalPlatformOperationsView />}
              {currentView === 'audit-logs' && <GlobalPlatformOperationsView />}
              {currentView === 'api-gateway' && <GlobalPlatformOperationsView />}
            </div>
          </main>
        </div>
      )}

      {/* Patient Mobile Experience Mode */}
      {activeMode === 'mobile' && (
        <div className="pt-20 pb-12 px-4 flex flex-col items-center justify-center">
          <div className="text-center max-w-md mx-auto mb-6 space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#006c4a]/10 text-[#006c4a] font-bold text-xs uppercase tracking-wider">
              Patient Mobile Experience
            </span>
            <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-[#0b1c30]">
              Wholesale Generic Medicine Marketplace
            </h2>
            <p className="text-xs text-[#525f75]">
              Includes Patient Discovery, 90% Generic Price Comparison, Smart Optical Scanner with OCR, and Patient Login & Registration.
            </p>
          </div>

          <PatientMobileApp
            currentUser={currentUser}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
          />
        </div>
      )}

      {/* Dedicated Login & Registration Mode across Three Frontend Portals */}
      {activeMode === 'auth' && (
        <div className="pt-20 pb-16 px-4 sm:px-6">
          <UnifiedAuthPage
            currentUser={currentUser}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onNavigateToPortal={(mode) => setActiveMode(mode)}
            initialTab={initialAuthTab}
          />
        </div>
      )}

      {/* PRD Specification Viewer Mode */}
      {activeMode === 'prd' && (
        <div className="pt-20 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
          <PrdViewerModal />
        </div>
      )}
    </div>
  );
}

