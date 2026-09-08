import React, { useState } from 'react';
import { TENANT_SCHEMAS, LIVE_ARBITRAGE_TRANSACTIONS } from '../../data/mockData';
import { TenantSchema, ArbitrageTransaction } from '../../types';

export const GlobalPlatformOperationsView: React.FC = () => {
  const [tenants] = useState<TenantSchema[]>(TENANT_SCHEMAS);
  const [transactions, setTransactions] = useState<ArbitrageTransaction[]>(LIVE_ARBITRAGE_TRANSACTIONS);
  const [isSimulatingLive, setIsSimulatingLive] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSimulateNewTx = () => {
    const randomId = Math.floor(100000 + Math.random() * 900000);
    const newTx: ArbitrageTransaction = {
      id: `tx-${Date.now()}`,
      orderNumber: `#RX-${randomId}`,
      timestamp: 'Just now (live)',
      originatingTenant: 'NY Presbyterian',
      tenantCode: 'tenant_ny_presby',
      brandMedicine: 'Norvasc 10mg',
      genericMedicine: 'Amlodipine Besylate 10mg',
      equivalenceGrade: 'Therapeutic AB Rating',
      pharmacyName: 'Metro Health Central Rx',
      pharmacyDistance: '1.1 miles away',
      genericPrice: 8.20,
      brandPrice: 62.00,
      patientSavingsPercent: 86.8,
      doctorReview: 'Dr. E. Vance Approved',
      platformFee: 0.41,
      isSettled: true
    };

    setTransactions(prev => [newTx, ...prev.slice(0, 5)]);
    showToast(`New Live Arbitrage Settled: #RX-${randomId} ($${newTx.genericPrice.toFixed(2)} vs $${newTx.brandPrice.toFixed(2)})`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
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
              Multi-Tenant Operations & Platform Ledger
            </span>
            <span className="font-code-num text-xs text-[#525f75]">
              PostgreSQL 16.2 Shared Cluster • Redis Hit Rate 98.4%
            </span>
          </div>
          <h1 className="font-headline-md text-xl sm:text-2xl font-bold text-[#0b1c30]">
            Global Platform Operations & Tenant Health
          </h1>
          <p className="font-body-sm text-xs sm:text-sm text-[#525f75]">
            Isolated Schema Data Partitions • Real-Time Clearinghouse Arbitrage Stream & Ledger Settlement
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateNewTx}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#006b53] hover:bg-[#00513e] text-[#ffffff] rounded-xl font-label-md text-xs font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Simulate Live Arbitrage</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5eeff] shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-1.5">
          <div className="flex items-center justify-between text-[#525f75]">
            <span className="font-label-md text-xs uppercase tracking-wider">Total Settled Volume</span>
            <span className="material-symbols-outlined text-[#006c4a] text-[20px]">account_balance</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-md text-2xl font-bold text-[#0b1c30]">$128,490.20</span>
            <span className="font-label-sm text-xs font-bold text-[#006c4a] bg-[#006c4a]/10 px-2 py-0.5 rounded-full">
              +18.4%
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-[#525f75]">Rolling 30-day cleared transactions</p>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5eeff] shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-1.5">
          <div className="flex items-center justify-between text-[#525f75]">
            <span className="font-label-md text-xs uppercase tracking-wider">Generic Savings Total</span>
            <span className="material-symbols-outlined text-[#006b53] text-[20px]">savings</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-md text-2xl font-bold text-[#006c4a]">$1,184,920.00</span>
            <span className="font-label-sm text-xs font-bold text-[#006c4a] bg-[#79f9d0]/30 px-2 py-0.5 rounded-full">
              88.2% Avg
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-[#525f75]">Aggregated patient network savings</p>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5eeff] shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-1.5">
          <div className="flex items-center justify-between text-[#525f75]">
            <span className="font-label-md text-xs uppercase tracking-wider">Active Tenant Schemas</span>
            <span className="material-symbols-outlined text-[#525f75] text-[20px]">schema</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-md text-2xl font-bold text-[#0b1c30]">4 Networks</span>
            <span className="font-label-sm text-xs font-bold text-[#006c4a] bg-[#006c4a]/10 px-2 py-0.5 rounded-full">
              Isolated
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-[#525f75]">Multi-tenant separate schemas</p>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5eeff] shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-1.5">
          <div className="flex items-center justify-between text-[#525f75]">
            <span className="font-label-md text-xs uppercase tracking-wider">Inter-Dispensary Latency</span>
            <span className="material-symbols-outlined text-[#2aa779] text-[20px]">speed</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-md text-2xl font-bold text-[#0b1c30]">1.4s</span>
            <span className="font-label-sm text-xs font-bold text-[#006c4a] bg-[#006c4a]/10 px-2 py-0.5 rounded-full">
              p99 &lt; 2.1s
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-[#525f75]">Redis Cluster Hit Rate 98.4%</p>
        </div>
      </div>

      {/* Tenant Partition Schemas Table */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
          <div>
            <h3 className="font-headline-sm text-base sm:text-lg font-bold text-[#0b1c30]">
              PostgreSQL 16.2 Tenant Partition Schemas
            </h3>
            <p className="font-body-sm text-xs text-[#525f75]">
              Strict cryptographic row-level and schema boundaries ensuring zero cross-tenant leakage
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#eff4ff] text-[#006b53] font-bold text-xs">
            Multi-Tenant Architecture
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5eeff] text-[#525f75] font-label-sm">
                <th className="py-2.5 px-3">Tenant Organization</th>
                <th className="py-2.5 px-3">Database Schema</th>
                <th className="py-2.5 px-3">Isolation Mode</th>
                <th className="py-2.5 px-3">Storage Used</th>
                <th className="py-2.5 px-3">DB Connections</th>
                <th className="py-2.5 px-3">Cache Hit Rate</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eff4ff]">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-[#eff4ff]/60 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-[#0b1c30]">{t.name}</span>
                  </td>
                  <td className="py-3 px-3 font-code-num text-[#525f75]">
                    {t.identifier}
                  </td>
                  <td className="py-3 px-3 text-[#3d4a44]">
                    {t.isolationMode}
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#0b1c30]">
                    {t.dbStorage}
                  </td>
                  <td className="py-3 px-3 text-[#525f75]">
                    {t.connections}
                  </td>
                  <td className="py-3 px-3 font-bold text-[#006c4a]">
                    {t.redisHitRate}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#006c4a]/10 text-[#006c4a] font-bold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-Time Medicine Arbitrage Stream & Settlement Ledger */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a884] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a884]"></span>
            </span>
            <h3 className="font-headline-sm text-base sm:text-lg font-bold text-[#0b1c30]">
              Real-Time Clearinghouse Arbitrage Stream & Settlement Ledger
            </h3>
          </div>
          <span className="text-xs text-[#525f75]">
            5% Platform Commission Auto-Credited
          </span>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-xl border border-[#e5eeff] bg-[#f8f9ff] hover:border-[#00a884]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#0b1c30]">{tx.orderNumber}</span>
                  <span className="text-[#525f75]">{tx.timestamp}</span>
                  <span className="px-2 py-0.5 rounded bg-[#d6e3fe] text-[#0e1c2f] font-semibold text-[11px]">
                    {tx.originatingTenant}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#3d4a44]">
                  <span className="line-through text-[#ba1a1a]">{tx.brandMedicine} (${tx.brandPrice.toFixed(2)})</span>
                  <span className="material-symbols-outlined text-[14px] text-[#006c4a]">arrow_forward</span>
                  <span className="font-bold text-[#006c4a]">{tx.genericMedicine} (${tx.genericPrice.toFixed(2)})</span>
                  <span className="text-[11px] text-[#525f75]">({tx.equivalenceGrade})</span>
                </div>
                <p className="text-[11px] text-[#525f75]">
                  Fulfilled by: <span className="font-semibold text-[#0b1c30]">{tx.pharmacyName}</span> ({tx.pharmacyDistance}) • {tx.doctorReview}
                </p>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-2 md:pt-0 border-[#e5eeff]">
                <div className="text-right">
                  <span className="font-bold text-[#006c4a] text-sm block">
                    Saved {tx.patientSavingsPercent}%
                  </span>
                  <span className="text-[11px] text-[#525f75]">
                    Fee: +${tx.platformFee.toFixed(2)}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#006c4a]/10 text-[#006c4a] font-bold text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  Settled
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
