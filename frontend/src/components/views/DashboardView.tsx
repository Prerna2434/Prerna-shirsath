import React from 'react';
import { LIVE_ARBITRAGE_TRANSACTIONS, INITIAL_DISPENSARY_STOCK } from '../../data/mockData';

interface DashboardViewProps {
  onSelectView: (view: string) => void;
}

const KpiCard: React.FC<{
  icon: string;
  label: string;
  value: string;
  sub: string;
  accent: string;
  bg: string;
}> = ({ icon, label, value, sub, accent, bg }) => (
  <div className={`rounded-2xl p-5 border border-[#e5eeff] bg-[#ffffff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex items-start gap-4`}>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
      <span className={`material-symbols-outlined text-[22px] ${accent}`}>{icon}</span>
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#525f75]">{label}</p>
      <p className="text-2xl font-bold text-[#0b1c30] leading-tight mt-0.5">{value}</p>
      <p className="text-[11px] text-[#525f75] mt-0.5">{sub}</p>
    </div>
  </div>
);

const SparkLine: React.FC<{ values: number[]; color: string }> = ({ values, color }) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const h = 40;
  const w = 120;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={pts}
      />
      <circle
        cx={(values.length - 1) / (values.length - 1) * w}
        cy={h - ((values[values.length - 1] - min) / range) * h}
        r="3"
        fill={color}
      />
    </svg>
  );
};

const quickLinks = [
  {
    id: 'dispensary',
    title: 'Dispensary Matrix',
    desc: 'Stock, orders & price matching',
    icon: 'local_pharmacy',
    color: '#006b53',
    bg: 'bg-[#006b53]/10',
  },
  {
    id: 'price-comparison',
    title: 'Price Engine',
    desc: 'Arbitrage & formulary economics',
    icon: 'query_stats',
    color: '#006c4a',
    bg: 'bg-[#006c4a]/10',
  },
  {
    id: 'doctor-prescriptions',
    title: 'E-Prescriptions',
    desc: 'Doctor review & DDI alerts',
    icon: 'clinical_notes',
    color: '#525f75',
    bg: 'bg-[#525f75]/10',
  },
  {
    id: 'multi-tenant',
    title: 'Platform Operations',
    desc: 'Multi-tenant clearinghouse',
    icon: 'hub',
    color: '#0b1c30',
    bg: 'bg-[#0b1c30]/10',
  },
];

