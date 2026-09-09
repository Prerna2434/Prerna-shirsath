import React, { useState } from 'react';
import { ASSETS, COMPETING_PHARMACIES, DEFAULT_USERS } from '../../data/mockData';
import { UserProfile } from '../../types';
import { MobileScanner } from './MobileScanner';
import { PatientAuth } from '../auth/PatientAuth';

interface PatientMobileAppProps {
  currentUser?: UserProfile | null;
  onLoginSuccess?: (user: UserProfile) => void;
  onLogout?: () => void;
}

export const PatientMobileApp: React.FC<PatientMobileAppProps> = ({
  currentUser: parentUser,
  onLoginSuccess,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'compare' | 'scanner' | 'orders' | 'profile'>('home');
  const [localUser, setLocalUser] = useState<UserProfile | null>(parentUser || DEFAULT_USERS.patient);
  const currentUser = parentUser !== undefined ? parentUser : localUser;

  const [selectedDosage, setSelectedDosage] = useState<'10mg' | '20mg' | '40mg' | '80mg'>('20mg');
  const [selectedQuantity, setSelectedQuantity] = useState<'30' | '90'>('30');
  const [selectedPharmacyRank, setSelectedPharmacyRank] = useState<number>(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');
  const [showFaq, setShowFaq] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handlePatientAuthSuccess = (u: UserProfile) => {
    setLocalUser(u);
    if (onLoginSuccess) onLoginSuccess(u);
    setShowAuthModal(false);
  };

  const categories = ['All', 'Cholesterol', 'Blood Pressure', 'Diabetes', 'Antibiotics', 'Anxiety'];

  const allTrendingDrops = [
    { name: 'Rosuvastatin 10mg', brand: 'Crestor', orig: 118.50, generic: 14.20, drop: '88%', category: 'Cholesterol' },
    { name: 'Atorvastatin 20mg', brand: 'Lipitor', orig: 88.00, generic: 9.20, drop: '90%', category: 'Cholesterol' },
    { name: 'Metformin ER 500mg', brand: 'Glucophage XR', orig: 72.00, generic: 7.20, drop: '90%', category: 'Diabetes' },
    { name: 'Sertraline HCl 50mg', brand: 'Zoloft', orig: 65.00, generic: 9.80, drop: '85%', category: 'Anxiety' },
    { name: 'Amlodipine 5mg', brand: 'Norvasc', orig: 54.00, generic: 6.10, drop: '89%', category: 'Blood Pressure' },
    { name: 'Amoxicillin 500mg', brand: 'Amoxil', orig: 42.00, generic: 5.40, drop: '87%', category: 'Antibiotics' },
    { name: 'Escitalopram 10mg', brand: 'Lexapro', orig: 82.00, generic: 8.50, drop: '90%', category: 'Anxiety' },
    { name: 'Lisinopril 10mg', brand: 'Prinivil', orig: 48.00, generic: 4.80, drop: '90%', category: 'Blood Pressure' },
  ];

  const filteredTrendingDrops = allTrendingDrops.filter(drop => {
    const matchesCategory = selectedCategory === 'All' || drop.category === selectedCategory;
    const matchesSearch = drop.name.toLowerCase().includes(mobileSearchTerm.toLowerCase()) ||
                          drop.brand.toLowerCase().includes(mobileSearchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (activeTab === 'scanner') {
    return (
      <div className="p-4 flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <MobileScanner
          onBack={() => setActiveTab('home')}
          onProceedToCompare={() => setActiveTab('compare')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-[#ffffff] min-h-[750px] rounded-3xl shadow-2xl overflow-hidden border border-[#e5eeff] flex flex-col relative">
      {/* Top Mobile App Header */}
      <div className="bg-[#ffffff] px-4 pt-4 pb-3 border-b border-[#eff4ff] flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <img
            src={ASSETS.mobileLogo}
            alt="GeneticMedicine logo"
            className="w-8 h-8 rounded-full object-contain bg-[#eff4ff] p-1"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#525f75] uppercase font-bold tracking-wider">
                Deliver to
              </span>
              <span className="material-symbols-outlined text-[14px] text-[#525f75]">expand_more</span>
            </div>
            <p className="font-bold text-xs text-[#0b1c30] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#006b53]">location_on</span>
              94107 • San Francisco, CA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('scanner')}
            className="p-1.5 rounded-full bg-[#eff4ff] text-[#006b53] hover:bg-[#dce9ff] transition-colors"
            title="Scan Prescription"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-1 p-0.5 rounded-full ring-2 ring-[#006b53]/30 hover:opacity-90 transition-opacity"
            title="Patient Account / Sign In"
          >
            <img
              src={currentUser?.avatar || DEFAULT_USERS.patient.avatar}
              alt="Patient Profile"
              className="w-7 h-7 rounded-full object-cover"
            />
          </button>

          <div className="relative p-1 text-[#525f75]">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
          </div>
        </div>
      </div>

      {/* Screen 1: Patient Home View */}
      {activeTab === 'home' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20">
          {/* Fast-Track Prescription Card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#006b53] to-[#004d3b] p-4 text-white shadow-lg overflow-hidden">
            <div className="relative z-10 space-y-2 max-w-[70%]">
              <span className="px-2 py-0.5 rounded bg-[#79f9d0]/30 text-[#79f9d0] text-[10px] font-bold uppercase tracking-wider">
                Prescription Fast Track
              </span>
              <h2 className="font-bold text-base leading-tight">
                Have a paper or digital prescription?
              </h2>
              <p className="text-xs text-gray-200">
                Instantly scan to unlock wholesale generic pricing and save up to 90%.
              </p>
              <button
                onClick={() => setActiveTab('scanner')}
                className="mt-1 px-3.5 py-1.5 bg-[#79f9d0] hover:bg-[#59dcb5] text-[#002117] font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">document_scanner</span>
                <span>Upload & Scan Rx</span>
              </button>
            </div>

            {/* Decorative pill circle */}
            <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[64px] text-white/20">
                medication
              </span>
            </div>
          </div>

          {/* Search Bar with Microphone & Scanner */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#525f75] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={mobileSearchTerm}
              onChange={(e) => setMobileSearchTerm(e.target.value)}
              placeholder="Search generic medicine or brand name..."
              className="w-full h-10 pl-9 pr-16 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] placeholder:text-[#525f75] focus:outline-none focus:ring-1 focus:ring-[#00a884]"
            />
            <div className="absolute right-2 flex items-center gap-1 text-[#525f75]">
              <button
                type="button"
                className="p-1 hover:text-[#0b1c30]"
                title="Voice search"
              >
                <span className="material-symbols-outlined text-[16px]">mic</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('scanner')}
                className="p-1 hover:text-[#006b53]"
                title="Camera scan"
              >
                <span className="material-symbols-outlined text-[16px]">barcode_scanner</span>
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#006b53] text-white'
                    : 'bg-[#eff4ff] text-[#525f75] hover:bg-[#e5eeff]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Arbitrage Spotlight: Lipitor vs Generic Atorvastatin */}
          <div className="p-4 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-[#006c4a] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                Arbitrage Spotlight
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#006c4a]/10 text-[#006c4a] font-bold text-[10px]">
                FDA AB-Rated
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#0b1c30]">
                Atorvastatin Calcium 20mg (30 ct)
              </h3>
              <p className="text-xs text-[#525f75]">
                Exact generic bioequivalent to brand-name <span className="font-semibold text-[#0b1c30]">Lipitor</span>
              </p>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-lg font-bold text-[#006c4a]">$9.20</span>
                <span className="text-xs text-[#ba1a1a] line-through ml-2">$88.00 Brand</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#79f9d0]/40 text-[#00513e] font-bold text-xs">
                Save $78.80 (-89%)
              </span>
            </div>

            <button
              onClick={() => setActiveTab('compare')}
              className="w-full py-2 bg-[#006b53] hover:bg-[#00513e] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Compare Local Pharmacy Rates</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Verified Community Savings Stats Card */}
          <div className="bg-[#eff4ff] p-3.5 rounded-2xl border border-[#dce9ff] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#525f75] uppercase font-bold">Community Impact</span>
              <p className="font-bold text-base text-[#006c4a]">$8,914,200 Saved</p>
              <p className="text-[11px] text-[#525f75]">412,800+ Prescriptions matched</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end text-amber-500">
                <span className="material-symbols-outlined text-[16px] fill-1">star</span>
                <span className="font-bold text-xs text-[#0b1c30]">4.9</span>
              </div>
              <p className="text-[10px] text-[#525f75]">28,400+ reviews</p>
            </div>
          </div>

          {/* Trending Price Drops Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0b1c30]">
                Trending Price Drops (San Francisco)
              </h4>
              <span className="text-[11px] text-[#006b53] font-semibold">See All</span>
            </div>

            <div className="space-y-2">
              {filteredTrendingDrops.map((drop, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTab('compare')}
                  className="p-3 bg-white rounded-xl border border-[#e5eeff] flex items-center justify-between hover:border-[#00a884] cursor-pointer transition-colors"
                >
                  <div>
                    <p className="font-bold text-xs text-[#0b1c30]">{drop.name}</p>
                    <p className="text-[11px] text-[#525f75]">Brand: {drop.brand} • <span className="text-[#006b53] font-medium">{drop.category}</span></p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-xs text-[#525f75] line-through">${drop.orig.toFixed(2)}</span>
                      <span className="font-bold text-xs text-[#006c4a]">${drop.generic.toFixed(2)}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#006c4a]">Save {drop.drop}</span>
                  </div>
                </div>
              ))}
              {filteredTrendingDrops.length === 0 && (
                <div className="p-4 text-center text-xs text-[#525f75] bg-[#eff4ff] rounded-xl">
                  No generic medications match "{mobileSearchTerm}".
                </div>
              )}
            </div>
          </div>

          {/* Clinical Guarantee Seal */}
          <div className="text-center py-2 space-y-1">
            <div className="flex items-center justify-center gap-1 text-[#006c4a]">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span className="font-bold text-[11px] uppercase tracking-wider">Clinical Guarantee</span>
            </div>
            <p className="text-[10px] text-[#525f75]">
              Licensed U.S. Pharmacies Only • FDA Therapeutic Equivalence • Safe Same-Day Courier Delivery
            </p>
          </div>
        </div>
      )}

      {/* Screen 2: Medicine Comparison & Pharmacy Selection */}
      {activeTab === 'compare' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
          {/* Header row with back button */}
          <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
            <button
              onClick={() => setActiveTab('home')}
              className="p-1 rounded-full text-[#525f75] hover:text-[#0b1c30] hover:bg-[#eff4ff]"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <span className="font-bold text-xs text-[#0b1c30]">Price Comparison</span>
            <div className="flex items-center gap-2 text-[#525f75]">
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span className="material-symbols-outlined text-[18px]">favorite_border</span>
            </div>
          </div>

          {/* Drug Overview */}
          <div className="space-y-1">
            <span className="px-2 py-0.5 rounded bg-[#006c4a]/10 text-[#006c4a] text-[10px] font-bold uppercase tracking-wider">
              FDA AB-Rated Generic
            </span>
            <h2 className="font-bold text-lg text-[#0b1c30]">Atorvastatin Calcium</h2>
            <p className="text-xs text-[#525f75]">
              Generic for <span className="font-semibold text-[#0b1c30]">Lipitor</span> • Oral Tablet
            </p>
          </div>

          {/* Dosage Selector Pills */}
          <div>
            <label className="text-[11px] font-bold text-[#525f75] uppercase block mb-1">
              Select Strength:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['10mg', '20mg', '40mg', '80mg'] as const).map(dosage => (
                <button
                  key={dosage}
                  onClick={() => setSelectedDosage(dosage)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedDosage === dosage
                      ? 'bg-[#006b53] text-white shadow-xs'
                      : 'bg-[#eff4ff] text-[#3d4a44] hover:bg-[#e5eeff]'
                  }`}
                >
                  {dosage}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#525f75] uppercase block mb-1">
              Quantity:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedQuantity('30')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  selectedQuantity === '30'
                    ? 'border-[#006b53] bg-[#eff4ff]/60'
                    : 'border-[#e5eeff] bg-white'
                }`}
              >
                <span className="font-bold block text-[#0b1c30]">30 Tablets (1 Month)</span>
                <span className="text-[11px] text-[#525f75]">Standard prescription size</span>
              </button>

              <button
                onClick={() => setSelectedQuantity('90')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  selectedQuantity === '90'
                    ? 'border-[#006b53] bg-[#eff4ff]/60'
                    : 'border-[#e5eeff] bg-white'
                }`}
              >
                <span className="font-bold block text-[#0b1c30]">90 Tablets (3 Months)</span>
                <span className="text-[11px] text-[#006c4a] font-semibold">Save extra 15%</span>
              </button>
            </div>
          </div>

          {/* Platform Best Rate Banner */}
          <div className="p-3 bg-[#006c4a]/10 rounded-2xl border border-[#006c4a]/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#006c4a] uppercase font-bold">Lowest Network Rate</span>
              <p className="font-bold text-lg text-[#006c4a]">
                ${selectedQuantity === '30' ? '9.20' : '23.40'}
              </p>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 bg-[#79f9d0] text-[#002117] font-bold text-xs rounded-lg">
                90% OFF
              </span>
              <p className="text-[10px] text-[#525f75] mt-0.5">Brand ref: $88.00</p>
            </div>
          </div>

          {/* Ranked Competing Pharmacies List */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#0b1c30]">
              Ranked Local Pharmacies (Near 94107)
            </h3>

            {COMPETING_PHARMACIES.map(pharmacy => {
              const isSelected = selectedPharmacyRank === pharmacy.rank;
              return (
                <div
                  key={pharmacy.rank}
                  onClick={() => setSelectedPharmacyRank(pharmacy.rank)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#006b53] bg-[#eff4ff]/70 ring-1 ring-[#006b53]'
                      : 'border-[#e5eeff] bg-white hover:border-[#00a884]/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          isSelected ? 'bg-[#006b53] text-white' : 'bg-[#e5eeff] text-[#525f75]'
                        }`}>
                          {pharmacy.rank}
                        </span>
                        <h4 className="font-bold text-xs text-[#0b1c30]">{pharmacy.name}</h4>
                        <div className="flex items-center gap-0.5 text-[10px] text-amber-500">
                          <span className="material-symbols-outlined text-[12px] fill-1">star</span>
                          <span className="font-bold text-[#0b1c30]">{pharmacy.rating}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#525f75] mt-0.5">
                        {pharmacy.distanceOrCarrier} • {pharmacy.fulfillmentSla}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-[#0b1c30]">
                        ${pharmacy.patientPrice.toFixed(2)}
                      </span>
                      {pharmacy.savingsDollars > 5 && (
                        <p className="text-[10px] font-bold text-[#006c4a]">
                          Save ${pharmacy.savingsDollars.toFixed(0)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pharmacokinetic Bioequivalence Match Accordion */}
          <div className="border border-[#e5eeff] rounded-2xl p-3.5 space-y-2 bg-[#f8f9ff]">
            <button
              onClick={() => setShowFaq(!showFaq)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c4a] text-[18px]">biotech</span>
                <span className="font-bold text-xs text-[#0b1c30]">Pharmacokinetic Bioequivalence Curve</span>
              </div>
              <span className="material-symbols-outlined text-[#525f75] text-[18px]">
                {showFaq ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showFaq && (
              <div className="pt-2 text-xs text-[#525f75] space-y-2 border-t border-[#e5eeff]">
                <p>
                  FDA Orange Book Code: <span className="font-bold text-[#0b1c30]">AB</span> (Therapeutically Equivalent).
                  Active pharmaceutical ingredient, dosage form, strength, and dissolution bioavailability strictly match the reference listed drug (Lipitor).
                </p>
                <div className="p-2 bg-white rounded-lg border border-[#e5eeff] text-[11px]">
                  <p className="font-semibold text-[#0b1c30]">Bioavailability Metrics:</p>
                  <p>AUC (0-inf) Ratio: 99.4% (FDA standard: 80-125%)</p>
                  <p>Cmax Ratio: 98.8% • Peak Tmax: 1.5 hours</p>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Bar for Checkout */}
          <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white border-t border-[#e5eeff] p-4 flex items-center justify-between shadow-2xl z-30">
            <div>
              <span className="text-[10px] text-[#525f75] uppercase font-bold">Total Price</span>
              <p className="font-bold text-lg text-[#006c4a]">
                ${selectedQuantity === '30' ? '9.20' : '23.40'}
              </p>
              <span className="text-[10px] text-[#525f75]">Free Same-Day Courier</span>
            </div>

            <button
              onClick={() => {
                setOrderConfirmed(true);
                setTimeout(() => setOrderConfirmed(false), 4000);
              }}
              className="py-2.5 px-6 bg-[#006b53] hover:bg-[#00513e] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Proceed to Order</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Confirmation modal */}
          {orderConfirmed && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-xs text-center space-y-3 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-[#79f9d0]/40 text-[#006b53] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[28px]">check_circle</span>
                </div>
                <h3 className="font-bold text-base text-[#0b1c30]">Order Confirmed!</h3>
                <p className="text-xs text-[#525f75]">
                  Routed to Metro Health Central Rx. Your courier is being dispatched. Saved $78.80!
                </p>
                <button
                  onClick={() => {
                    setOrderConfirmed(false);
                    setActiveTab('orders');
                  }}
                  className="w-full py-2 bg-[#006b53] text-white rounded-xl text-xs font-bold"
                >
                  View My Orders
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Screen 3: Patient Orders View */}
      {activeTab === 'orders' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20">
          <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
            <h3 className="font-bold text-sm text-[#0b1c30]">Active & Past Prescriptions</h3>
            <span className="text-[11px] text-[#006b53] font-semibold">2 Active Deliveries</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff] space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#006c4a]/10 text-[#006c4a] text-[10px] font-bold uppercase">
                  Out For Delivery • 24 Min
                </span>
                <span className="text-xs font-bold text-[#0b1c30]">$9.20</span>
              </div>
              <div>
                <p className="font-bold text-xs text-[#0b1c30]">Atorvastatin Calcium 20mg (30 Tablets)</p>
                <p className="text-[11px] text-[#525f75]">Filled by Metro Health Central Rx • Courier: DoorDash Rx</p>
              </div>
              <div className="pt-2 border-t border-[#e5eeff] flex justify-between items-center text-[11px]">
                <span className="text-[#006c4a] font-semibold">Saved $78.80 vs Brand</span>
                <button
                  onClick={() => setActiveTab('home')}
                  className="text-[#006b53] font-bold hover:underline"
                >
                  Order Refill
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-[#f8f9ff] rounded-2xl border border-[#e5eeff] space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#525f75] text-[10px] font-bold uppercase">
                  Delivered • Sep 02
                </span>
                <span className="text-xs font-bold text-[#0b1c30]">$7.20</span>
              </div>
              <div>
                <p className="font-bold text-xs text-[#0b1c30]">Metformin ER 500mg (60 Tablets)</p>
                <p className="text-[11px] text-[#525f75]">Filled by CareFirst Pharmacy Hub #402</p>
              </div>
              <div className="pt-2 border-t border-[#e5eeff] flex justify-between items-center text-[11px]">
                <span className="text-[#006c4a] font-semibold">Saved $64.80 vs Brand</span>
                <span className="text-[#525f75]">Next refill in 18 days</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 4: Patient Profile & Authentication Screen */}
      {activeTab === 'profile' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20">
          {showAuthModal || !currentUser ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#525f75] uppercase">
                  Patient Portal Login / Register
                </span>
                {currentUser && (
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="text-xs text-[#006b53] font-semibold"
                  >
                    Back to Profile
                  </button>
                )}
              </div>
              <PatientAuth
                onSuccess={handlePatientAuthSuccess}
                onClose={() => setShowAuthModal(false)}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Authenticated Patient Card */}
              <div className="p-4 bg-gradient-to-br from-[#eff4ff] to-[#f8f9ff] rounded-2xl border border-[#dce9ff] space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#006b53]/30 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-[#0b1c30]">{currentUser.name}</h3>
                      <span className="px-2 py-0.2 rounded-full bg-[#006b53] text-white text-[9px] font-bold uppercase">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-[#525f75]">{currentUser.email}</p>
                    <p className="text-xs text-[#006c4a] font-semibold">{currentUser.phone || '(415) 555-0192'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#dce9ff] text-center">
                  <div className="p-2 bg-white rounded-xl border border-[#e5eeff]">
                    <span className="text-[10px] text-[#525f75] uppercase font-bold block">Lifetime Savings</span>
                    <span className="font-bold text-base text-[#006c4a]">$418.20</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-[#e5eeff]">
                    <span className="text-[10px] text-[#525f75] uppercase font-bold block">Generic Prescriptions</span>
                    <span className="font-bold text-base text-[#0b1c30]">4 Active</span>
                  </div>
                </div>
              </div>

              {/* Patient Details & Address */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#e5eeff] space-y-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-[10px] text-[#525f75] block">
                  Delivery Destination
                </span>
                <p className="font-semibold text-[#0b1c30] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#006b53]">home_pin</span>
                  {currentUser.address || '742 Mission St, Apt 4B, San Francisco, CA 94107'}
                </p>
                <p className="text-[11px] text-[#525f75]">
                  Insurance: {currentUser.insuranceProvider || 'BlueShield California (RxBIN: 004336)'}
                </p>
              </div>

              {/* Switch Account or Register Another Button */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full py-2.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006b53] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">switch_account</span>
                  <span>Sign In as Different Patient or Register New Account</span>
                </button>

                <button
                  onClick={() => {
                    setLocalUser(null);
                    if (onLogout) onLogout();
                    setShowAuthModal(true);
                  }}
                  className="w-full py-2 text-[#ba1a1a] hover:bg-[#ffdad6]/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Sign Out of Patient App</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="bg-white border-t border-[#eff4ff] h-16 px-6 flex items-center justify-between sticky bottom-0 z-20">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'home' ? 'text-[#006b53]' : 'text-[#525f75]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'compare' ? 'text-[#006b53]' : 'text-[#525f75]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">compare_arrows</span>
          <span className="text-[10px] font-semibold">Compare</span>
        </button>

        {/* Elevated Floating Scan Button */}
        <button
          onClick={() => setActiveTab('scanner')}
          className="w-12 h-12 -mt-6 rounded-full bg-[#006b53] text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          title="Smart Camera Scanner"
        >
          <span className="material-symbols-outlined text-[24px]">photo_camera</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'orders' ? 'text-[#006b53]' : 'text-[#525f75]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          <span className="text-[10px] font-semibold">Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'profile' ? 'text-[#006b53]' : 'text-[#525f75]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">person</span>
          <span className="text-[10px] font-semibold">Account</span>
        </button>
      </div>
    </div>
  );
};
