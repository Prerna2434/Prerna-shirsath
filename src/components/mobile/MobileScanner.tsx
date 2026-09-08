import React, { useState } from 'react';
import { ASSETS } from '../../data/mockData';

interface MobileScannerProps {
  onBack: () => void;
  onProceedToCompare: () => void;
}

export const MobileScanner: React.FC<MobileScannerProps> = ({
  onBack,
  onProceedToCompare
}) => {
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(true); // Default to showing the detection result like Image 19.png

  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanCompleted(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
    }, 1200);
  };

  return (
    <div className="relative min-h-[640px] max-w-md mx-auto bg-[#0b1c30] text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Header */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={onBack}
          className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="text-center">
          <p className="font-bold text-xs tracking-wider uppercase">Smart Scanner</p>
          <p className="text-[10px] text-gray-300">Align Rx within corners</p>
        </div>

        <button
          onClick={() => setIsTorchOn(!isTorchOn)}
          className={`p-2 backdrop-blur-md rounded-full transition-colors ${
            isTorchOn ? 'bg-amber-400 text-black' : 'bg-black/40 hover:bg-black/60 text-white'
          }`}
          title="Toggle Torch Light"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isTorchOn ? 'flash_on' : 'flash_off'}
          </span>
        </button>
      </div>

      {/* Camera Viewfinder Area */}
      <div className="relative flex-1 min-h-[360px] bg-black flex items-center justify-center overflow-hidden">
        {/* Viewfinder Background Image */}
        <img
          src={ASSETS.scannerFeedBg}
          alt="Prescription scanner live feed"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />

        {/* HUD Overlay with Corner Reticles */}
        <div className="absolute inset-8 border-2 border-dashed border-[#79f9d0]/70 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
          {/* Top Corners */}
          <div className="flex justify-between">
            <div className="w-5 h-5 border-t-3 border-l-3 border-[#79f9d0] rounded-tl"></div>
            <div className="w-5 h-5 border-t-3 border-r-3 border-[#79f9d0] rounded-tr"></div>
          </div>

          {/* Center Scan Laser Animation */}
          <div className="relative w-full h-0.5 bg-gradient-to-r from-transparent via-[#79f9d0] to-transparent shadow-[0_0_12px_#79f9d0] animate-pulse">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#006b53]/80 backdrop-blur-sm text-[9px] font-bold text-[#79f9d0]">
              {isScanning ? 'Extracting Optical Text...' : 'Optical OCR Ready'}
            </div>
          </div>

          {/* Bottom Corners */}
          <div className="flex justify-between">
            <div className="w-5 h-5 border-b-3 border-l-3 border-[#79f9d0] rounded-bl"></div>
            <div className="w-5 h-5 border-b-3 border-r-3 border-[#79f9d0] rounded-br"></div>
          </div>
        </div>

        {/* Live HUD Badges */}
        <div className="absolute top-16 inset-x-0 flex justify-center gap-2 pointer-events-none">
          <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-semibold text-[#79f9d0] flex items-center gap-1 border border-[#79f9d0]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#79f9d0] animate-ping"></span>
            Auto-Deskew Active
          </span>
          <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-semibold text-white/90 border border-white/20">
            Optimal Lighting
          </span>
        </div>

        {/* Shutter Capture Button */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center z-20">
          <button
            onClick={handleTriggerScan}
            disabled={isScanning}
            className="w-14 h-14 rounded-full border-4 border-white bg-[#00a884] hover:bg-[#006b53] active:scale-95 shadow-xl flex items-center justify-center transition-transform"
          >
            <span className="material-symbols-outlined text-[26px] text-white">
              photo_camera
            </span>
          </button>
        </div>
      </div>

      {/* AI Extraction Bottom Sheet / Summary */}
      {scanCompleted && (
        <div className="bg-[#ffffff] text-[#0b1c30] p-5 rounded-t-3xl shadow-2xl space-y-3 z-30">
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto -mt-1 mb-2"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c4a] text-[20px]">
                document_scanner
              </span>
              <span className="font-bold text-xs uppercase tracking-wider text-[#006c4a]">
                Prescription Verified • 99.2% Confidence
              </span>
            </div>
            <span className="px-2 py-0.5 bg-[#eff4ff] text-[#006b53] text-[10px] font-bold rounded">
              FDA AB-Rated
            </span>
          </div>

          {/* Detected details card */}
          <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff] space-y-1.5 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-[#525f75] uppercase font-bold">Detected Medicine:</p>
                <p className="font-bold text-sm text-[#0b1c30]">Lipitor 20mg Tab (90 ct)</p>
                <p className="text-[11px] text-[#525f75]">Dr. Marcus Thorne, MD • Patient: Robert Chen</p>
              </div>
              <span className="text-xs font-bold text-[#ba1a1a] line-through">$88.00</span>
            </div>

            <div className="pt-2 border-t border-[#dce9ff] flex justify-between items-center">
              <div>
                <span className="font-bold text-[#006c4a] text-xs">Generic Match: Atorvastatin 20mg</span>
                <p className="text-[10px] text-[#525f75]">Identical active ingredient & bioavailability</p>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-[#006c4a]">$9.20</span>
                <span className="text-[10px] text-[#006c4a] block font-semibold">Save $78.80</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onProceedToCompare}
            className="w-full py-3 px-4 bg-[#006b53] hover:bg-[#00513e] text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-colors"
          >
            <span>Lock In $9.20 Price & Compare Pharmacies</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
};