const savingsTrend = [18200, 21400, 19800, 24600, 26100, 23900, 28400, 31200, 29800, 33500, 36200, 38800];
const rxTrend = [120, 145, 132, 158, 170, 161, 183, 195, 188, 210, 224, 238];

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectView }) => {
  const recentTx = LIVE_ARBITRAGE_TRANSACTIONS.slice(0, 5);
  const lowStockCount = INITIAL_DISPENSARY_STOCK.filter(s => s.isLowStock).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#006b53] to-[#00a884] rounded-2xl p-6 text-white shadow-[0_4px_24px_rgba(0,107,83,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider">
                Live Platform Dashboard
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">GeneticMedicine Platform</h1>
            <p className="text-white/75 text-sm mt-1">
              Real-time analytics across dispensaries, prescriptions &amp; arbitrage settlements
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="flex items-center gap-1.5 text-white/80 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[#79f9d0] animate-pulse" />
              All Systems Operational
            </span>
            <span className="text-white/60 text-[11px]">Last sync: just now</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon="receipt_long"
          label="Rx Processed Today"
          value="238"
          sub="↑ 6.3% vs yesterday"
          accent="text-[#006b53]"
          bg="bg-[#006b53]/10"
        />
        <KpiCard
          icon="savings"
          label="Patient Savings Today"
          value="$38.8K"
          sub="↑ 7.1% vs yesterday"
          accent="text-[#006c4a]"
          bg="bg-[#006c4a]/10"
        />
        <KpiCard
          icon="hub"
          label="Active Tenants"
          value="6"
          sub="3 hospitals · 3 networks"
          accent="text-[#525f75]"
          bg="bg-[#525f75]/10"
        />
        <KpiCard
          icon="warning"
          label="Low Stock Alerts"
          value={String(lowStockCount)}
          sub="Requires reorder attention"
          accent="text-[#ba1a1a]"
          bg="bg-[#ffdad6]"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Savings Trend */}
        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#525f75]">Patient Savings Trend</p>
              <p className="text-xl font-bold text-[#0b1c30] mt-0.5">$38,800</p>
              <p className="text-[11px] text-[#006c4a] font-semibold">↑ 7.1% this month</p>
            </div>
            <SparkLine values={savingsTrend} color="#006b53" />
          </div>
          <div className="flex gap-1 mt-2">
            {savingsTrend.map((v, i) => {
              const max = Math.max(...savingsTrend);
              const pct = (v / max) * 100;
              return (
                <div key={i} className="flex-1 bg-[#eff4ff] rounded-sm overflow-hidden" style={{ height: 32 }}>
                  <div
                    className="w-full bg-[#006b53]/60 rounded-sm transition-all duration-300"
                    style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[#525f75]">Sep '25</span>
            <span className="text-[10px] text-[#525f75]">Sep '26</span>
          </div>
        </div>

        {/* Rx Volume Trend */}
        <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#525f75]">Rx Volume Trend</p>
              <p className="text-xl font-bold text-[#0b1c30] mt-0.5">238 / day</p>
              <p className="text-[11px] text-[#006c4a] font-semibold">↑ 98% generic substitution rate</p>
            </div>
            <SparkLine values={rxTrend} color="#006c4a" />
          </div>
          <div className="flex gap-1 mt-2">
            {rxTrend.map((v, i) => {
              const max = Math.max(...rxTrend);
              const pct = (v / max) * 100;
              return (
                <div key={i} className="flex-1 bg-[#eff4ff] rounded-sm overflow-hidden" style={{ height: 32 }}>
                  <div
                    className="w-full bg-[#006c4a]/60 rounded-sm transition-all duration-300"
                    style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[#525f75]">Sep '25</span>
            <span className="text-[10px] text-[#525f75]">Sep '26</span>
          </div>
        </div>
      </div>

      {/* Quick Access + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Quick Access Links */}
        <div className="lg:col-span-2 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#525f75] px-1">Quick Access</p>
          {quickLinks.map(link => (
            <button
              key={link.id}
              onClick={() => onSelectView(link.id)}
              className="w-full flex items-center gap-3 bg-[#ffffff] rounded-xl p-4 border border-[#e5eeff] hover:border-[#00a884]/40 hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.bg} shrink-0`}>
                <span className="material-symbols-outlined text-[20px]" style={{ color: link.color }}>
                  {link.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#0b1c30]">{link.title}</p>
                <p className="text-[11px] text-[#525f75] truncate">{link.desc}</p>
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#525f75] group-hover:text-[#006b53] transition-colors">
                chevron_right
              </span>
            </button>
          ))}
        </div>

        {/* Recent Arbitrage Activity */}
        <div className="lg:col-span-3 bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#eff4ff] flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#525f75]">Recent Arbitrage Activity</p>
              <p className="text-xs text-[#3d4a44] font-medium mt-0.5">Live settlement feed</p>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] text-[#006c4a] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a] animate-pulse" />
              Live
            </span>
          </div>
          <div className="divide-y divide-[#eff4ff]">
            {recentTx.map(tx => (
              <div key={tx.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-[#f8f9ff] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#006b53]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] text-[#006b53]">pill</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-[#0b1c30] truncate">{tx.genericMedicine}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#006b53]/10 text-[#006b53] text-[10px] font-bold">
                      {tx.equivalenceGrade}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#525f75] truncate">
                    {tx.pharmacyName} · {tx.originatingTenant}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-[#006c4a]">−{tx.patientSavingsPercent}%</p>
                  <p className="text-[11px] text-[#525f75]">${tx.genericPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-[#eff4ff]">
            <button
              onClick={() => onSelectView('multi-tenant')}
              className="text-xs font-bold text-[#006b53] hover:text-[#00513e] flex items-center gap-1 transition-colors"
            >
              View full ledger
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
