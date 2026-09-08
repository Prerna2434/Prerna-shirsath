import React from 'react';
import { UserProfile } from '../../types';

interface EnterpriseSidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth?: (portal?: 'doctor' | 'patient' | 'pharmacy') => void;
}

export const EnterpriseSidebar: React.FC<EnterpriseSidebarProps> = ({
  currentView,
  onSelectView,
  isOpenMobile,
  onCloseMobile,
  currentUser,
  onOpenAuth
}) => {
  const mainManagementNav = [
    { id: 'multi-tenant', label: 'Multi-Tenant Overview', icon: 'hub' },
    { id: 'price-comparison', label: 'Price Comparison & Analytics', icon: 'query_stats' },
    { id: 'dispensary', label: 'Pharmacy Management', icon: 'local_pharmacy' },
    { id: 'catalog', label: 'Medicine Catalog & Equivalence', icon: 'medication' },
    { id: 'fulfillment', label: 'Order Fulfillment & Dispatch', icon: 'local_shipping' }
  ];

  const portalsNav = [
    { id: 'doctor-prescriptions', label: 'Doctor E-Prescriptions', icon: 'clinical_notes' },
    { id: 'settlement', label: 'Settlement & Ledger', icon: 'account_balance_wallet' }
  ];

  const infrastructureNav = [
    { id: 'tenant-schemas', label: 'Tenant Database Schemas', icon: 'schema' },
    { id: 'audit-logs', label: 'Audit Trail & Access Logs', icon: 'shield' },
    { id: 'api-gateway', label: 'API Gateway & Integrations', icon: 'api' }
  ];

  const handleNavClick = (id: string) => {
    onSelectView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-[16.25rem] bg-[#ffffff] z-50 flex flex-col border-r border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-200 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Tenant Identifier Card */}
        <div className="h-16 px-4 flex items-center gap-3 bg-[#eff4ff] border-b border-[#e5eeff]">
          <div className="w-8 h-8 rounded-lg bg-[#ffffff] flex items-center justify-center text-[#006b53] shadow-[0_1px_3px_0_rgba(11,25,44,0.04)] shrink-0">
            <span className="material-symbols-outlined text-[20px]">apartment</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-label-md text-[12px] font-bold text-[#0b1c30] truncate">
                Metro Health Network
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#006c4a]/10 text-[#006c4a] font-label-sm text-[10px] uppercase font-bold tracking-wider shrink-0">
                Prod
              </span>
            </div>
            <p className="font-code-num text-[11px] text-[#525f75] truncate">
              Schema: tenant_082
            </p>
          </div>
          <button
            type="button"
            className="text-[#525f75] hover:text-[#0b1c30] p-1 rounded hover:bg-[#e5eeff] transition-colors"
            title="Switch Tenant Schema"
          >
            <span className="material-symbols-outlined text-[18px]">unfold_more</span>
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-4">
          {/* Group 1: Main Management */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 font-label-sm text-[11px] text-[#525f75] uppercase tracking-wider font-semibold">
              Main Management
            </div>
            <nav className="space-y-0.5">
              {mainManagementNav.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-body-sm text-[13px] text-left transition-all ${
                      isActive
                        ? 'bg-[#00a884] text-[#ffffff] font-semibold shadow-sm'
                        : 'text-[#3d4a44] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] shrink-0">
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Group 2: Authoritative Portals */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 font-label-sm text-[11px] text-[#525f75] uppercase tracking-wider font-semibold">
              Authoritative Portals
            </div>
            <nav className="space-y-0.5">
              {portalsNav.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-body-sm text-[13px] text-left transition-all ${
                      isActive
                        ? 'bg-[#00a884] text-[#ffffff] font-semibold shadow-sm'
                        : 'text-[#3d4a44] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] shrink-0">
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Group 3: Infrastructure & Compliance */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 font-label-sm text-[11px] text-[#525f75] uppercase tracking-wider font-semibold">
              Infrastructure & Compliance
            </div>
            <nav className="space-y-0.5">
              {infrastructureNav.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-body-sm text-[13px] text-left transition-all ${
                      isActive
                        ? 'bg-[#00a884] text-[#ffffff] font-semibold shadow-sm'
                        : 'text-[#3d4a44] hover:bg-[#e5eeff] hover:text-[#0b1c30]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] shrink-0">
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Portal Sign In / Account Access Card */}
        {onOpenAuth && (
          <div className="mx-2 mb-2 p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#525f75]">
                Account Access
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[#006b53] text-white text-[9px] font-bold">
                {currentUser?.role || 'Guest'}
              </span>
            </div>
            <p className="font-bold text-xs text-[#0b1c30] truncate">
              {currentUser?.name || 'Sign In or Register'}
            </p>
            <p className="text-[10px] text-[#525f75] truncate mb-2">
              {currentUser?.roleTitle || 'Doctor, Patient & Pharmacy Login'}
            </p>
            <button
              onClick={() => onOpenAuth('doctor')}
              className="w-full py-1.5 bg-[#006b53] hover:bg-[#00513e] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[14px]">passkey</span>
              <span>{currentUser ? 'Switch / Manage Account' : 'Sign In / Register'}</span>
            </button>
          </div>
        )}

        {/* Bottom Infrastructure Heartbeat Status */}
        <div className="p-3 bg-[#eff4ff] m-2 rounded-lg border border-[#e5eeff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006c4a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006c4a]"></span>
            </span>
            <span className="font-label-sm text-[11px] font-semibold text-[#3d4a44]">
              Postgres/Redis OK
            </span>
          </div>
          <span className="font-code-num text-[12px] font-bold text-[#525f75]">
            99.98%
          </span>
        </div>
      </aside>
    </>
  );
};
