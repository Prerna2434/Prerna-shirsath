import React, { useState } from 'react';
import { COMPETING_PHARMACIES } from '../../data/mockData';
import { CompetingPharmacy } from '../../types';
import { rankPharmacies, calculateSavings } from '../../utils/arbitrageCalculator';

interface PriceComparisonEngineViewProps {
  onConsultAi?: (query: string) => void;
}

export const PriceComparisonEngineView: React.FC<PriceComparisonEngineViewProps> = ({ onConsultAi }) => {
  const [pharmacies, setPharmacies] = useState<CompetingPharmacy[]>(COMPETING_PHARMACIES);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'courier' | 'pickup' | 'brand'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom Savings Simulator state
  const [calcBrandName, setCalcBrandName] = useState('Lipitor 20mg');
  const [calcBrandPrice, setCalcBrandPrice] = useState(88.00);
  const [calcGenericPrice, setCalcGenericPrice] = useState(9.20);
  const [calcMonths, setCalcMonths] = useState(12);

  // Weight sliders state
  const [weights, setWeights] = useState({
    price: 50,
    eta: 25,
    quality: 15,
    margin: 10
  });

  const totalWeight = weights.price + weights.eta + weights.quality + weights.margin;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectRoute = (rank: number) => {
    setPharmacies(prev => prev.map(p => ({
      ...p,
      isDefault: p.rank === rank
    })));
    const chosen = pharmacies.find(p => p.rank === rank);
    showToast(`Default fulfillment route updated to ${chosen?.name} ($${chosen?.patientPrice.toFixed(2)})`);
  };

  const handleDeployWeights = () => {
    // Dynamically recalculate scores and re-rank generic pharmacies
    setPharmacies(prev => rankPharmacies(prev, weights));
    showToast('Routing engine weights re-calibrated. Top fulfillment route dynamically optimized.');
  };

  const savingsCalc = calculateSavings(calcBrandPrice, calcGenericPrice, calcMonths);
  const monthlySavings = savingsCalc.monthlySavings;
  const totalSimulatedSavings = savingsCalc.totalSavings;
  const savingsPct = savingsCalc.savingsPercentage.toFixed(1);

  const filteredPharmacies = pharmacies.filter(p => {
    if (selectedFilter === 'courier') return p.fulfillmentSla.toLowerCase().includes('courier') || p.fulfillmentSla.toLowerCase().includes('express');
    if (selectedFilter === 'pickup') return p.distanceOrCarrier.toLowerCase().includes('miles');
    if (selectedFilter === 'brand') return p.isBrandOnly;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#006b53] text-[#ffffff] px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#79f9d0]/30 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[20px] text-[#79f9d0]">check_circle</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#00a884]/15 text-[#006b53] font-label-sm text-[11px] font-bold uppercase tracking-wider">
              Formulary Economics & Arbitrage Modeling
            </span>
            <span className="font-code-num text-xs text-[#525f75]">Engine v4.2 Core</span>
          </div>
          <h1 className="font-headline-md text-xl sm:text-2xl font-bold text-[#0b1c30]">
            Price Comparison Engine & Algorithmic Equivalence
          </h1>
          <p className="font-body-sm text-xs sm:text-sm text-[#525f75]">
            Targeting Atorvastatin Calcium 20mg • Multi-Store Benchmark & Dynamic Weight Optimization
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDeployWeights}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#006b53] hover:bg-[#00513e] text-[#ffffff] rounded-xl font-label-md text-xs font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Deploy Weights</span>
          </button>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5eeff] shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-1.5">
          <div className="flex items-center justify-between text-[#525f75]">
            <span className="font-label-md text-xs uppercase tracking-wider">Market Arbitrage Delta</span>
            <span className="material-symbols-outlined text-[#006c4a] text-[20px]">trending_down</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-md text-2xl font-bold text-[#006c4a]">-$79.80 / Rx</span>
            <span className="font-label-sm text-xs font-bold text-[#006c4a] bg-[#006c4a]/10 px-2 py-0.5 rounded-full">
              90.1% Drop
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-[#525f75]">
            Peak spread: Lipitor ($88.00) vs Generic ($9.20)
          </p>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5eeff] shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-1.5">
          <div className="flex items-center justify-between text-[#525f75]">
            <span className="font-label-md text-xs uppercase tracking-wider">Avg Patient Copay</span>
            <span className="material-symbols-outlined text-[#006b53] text-[20px]">price_change</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-md text-2xl font-bold text-[#0b1c30]">$1.84</span>
            <span className="font-body-sm text-xs text-[#525f75]">vs $25.00 Brand Copay</span>
          </div>
          <p className="font-body-sm text-[11px] text-[#525f75]">
            Based on Medicare Part D Tier 1 Generic tier
          </p>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5eeff] shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-1.5">
          <div className="flex items-center justify-between text-[#525f75]">
            <span className="font-label-md text-xs uppercase tracking-wider">Substitution Compliance</span>
            <span className="material-symbols-outlined text-[#2aa779] text-[20px]">verified_user</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-md text-2xl font-bold text-[#0b1c30]">94.2%</span>
            <span className="font-label-sm text-xs font-bold text-[#006c4a] bg-[#79f9d0]/30 px-2 py-0.5 rounded-full">
              Optimal
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-[#525f75]">
            Orange Book AB-Rated therapeutic interchangeability
          </p>
        </div>
      </div>

      {/* Main Grid: Algorithmic Weights & Chart (Left) + Multi-Store Matrix (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Algorithmic Calibration + Price Erosion Chart (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dynamic Weight Tuning Panel */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
                  Algorithmic Ranking Weights
                </h3>
                <p className="font-body-sm text-xs text-[#525f75]">
                  Factors determining #1 Default Pharmacy Route in marketplace
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                totalWeight === 100
                  ? 'bg-[#79f9d0]/40 text-[#00513e]'
                  : 'bg-[#ffdad6] text-[#93000a]'
              }`}>
                {totalWeight}% Total
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {/* Slider 1 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#0b1c30]">Price Minimization</span>
                  <span className="font-bold text-[#006b53]">{weights.price}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={weights.price}
                  onChange={(e) => setWeights({ ...weights, price: Number(e.target.value) })}
                  className="w-full accent-[#006b53] cursor-pointer"
                />
                <p className="text-[10px] text-[#525f75]">Prioritizes lowest patient cash and copay pricing</p>
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#0b1c30]">Delivery & Courier Speed (ETA)</span>
                  <span className="font-bold text-[#006b53]">{weights.eta}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={weights.eta}
                  onChange={(e) => setWeights({ ...weights, eta: Number(e.target.value) })}
                  className="w-full accent-[#006b53] cursor-pointer"
                />
                <p className="text-[10px] text-[#525f75]">Rewards nearby couriers and 30-min rush dispatch</p>
              </div>

              {/* Slider 3 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#0b1c30]">Dispensary Quality & Fill Rate</span>
                  <span className="font-bold text-[#006b53]">{weights.quality}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={weights.quality}
                  onChange={(e) => setWeights({ ...weights, quality: Number(e.target.value) })}
                  className="w-full accent-[#006b53] cursor-pointer"
                />
                <p className="text-[10px] text-[#525f75]">Historical adherence, zero-defect packaging score</p>
              </div>

              {/* Slider 4 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#0b1c30]">Formulary Spread Margin</span>
                  <span className="font-bold text-[#006b53]">{weights.margin}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={weights.margin}
                  onChange={(e) => setWeights({ ...weights, margin: Number(e.target.value) })}
                  className="w-full accent-[#006b53] cursor-pointer"
                />
                <p className="text-[10px] text-[#525f75]">Platform interchange revenue share optimization</p>
              </div>
            </div>
          </div>

          {/* Generic Price Erosion Curve Chart */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-headline-sm text-sm font-bold text-[#0b1c30]">
                  Generic Price Erosion Trajectory
                </h4>
                <p className="text-[11px] text-[#525f75]">Post-patent expiry price trajectory over 12 months</p>
              </div>
              <span className="font-code-num text-[11px] text-[#525f75]">Hatch-Waxman Model</span>
            </div>

            {/* SVG Chart */}
            <div className="h-44 w-full pt-2">
              <svg viewBox="0 0 400 160" className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                <line x1="40" y1="20" x2="380" y2="20" stroke="#eff4ff" strokeWidth="1" />
                <line x1="40" y1="60" x2="380" y2="60" stroke="#eff4ff" strokeWidth="1" />
                <line x1="40" y1="100" x2="380" y2="100" stroke="#eff4ff" strokeWidth="1" />
                <line x1="40" y1="140" x2="380" y2="140" stroke="#e5eeff" strokeWidth="1.5" />

                {/* Y Axis Labels */}
                <text x="32" y="24" textAnchor="end" fontSize="9" fill="#525f75">$100</text>
                <text x="32" y="64" textAnchor="end" fontSize="9" fill="#525f75">$60</text>
                <text x="32" y="104" textAnchor="end" fontSize="9" fill="#525f75">$30</text>
                <text x="32" y="144" textAnchor="end" fontSize="9" fill="#525f75">$0</text>

                {/* Brand Line (Stays High at ~$88) */}
                <path
                  d="M 40 32 L 120 32 L 200 34 L 280 34 L 380 35"
                  fill="none"
                  stroke="#ba1a1a"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />

                {/* Generic Erosion Curve (Drops from $88 to $9.20) */}
                <path
                  d="M 40 32 C 90 40, 130 90, 180 115 C 240 130, 320 134, 380 135"
                  fill="none"
                  stroke="#00a884"
                  strokeWidth="3"
                />

                {/* Area Fill for Generic */}
                <path
                  d="M 40 32 C 90 40, 130 90, 180 115 C 240 130, 320 134, 380 135 L 380 140 L 40 140 Z"
                  fill="url(#greenGrad)"
                  opacity="0.15"
                />

                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00a884" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>

                {/* Data Points */}
                <circle cx="40" cy="32" r="3.5" fill="#ba1a1a" />
                <circle cx="180" cy="115" r="4" fill="#006b53" />
                <circle cx="380" cy="135" r="4.5" fill="#006b53" />

                {/* Callout tags */}
                <text x="50" y="24" fontSize="9" fontWeight="600" fill="#ba1a1a">Brand: Lipitor ($88.00)</text>
                <text x="210" y="105" fontSize="8.5" fill="#525f75">180-day Exclusivity</text>
                <text x="280" y="130" fontSize="9" fontWeight="bold" fill="#006c4a">Lowest: $9.20 (-90%)</text>
              </svg>
            </div>
          </div>

          {/* Custom Medicine Savings Simulator Card */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
              <div>
                <h4 className="font-headline-sm text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#006b53]">calculate</span>
                  Custom Medicine Savings Calculator
                </h4>
                <p className="text-[11px] text-[#525f75]">Simulate patient arbitrage savings on any chronic regimen</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#006c4a]/10 text-[#006c4a] font-bold text-[11px]">
                {savingsPct}% Drop
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#525f75] font-semibold mb-1">Medication Name</label>
                <input
                  type="text"
                  value={calcBrandName}
                  onChange={e => setCalcBrandName(e.target.value)}
                  placeholder="e.g. Lipitor 20mg"
                  className="w-full h-8 px-2.5 bg-[#eff4ff] rounded-lg border border-[#dce9ff] text-xs text-[#0b1c30] focus:outline-none focus:ring-1 focus:ring-[#006b53]"
                />
              </div>

              <div>
                <label className="block text-[#525f75] font-semibold mb-1">Duration (Months)</label>
                <select
                  value={calcMonths}
                  onChange={e => setCalcMonths(Number(e.target.value))}
                  className="w-full h-8 px-2 bg-[#eff4ff] rounded-lg border border-[#dce9ff] text-xs text-[#0b1c30] focus:outline-none focus:ring-1 focus:ring-[#006b53]"
                >
                  <option value={1}>1 Month (Immediate)</option>
                  <option value={3}>3 Months (90-Day Supply)</option>
                  <option value={6}>6 Months (Maintenance)</option>
                  <option value={12}>12 Months (Annual Care)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#525f75] font-semibold mb-1">Brand Price ($/mo)</label>
                <input
                  type="number"
                  step="0.5"
                  value={calcBrandPrice}
                  onChange={e => setCalcBrandPrice(Number(e.target.value))}
                  className="w-full h-8 px-2.5 bg-[#eff4ff] rounded-lg border border-[#dce9ff] text-xs text-[#0b1c30] focus:outline-none focus:ring-1 focus:ring-[#006b53]"
                />
              </div>

              <div>
                <label className="block text-[#525f75] font-semibold mb-1">Generic Price ($/mo)</label>
                <input
                  type="number"
                  step="0.5"
                  value={calcGenericPrice}
                  onChange={e => setCalcGenericPrice(Number(e.target.value))}
                  className="w-full h-8 px-2.5 bg-[#eff4ff] rounded-lg border border-[#dce9ff] text-xs text-[#0b1c30] focus:outline-none focus:ring-1 focus:ring-[#006b53]"
                />
              </div>
            </div>

            {/* Calculation Result */}
            <div className="p-3 bg-gradient-to-r from-[#006b53]/10 to-[#00a884]/10 rounded-xl border border-[#006b53]/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#006b53] block">
                  Projected Patient Savings ({calcMonths} Months):
                </span>
                <p className="text-xl font-bold text-[#006c4a]">
                  ${totalSimulatedSavings.toFixed(2)}
                </p>
                <p className="text-[10px] text-[#525f75]">
                  Monthly delta: ${monthlySavings.toFixed(2)}/mo
                </p>
              </div>

              {onConsultAi && (
                <button
                  type="button"
                  onClick={() => onConsultAi(`Calculate detailed patient savings and review therapeutic equivalence for ${calcBrandName} (Brand $${calcBrandPrice} vs Generic $${calcGenericPrice}) over ${calcMonths} months.`)}
                  className="px-3 py-1.5 bg-[#006b53] hover:bg-[#00513e] text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                  <span>AI Breakdown</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Store Comparison Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5eeff]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-base sm:text-lg font-bold text-[#0b1c30]">
                  Competing Dispensary Comparison Matrix
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#006c4a]/10 text-[#006c4a] font-bold text-xs">
                  Live Rates
                </span>
              </div>
              <p className="font-body-sm text-xs text-[#525f75]">
                Atorvastatin Calcium 20mg • Quantity: 30 Tablets • Real-Time Inventory & Dispatch Ready
              </p>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center bg-[#eff4ff] p-1 rounded-lg border border-[#dce9ff] text-xs">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  selectedFilter === 'all' ? 'bg-[#ffffff] text-[#0b1c30] shadow-xs' : 'text-[#525f75]'
                }`}
              >
                All (4)
              </button>
              <button
                onClick={() => setSelectedFilter('courier')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  selectedFilter === 'courier' ? 'bg-[#ffffff] text-[#0b1c30] shadow-xs' : 'text-[#525f75]'
                }`}
              >
                Courier
              </button>
              <button
                onClick={() => setSelectedFilter('pickup')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  selectedFilter === 'pickup' ? 'bg-[#ffffff] text-[#0b1c30] shadow-xs' : 'text-[#525f75]'
                }`}
              >
                Local Pickup
              </button>
              <button
                onClick={() => setSelectedFilter('brand')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  selectedFilter === 'brand' ? 'bg-[#ffffff] text-[#0b1c30] shadow-xs' : 'text-[#525f75]'
                }`}
              >
                Brand Reference
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredPharmacies.map((pharmacy) => (
              <div
                key={pharmacy.rank}
                className={`p-4 rounded-xl border transition-all ${
                  pharmacy.isDefault
                    ? 'bg-[#eff4ff]/70 border-[#00a884] ring-1 ring-[#00a884]'
                    : pharmacy.isBrandOnly
                    ? 'bg-[#ffdad6]/20 border-[#ffdad6]'
                    : 'bg-[#ffffff] border-[#e5eeff] hover:border-[#00a884]/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${
                        pharmacy.isDefault ? 'bg-[#006b53] text-white' : 'bg-[#e5eeff] text-[#525f75]'
                      }`}>
                        #{pharmacy.rank}
                      </span>
                      <h4 className="font-bold text-sm text-[#0b1c30]">{pharmacy.name}</h4>
                      <span className="text-[11px] text-[#525f75]">{pharmacy.license}</span>
                      <div className="flex items-center gap-1 text-[11px] text-[#0b1c30]">
                        <span className="material-symbols-outlined text-[14px] text-amber-500 fill-1">star</span>
                        <span className="font-bold">{pharmacy.rating}</span>
                        <span className="text-[#525f75]">({pharmacy.reviewCount})</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#3d4a44]">
                      {pharmacy.genericProduct} • <span className="text-[#525f75]">{pharmacy.manufacturer}</span>
                    </p>
                    <p className="font-code-num text-[11px] text-[#525f75]">
                      NDC: {pharmacy.ndc} • {pharmacy.fulfillmentSla} ({pharmacy.distanceOrCarrier})
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className="text-right shrink-0 flex sm:flex-col items-end justify-between sm:justify-start gap-1">
                    <div>
                      <div className="font-headline-sm text-xl font-bold text-[#0b1c30]">
                        ${pharmacy.patientPrice.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-[#525f75]">
                        Copay: ${pharmacy.copay.toFixed(2)}
                      </div>
                    </div>
                    {pharmacy.savingsDollars > 5 && (
                      <span className="px-2 py-0.5 rounded bg-[#006c4a]/10 text-[#006c4a] font-bold text-[11px]">
                        Save ${pharmacy.savingsDollars.toFixed(2)} ({pharmacy.savingsPercentage}%)
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-3 pt-3 border-t border-[#e5eeff]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    {pharmacy.isBrandOnly ? (
                      <span className="text-[#ba1a1a] font-medium text-[11px]">
                        Non-Generic Reference (DAW-1 Only)
                      </span>
                    ) : (
                      <span className="text-[#006c4a] font-medium text-[11px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        FDA Orange Book Equivalence Validated
                      </span>
                    )}

                    {onConsultAi && !pharmacy.isBrandOnly && (
                      <button
                        onClick={() => onConsultAi(`Evaluate clinical bioequivalence and pharmacy license credentials for ${pharmacy.name} (${pharmacy.genericProduct} manufactured by ${pharmacy.manufacturer}).`)}
                        className="inline-flex items-center gap-1 text-[11px] text-[#006b53] hover:text-[#00513e] font-semibold ml-1"
                      >
                        <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                        <span>Clinical AI Review</span>
                      </button>
                    )}
                  </div>

                  {pharmacy.isDefault ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#006b53] text-[#ffffff] text-xs font-semibold shadow-xs shrink-0">
                      <span className="material-symbols-outlined text-[15px]">done_all</span>
                      Active Platform Route
                    </span>
                  ) : pharmacy.isBrandOnly ? (
                    <span className="text-xs text-[#525f75] shrink-0">Reference Only</span>
                  ) : (
                    <button
                      onClick={() => handleSelectRoute(pharmacy.rank)}
                      className="px-3 py-1 bg-[#eff4ff] hover:bg-[#00a884] hover:text-[#ffffff] text-[#006b53] rounded-lg text-xs font-semibold border border-[#dce9ff] transition-all shrink-0"
                    >
                      Select Route
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
