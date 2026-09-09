import React, { useState } from 'react';
import { ASSETS, INITIAL_DISPENSARY_STOCK, INITIAL_LIVE_ORDERS, DEFAULT_USERS } from '../../data/mockData';
import { DispensaryStockItem, DispensaryOrder, UserProfile } from '../../types';
import { PharmacyDispensaryAuth } from '../auth/PharmacyDispensaryAuth';

interface DispensaryMatrixViewProps {
  currentUser?: UserProfile | null;
  onLoginSuccess?: (user: UserProfile) => void;
  onConsultAi?: (query: string) => void;
}

export const DispensaryMatrixView: React.FC<DispensaryMatrixViewProps> = ({
  currentUser: initialUser,
  onLoginSuccess,
  onConsultAi
}) => {
  const [stockItems, setStockItems] = useState<DispensaryStockItem[]>(INITIAL_DISPENSARY_STOCK);
  const [orders, setOrders] = useState<DispensaryOrder[]>(INITIAL_LIVE_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'PENDING' | 'DISPATCHED'>('ALL');
  const [syncedTime, setSyncedTime] = useState('11:42:19 EST');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [activePharmacist, setActivePharmacist] = useState<UserProfile>(
    initialUser?.role === 'pharmacist' ? initialUser : DEFAULT_USERS.pharmacist
  );

  // New stock item form state
  const [newStock, setNewStock] = useState({
    name: '',
    genericName: '',
    formulation: 'Oral Tablet',
    inStockUnits: 100,
    yourPrice: 15.00,
    metroLow: 12.50,
    batchNumber: 'LOT-' + Math.floor(1000 + Math.random() * 9000),
    expiryDate: '12/28',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePharmacyAuthSuccess = (u: UserProfile) => {
    setActivePharmacist(u);
    if (onLoginSuccess) onLoginSuccess(u);
    setShowAuthModal(false);
    showToast(`Dispensary authenticated: ${u.organization || 'CareFirst Pharmacy'} (${u.name})`);
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

  const handleAdjustStock = (itemId: string, delta: number) => {
    setStockItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedUnits = Math.max(0, item.inStockUnits + delta);
        return {
          ...item,
          inStockUnits: updatedUnits,
          isLowStock: updatedUnits < 50
        };
      }
      return item;
    }));
    showToast(`Inventory updated for ${stockItems.find(i => i.id === itemId)?.name}`);
  };

  const handleReorderItem = (item: DispensaryStockItem) => {
    const poNumber = 'PO-2026-' + Math.floor(1000 + Math.random() * 9000);
    setStockItems(prev => prev.map(i => {
      if (i.id === item.id) {
        return { ...i, inStockUnits: i.inStockUnits + 250, isLowStock: false };
      }
      return i;
    }));
    showToast(`Wholesale Purchase Order ${poNumber} created: 250 units of ${item.genericName} dispatched to cleanroom.`);
  };

  const handleCreateStockItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStock.name.trim() || !newStock.genericName.trim()) {
      showToast('Please enter both medicine name and generic active ingredient.');
      return;
    }
    const newItem: DispensaryStockItem = {
      id: 'stock-' + Date.now(),
      name: newStock.name,
      genericName: newStock.genericName,
      formulation: newStock.formulation,
      inStockUnits: Number(newStock.inStockUnits),
      isLowStock: Number(newStock.inStockUnits) < 50,
      yourPrice: Number(newStock.yourPrice),
      metroLow: Number(newStock.metroLow),
      batchNumber: newStock.batchNumber,
      expiryDate: newStock.expiryDate
    };
    setStockItems(prev => [newItem, ...prev]);
    setShowAddStockModal(false);
    showToast(`Added ${newItem.genericName} to active dispensary formulary.`);
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

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'PENDING') return !o.isDispatched;
    if (orderFilter === 'DISPATCHED') return o.isDispatched;
    return true;
  });

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

        <div className="flex items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#e5eeff] flex-wrap">
          <div className="flex items-center gap-3 bg-[#eff4ff] px-3.5 py-2 rounded-xl border border-[#dce9ff]">
            <img
              src={activePharmacist.avatar || ASSETS.pharmacistMarcus}
              alt={activePharmacist.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#00a884]/30"
            />
            <div>
              <p className="font-label-md text-xs font-bold text-[#0b1c30]">
                {activePharmacist.name}
              </p>
              <p className="font-label-sm text-[11px] text-[#006c4a] font-medium">
                {activePharmacist.licenseOrNpi || 'Lic #PH-88912'} • On Duty
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#ffffff] hover:bg-[#eff4ff] text-[#006b53] border border-[#006b53]/30 rounded-xl font-label-md text-xs font-semibold shadow-xs transition-colors"
            title="Dispensary Terminal Login & Registration"
          >
            <span className="material-symbols-outlined text-[16px]">passkey</span>
            <span>Switch / Register Branch</span>
          </button>

          <button
            onClick={handleSyncTerminal}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#006b53] hover:bg-[#00513e] text-[#ffffff] rounded-xl font-label-md text-xs font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
            <span className="hidden sm:inline">Sync Terminal</span>
          </button>
        </div>
      </div>

      {/* Pharmacy Dispensary Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <PharmacyDispensaryAuth
              onSuccess={handlePharmacyAuthSuccess}
              onClose={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      )}

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
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search filter */}
              <div className="relative flex-1 sm:w-48">
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

              {/* Add Stock Item Button */}
              <button
                onClick={() => setShowAddStockModal(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#006b53] hover:bg-[#00513e] text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-xs"
                title="Add New Generic Medicine to Stock"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span className="hidden sm:inline">Add Generic Stock</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e5eeff] text-[#525f75] font-label-sm">
                  <th className="py-2.5 px-3">Medication & Formulation</th>
                  <th className="py-2.5 px-3">In-Stock & Adjustment</th>
                  <th className="py-2.5 px-3">Your Price</th>
                  <th className="py-2.5 px-3">Metro Low</th>
                  <th className="py-2.5 px-3 text-right">Arbitrage & Clinical</th>
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
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1 font-semibold ${item.isLowStock ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'}`}>
                            {item.inStockUnits} units
                            {item.isLowStock && (
                              <span className="material-symbols-outlined text-[14px]">warning</span>
                            )}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleAdjustStock(item.id, -10)}
                              className="w-5 h-5 rounded bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-bold text-xs flex items-center justify-center transition-colors"
                              title="Decrease stock by 10"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleAdjustStock(item.id, 10)}
                              className="w-5 h-5 rounded bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-bold text-xs flex items-center justify-center transition-colors"
                              title="Increase stock by 10"
                            >
                              +
                            </button>
                            {item.isLowStock && (
                              <button
                                onClick={() => handleReorderItem(item)}
                                className="px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab] font-bold text-[10px] transition-colors"
                                title="One-click wholesale purchase order"
                              >
                                Reorder PO
                              </button>
                            )}
                          </div>
                        </div>
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
                        <div className="flex flex-col items-end gap-1.5">
                          {isMatching ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#79f9d0]/30 text-[#00513e] font-semibold text-[11px]">
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

                          {onConsultAi && (
                            <button
                              onClick={() => onConsultAi(`Provide clinical bioequivalence, therapeutic class, and cost arbitrage savings analysis for generic ${item.genericName} vs brand ${item.name}.`)}
                              className="inline-flex items-center gap-1 text-[11px] text-[#006b53] hover:text-[#00513e] font-semibold"
                              title="Consult AI Drug Assistant on this formulation"
                            >
                              <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                              <span>Clinical AI</span>
                            </button>
                          )}
                        </div>
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
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
                  Live Inbound E-Prescriptions
                </h3>
                <p className="font-body-sm text-xs text-[#525f75]">
                  Automated substitution verified & ready for dispatch
                </p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center bg-[#eff4ff] p-0.5 rounded-lg text-[11px] font-bold">
                {(['ALL', 'PENDING', 'DISPATCHED'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-2 py-1 rounded-md transition-all ${
                      orderFilter === filter
                        ? 'bg-[#006b53] text-white shadow-xs'
                        : 'text-[#525f75] hover:text-[#0b1c30]'
                    }`}
                  >
                    {filter === 'ALL' ? 'All' : filter === 'PENDING' ? 'Pending' : 'Dispatched'}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders list */}
            <div className="space-y-3">
              {filteredOrders.map((order) => (
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
              {filteredOrders.length === 0 && (
                <div className="p-6 text-center text-xs text-[#525f75] bg-[#f8f9ff] rounded-xl border border-dashed border-[#e5eeff]">
                  No orders match this status filter.
                </div>
              )}
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

      {/* Add Generic Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border border-[#e5eeff]">
            <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0b1c30]">Add Generic Stock to Formulary</h3>
                <p className="text-xs text-[#525f75]">Register new generic equivalent to dispensary matrix</p>
              </div>
              <button
                onClick={() => setShowAddStockModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateStockItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Brand Name Reference (e.g. Lipitor 20mg)</label>
                <input
                  type="text"
                  required
                  value={newStock.name}
                  onChange={e => setNewStock({ ...newStock, name: e.target.value })}
                  placeholder="Lipitor 20mg Tab"
                  className="w-full h-9 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#006b53]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Generic Active Ingredient (e.g. Atorvastatin Calcium 20mg)</label>
                <input
                  type="text"
                  required
                  value={newStock.genericName}
                  onChange={e => setNewStock({ ...newStock, genericName: e.target.value })}
                  placeholder="Atorvastatin Calcium 20mg"
                  className="w-full h-9 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#006b53]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Formulation</label>
                  <select
                    value={newStock.formulation}
                    onChange={e => setNewStock({ ...newStock, formulation: e.target.value })}
                    className="w-full h-9 px-2 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#006b53]"
                  >
                    <option value="Oral Tablet">Oral Tablet</option>
                    <option value="Oral Capsule">Oral Capsule</option>
                    <option value="Extended-Release Tablet">Extended-Release Tablet</option>
                    <option value="Oral Solution">Oral Solution</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Initial In-Stock Units</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newStock.inStockUnits}
                    onChange={e => setNewStock({ ...newStock, inStockUnits: Number(e.target.value) })}
                    className="w-full h-9 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#006b53]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Your Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    required
                    value={newStock.yourPrice}
                    onChange={e => setNewStock({ ...newStock, yourPrice: Number(e.target.value) })}
                    className="w-full h-9 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#006b53]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Metro Low Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    required
                    value={newStock.metroLow}
                    onChange={e => setNewStock({ ...newStock, metroLow: Number(e.target.value) })}
                    className="w-full h-9 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#006b53]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Batch / Lot #</label>
                  <input
                    type="text"
                    required
                    value={newStock.batchNumber}
                    onChange={e => setNewStock({ ...newStock, batchNumber: e.target.value })}
                    className="w-full h-9 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#006b53]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Expiry Date (MM/YY)</label>
                  <input
                    type="text"
                    required
                    value={newStock.expiryDate}
                    onChange={e => setNewStock({ ...newStock, expiryDate: e.target.value })}
                    className="w-full h-9 px-3 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none focus:ring-1 focus:ring-[#006b53]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eff4ff]">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#525f75] hover:bg-[#eff4ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#006b53] hover:bg-[#00513e] text-white shadow-sm"
                >
                  Save to Dispensary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
