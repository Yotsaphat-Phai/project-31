"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Html5QrcodeScanner {
  start: (
    cameraConfig: { facingMode: string },
    config: { fps: number; qrbox: { width: number; height: number } },
    onSuccess: (decodedText: string) => void,
    onError: () => void
  ) => Promise<void>;
  stop: () => Promise<void>;
}

// ===== Icons (SVG) =====
function StoreIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
    </svg>
  );
}

function ClipboardIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
    </svg>
  );
}

export default function VendorScanPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [amount, setAmount] = useState(350);
  const [storeName] = useState("ชื่อร้าน");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const loadScanner = async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode as unknown as Html5QrcodeScanner;

      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText: string) => {
            setScanResult(decodedText);
            html5QrCode.stop().catch(() => {});
          },
          () => {}
        );
      } catch (err) {
        console.error("ไม่สามารถเปิดกล้องได้:", err);
      }
    };

    loadScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleConfirm = () => {
    if (!scanResult) {
      alert("กรุณาสแกน QR ก่อน");
      return;
    }
    alert(
      `✅ ตัด TOKEN สำเร็จ!\nร้าน: ${storeName}\nยอด: ${amount} TOKEN\nQR: ${scanResult}`
    );
  };

  const handleRescan = async () => {
    setScanResult(null);
    const { Html5Qrcode } = await import("html5-qrcode");
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode as unknown as Html5QrcodeScanner;

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText: string) => {
          setScanResult(decodedText);
          html5QrCode.stop().catch(() => {});
        },
        () => {}
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-200 flex items-center justify-center p-4">
      {/* Phone Container */}
      <div className="w-full max-w-sm h-[844px] bg-[#FDF5EC] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">

        {/* Top: Dark scanner area */}
        <div className="flex-1 bg-[#1A2129] relative overflow-hidden">
          <div
            id="qr-reader"
            className="absolute inset-0 w-full h-full [&_video]:!w-full [&_video]:!h-full [&_video]:!object-cover [&>*:not(video)]:!hidden"
          ></div>

          <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-6 pb-4 z-10">
            <h1 className="text-white text-sm font-bold flex-1 text-center ml-12 drop-shadow-lg">
              สแกน QR ชำระสินค้า
            </h1>
            <span className="bg-[#C8A057] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-lg">
              Vendor
            </span>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <div className="relative w-56 h-56">
              <div className="absolute -top-1 -left-1 w-10 h-10 border-t-[3px] border-l-[3px] border-white rounded-tl-lg"></div>
              <div className="absolute -top-1 -right-1 w-10 h-10 border-t-[3px] border-r-[3px] border-white rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-[3px] border-l-[3px] border-white rounded-bl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-[3px] border-r-[3px] border-white rounded-br-lg"></div>

              {!scanResult && (
                <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.8)] animate-pulse"></div>
              )}
            </div>

            <p className="text-white text-xs mt-6 drop-shadow-lg">
              {scanResult ? "✅ สแกนสำเร็จแล้ว" : "วาง QR ของผู้เข้างานในกรอบ"}
            </p>

            {scanResult && (
              <div className="mt-3 bg-black/50 rounded-lg px-3 py-2 max-w-xs">
                <p className="text-white text-[10px] break-all text-center">
                  {scanResult}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: White card */}
        <div className="bg-white rounded-t-3xl p-5 shadow-2xl -mt-4 relative z-20">
          <p className="text-sm text-gray-700 font-semibold mb-3">{storeName}</p>

          <div className="bg-[#FDF5EC] rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
            <span className="text-xs text-gray-600">ยอดชำระ:</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="text-lg font-bold text-[#E85D5D] bg-transparent text-right outline-none w-24"
            />
          </div>

          {scanResult ? (
            <div className="flex gap-2">
              <button
                onClick={handleRescan}
                className="flex-1 bg-gray-200 text-gray-700 text-sm font-semibold py-3 rounded-xl active:scale-95 transition"
              >
                สแกนใหม่
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-[#C8A057] text-white text-sm font-semibold py-3 rounded-xl shadow-lg active:scale-95 transition"
              >
                ยืนยันตัด TOKEN
              </button>
            </div>
          ) : (
            <button
              onClick={handleConfirm}
              className="w-full bg-[#C8A057] text-white text-sm font-semibold py-3 rounded-xl shadow-lg active:scale-95 transition"
            >
              ยืนยันตัด TOKEN
            </button>
          )}
        </div>

        {/* Bottom Navigation — ขายสินค้า active (อยู่หน้านี้) / ประวัติรายการไป /vendor/history */}
        <nav className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around">
          <Link
            href="/vendor/scan"
            className="group flex flex-col items-center py-1 px-6 text-[#C8A057] transition-colors"
          >
            <StoreIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="text-xs mt-0.5 font-semibold">ขายสินค้า</span>
          </Link>
          <Link
            href="/vendor/history"
            className="group flex flex-col items-center py-1 px-6 text-gray-400 hover:text-[#C8A057] transition-colors"
          >
            <ClipboardIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="text-xs mt-0.5 group-hover:font-semibold">ประวัติรายการ</span>
          </Link>
        </nav>

      </div>
    </div>
  );
}