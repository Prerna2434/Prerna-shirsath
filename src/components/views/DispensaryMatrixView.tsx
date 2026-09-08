import React, { useState } from 'react';
import { ASSETS, INITIAL_DISPENSARY_STOCK, INITIAL_LIVE_ORDERS } from '../../data/mockData';
import { DispensaryStockItem, DispensaryOrder } from '../../types';

export const DispensaryMatrixView: React.FC = () => {
  const [stockItems, setStockItems] = useState<DispensaryStockItem[]>(INITIAL_DISPENSARY_STOCK);
  const [orders, setOrders] = useState<DispensaryOrder[]>(INITIAL_LIVE_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [syncedTime, setSyncedTime] = useState('11:42:19 EST');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMatchPrice = (itemId: string) => {
    setStockItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, yourPrice: item.metroLow };
      }
      return item;
    }));
    showToast('Competitive price matched to Metro Lowest Generic rate ($' + stockItems.find(i => i.id === itemId)?.metroLow.toFixed(2) + ')');
  };

  const handleDispatchOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, isDispatched: true, trackingId: 'TRK-' + Math.floor(100000 + Math.random() * 900000) };
      }
      return order;
    }));
    showToast(`Order ${orderId} dispatched to courier. Patient notified.`);
  };

  const handleSyncTerminal = () => {
    const now = new Date();
    setSyncedTime(now.toLocaleTimeString() + ' EST');
    showToast('Terminal synchronized with State Prescription Monitoring Program (PMP)');
  };

  const filteredStock = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#006b53] text-[#ffffff] px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#79f9d0]/30 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[20px] text-[#79f9d0]">check_circle</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Supervising Pharmacist */}
      <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md bg-[#006c4a]/10 text-[#006c4a] font-label-sm text-[11px] font-bold uppercase tracking-wider">
              Licensed Dispensary
            </span>
            <span className="font-code-num text-xs text-[#525f75]">
              DEA Reg: #BC-9920149 • NPI: 1992014920
            </span>
          </div>
          <h1 className="font-headline-md text-xl sm:text-2xl font-bold text-[#0b1c30]">
            CareFirst Pharmacy Network #402
          </h1>
          <p className="font-body-sm text-xs sm:text-sm text-[#525f75]">
            San Francisco Mission District Dispensary • Automated Formulary & Generic Substitution Terminal
          </p>
        </div>

        <div className="flex items-center gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#e5eeff]">
          <div className="flex items-center gap-3 bg-[#eff4ff] px-3.5 py-2 rounded-xl border border-[#dce9ff]">
            <img
              src={ASSETS.pharmacistMarcus}
              alt="Pharmacist Marcus Vance"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00a884]/30"
            />
            <div>
              <p className="font-label-md text-xs font-bold text-[#0b1c30]">
                Marcus Vance, PharmD
              </p>
              <p className="font-label-sm text-[11px] text-[#006c4a] font-medium">
                Lic #PH-88912 • On Duty
              </p>
            </div>
          </div>
          <button
            onClick={handleSyncTerminal}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#006b53] hover:bg-[#00513e] text-[#ffffff] rounded-xl font-label-md text-xs font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
            <span className="hidden sm:inline">Sync Terminal</span>
          </button>
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5eeff] shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center justify-between text-[#525f75]">
            <span className="font-label-md text-xs uppercase tracking-wider">Dispensary Revenue</span>
            <span className="material-symbols-outlined text-[#006c4a] text-[20px]">payments</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-md text-2xl font-bold text-[#0b1c30]">$4,892.40</span>
            <span className="font-label-sm text-xs font-bold text-[#006c4a] bg-[#006c4a]/10 px-2 py-0.5 rounded-full">
              +12.4%
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-[#525f75]">vs 7-day rolling median baseline</p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5eeff] shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center justify-between text-[#525f75]">
            <span className="font-label-md text-xs uppercase tracking-wider">Dispensed Scripts</span>
            <span className="material-symbols-outlined text-[#006b53] text-[20px]">receipt_long</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-md text-2xl font-bold text-[#0b1c30]">142 Rx</span>
            <span className="font-label-sm text-xs font-bold text-[#006b53] bg-[#79f9d0]/30 px-2 py-0.5 rounded-full">
              88.7% Generic
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-[#525f75]">DAW-0 substitution protocol</p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5eeff] shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center justify-between text-[#525f75]">
            <span className="font-label-md text-xs uppercase tracking-wider">Patient Savings Delta</span>
            <span className="material-symbols-outlined text-[#2aa779] text-[20px]">savings</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-md text-2xl font-bold text-[#006c4a]">-$1,418.00</span>
            <span className="font-label-sm text-xs font-bold text-[#006c4a] bg-[#006c4a]/10 px-2 py-0.5 rounded-full">
              Matched
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-[#525f75]">Direct out-of-pocket patient savings</p>
        </div>

        {/* Card 4 */}
        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5eeff] shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center justify-between text-[#525f75]">
            <span className="font-label-md text-xs uppercase tracking-wider">Cold Storage Vault</span>
            <span className="material-symbols-outlined text-[#525f75] text-[20px]">ac_unit</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-headline-md text-2xl font-bold text-[#0b1c30]">4.2°C</span>
            <span className="font-label-sm text-xs font-bold text-[#006c4a] bg-[#006c4a]/10 px-2 py-0.5 rounded-full">
              Nominal
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-[#525f75]">Pod 04 Active • Humidity 44%</p>
        </div>
      </div>

      {/* Two Main Columns: Dispensary Stock & Inbound Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Dispensary Inventory & Competitive Pricing (7 cols) */}
        <div className="lg:col-span-7 bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#e5eeff]">
            <div>
              <h2 className="font-headline-sm text-base sm:text-lg font-bold text-[#0b1c30]">
                Dispensary Formulary & Price-Match Matrix
              </h2>
              <p className="font-body-sm text-xs text-[#525f75]">
                Real-time wholesale benchmark against Metro Area generic lows
              </p>
            </div>
            {/* Search filter */}
            <div className="relative w-full sm:w-56">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#525f75] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search stock..."
                className="w-full h-8 pl-8 pr-3 bg-[#eff4ff] rounded-lg text-xs text-[#0b1c30] placeholder:text-[#525f75] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e5eeff] text-[#525f75] font-label-sm">
                  <th className="py-2.5 px-3">Medication & Formulation</th>
                  <th className="py-2.5 px-3">In-Stock</th>
                  <th className="py-2.5 px-3">Your Price</th>
                  <th className="py-2.5 px-3">Metro Low</th>
                  <th className="py-2.5 px-3 text-right">Arbitrage Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eff4ff]">
                {filteredStock.map((item) => {
                  const isMatching = item.yourPrice === item.metroLow;
                  return (
                    <tr key={item.id} className="hover:bg-[#eff4ff]/60 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-semibold text-[#0b1c30]">{item.name}</p>
                        <p className="text-[11px] text-[#525f75]">{item.genericName} • {item.formulation}</p>
                        <span className="font-code-num text-[10px] text-[#525f75]">{item.batchNumber} • Exp {item.expiryDate}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 font-semibold ${item.isLowStock ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'}`}>
                          {item.inStockUnits} units
                          {item.isLowStock && (
                            <span className="material-symbols-outlined text-[14px]">warning</span>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#0b1c30]">
                        ${item.yourPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#006c4a] bg-[#006c4a]/10 px-2 py-0.5 rounded">
                          ${item.metroLow.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {isMatching ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#79f9d0]/30 text-[#00513e] font-semibold text-[11px]">
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                            Price Matched
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMatchPrice(item.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#006b53] hover:bg-[#00513e] text-[#ffffff] rounded-md font-semibold text-[11px] shadow-sm transition-all"
                          >
                            <span className="material-symbols-outlined text-[14px]">price_check</span>
                            Match (${item.metroLow.toFixed(2)})
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#e5eeff] text-xs text-[#525f75]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006c4a]"></span>
              Formulary sync active ({syncedTime})
            </span>
            <span>Showing {filteredStock.length} formulary line items</span>
          </div>
        </div>

        {/* Right Column: Inbound Orders & Vault Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Inbound Orders Queue */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
                  Live Inbound E-Prescriptions
                </h3>
                <p className="font-body-sm text-xs text-[#525f75]">
                  Automated substitution verified & ready for dispatch
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#00a884] text-[#ffffff] font-bold text-xs">
                {orders.filter(o => !o.isDispatched).length} Ready
              </span>
            </div>

            {/* Orders list */}
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    order.isDispatched
                      ? 'bg-[#eff4ff]/50 border-[#dce9ff] opacity-75'
                      : 'bg-[#f8f9ff] border-[#e5eeff] hover:border-[#00a884]/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-[#0b1c30]">{order.orderNumber}</span>
                    <span className="px-2 py-0.5 bg-[#d6e3fe] text-[#0e1c2f] font-semibold rounded text-[11px]">
                      {order.type} • {order.timeSlot}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#525f75] mb-2">
                    {order.doctorRxNumber} by <span className="font-semibold text-[#0b1c30]">{order.doctorName}</span> ({order.doctorSpecialty})
                  </p>

                  <div className="space-y-1 mb-2 bg-[#ffffff] p-2 rounded-lg border border-[#e5eeff] text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-[#3d4a44]">{item.name}</span>
                        <span className="font-bold text-[#0b1c30]">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#006c4a] font-semibold">
                      Patient Saved ${order.patientSavings.toFixed(2)}
                    </span>
                    <span className="font-bold text-[#0b1c30] text-sm">
                      Total: ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#e5eeff] flex items-center justify-between">
                    {order.isDispatched ? (
                      <div className="flex items-center gap-1.5 text-xs text-[#006c4a] font-bold">
                        <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                        Dispatched ({order.trackingId})
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDispatchOrder(order.id)}
                        className="w-full py-1.5 px-3 bg-[#006b53] hover:bg-[#00513e] text-[#ffffff] rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">send</span>
                        Dispense & Handover to Courier
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automated Vault & Cold Chain Telemetry */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-base font-bold text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c4a]">inventory_2</span>
                Automated Storage Vault
              </h3>
              <span className="px-2 py-0.5 rounded bg-[#79f9d0]/30 text-[#00513e] font-bold text-[11px]">
                FDA 21 CFR Compliant
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-[#e5eeff] aspect-video">
              <img
                src={ASSETS.pharmacyVault}
                alt="Automated Pharmacy Storage Cleanroom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                <p className="font-bold text-xs">Cleanroom Robotics Pod 04</p>
                <p className="text-[11px] text-gray-200">ISO Class 7 • High-density automated dispensing carousel</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-[#eff4ff] rounded-lg">
                <span className="text-[#525f75] text-[10px] block">TEMP SENSOR</span>
                <span className="font-bold text-[#006c4a] text-sm">4.2°C</span>
              </div>
              <div className="p-2 bg-[#eff4ff] rounded-lg">
                <span className="text-[#525f75] text-[10px] block">AIR EXCHANGES</span>
                <span className="font-bold text-[#0b1c30] text-sm">18 / hr</span>
              </div>
              <div className="p-2 bg-[#eff4ff] rounded-lg">
                <span className="text-[#525f75] text-[10px] block">FAILOVER BATTERY</span>
                <span className="font-bold text-[#006c4a] text-sm">100% (48h)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
