"use client";

import { useEffect, useState } from "react";
import UserBottomNav from "@/app/_components/UserBottomNav";
import { QRCodeSVG } from "qrcode.react";

const USER_CODE = "VCK001";

export default function TokenQRPage() {
  const [qrValue, setQrValue] = useState("");
  const [balance] = useState(0);
  const [spinning, setSpinning] = useState(false);

  // สร้างค่า QR ใหม่ (ใส่เวลาไว้ด้วย เพื่อให้ QR เปลี่ยนทุกครั้งที่รีเฟรช)
  const generateQR = () => {
    setQrValue(`${USER_CODE}-${Date.now()}`);
  };

  useEffect(() => {
    generateQR();
  }, []);

  const handleRefresh = () => {
    setSpinning(true);
    generateQR();
    setTimeout(() => setSpinning(false), 600);
  };

  return (
    <main className="min-h-screen bg-[#FDF5EC] pb-28">
      <div className="mx-auto max-w-md px-5 pt-8">
        {/* ===== Header ===== */}
        <h1 className="text-xl font-bold text-[#1F2A44]">รับชำระเงิน</h1>

        {/* ===== QR Card ===== */}
        <div className="mt-5 overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <div className="px-6 pt-6 pb-6 text-center">
            <h2 className="text-lg font-bold text-[#1F2A44]">สแกน QR นี้ที่ร้านค้า</h2>
            <p className="mt-1 text-xs text-[#8E8E8E]">
              เพื่อชำระเงินด้วย <span className="font-semibold text-[#E0A838]">TOKEN</span>
            </p>

            {/* QR + มุมสีทอง */}
            <div className="relative mx-auto mt-5 h-[200px] w-[200px]">
              <span className="absolute left-0 top-0 h-7 w-7 rounded-tl-xl border-l-[3px] border-t-[3px] border-[#F0D3A0]" />
              <span className="absolute right-0 top-0 h-7 w-7 rounded-tr-xl border-r-[3px] border-t-[3px] border-[#F0D3A0]" />
              <span className="absolute bottom-0 left-0 h-7 w-7 rounded-bl-xl border-b-[3px] border-l-[3px] border-[#F0D3A0]" />
              <span className="absolute bottom-0 right-0 h-7 w-7 rounded-br-xl border-b-[3px] border-r-[3px] border-[#F0D3A0]" />

              <div className="absolute inset-0 flex items-center justify-center">
                {qrValue ? (
                  <QRCodeSVG value={qrValue} size={160} level="M" bgColor="#FFFFFF" fgColor="#000000" />
                ) : (
                  <div className="h-[160px] w-[160px] animate-pulse rounded-lg bg-gray-100" />
                )}
              </div>
            </div>
          </div>

          {/* ยอดคงเหลือ + รีเฟรช */}
          <div className="flex items-center border-t border-[#F3EEE6] px-5 py-4">
            <div className="flex flex-1 items-center gap-3">
              <CoinStack />
              <div>
                <p className="text-xs text-[#6B6B6B]">ยอดคงเหลือ</p>
                <p className="leading-tight">
                  <span className="text-2xl font-bold text-[#1F2A44]">
                    {balance.toLocaleString()}
                  </span>
                  <span className="ml-1.5 text-sm font-semibold text-[#E0A838]">TOKEN</span>
                </p>
              </div>
            </div>

            <div className="mx-3 h-10 w-px bg-[#EFE8DD]" />

            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center gap-2 rounded-2xl bg-[#FDF3E5] px-4 py-3 text-sm font-semibold text-[#1F2A44] active:scale-95"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 ${spinning ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 11a8 8 0 0 0-14.9-3.5" />
                <polyline points="4 4 4 8 8 8" />
                <path d="M4 13a8 8 0 0 0 14.9 3.5" />
                <polyline points="20 20 20 16 16 16" />
              </svg>
              รีเฟรช
            </button>
          </div>
        </div>

        {/* ===== คำเตือน ===== */}
        <div className="mt-4 flex items-center justify-center gap-3 rounded-2xl bg-[#FBEBD9] px-5 py-4">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0 text-[#E0A838]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="11" x2="12" y2="16" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-xs leading-relaxed text-[#6B6B6B]">
            QR นี้มีอายุการใช้งานชั่วคราว
            <br />
            กรุณาอย่าแชร์ QR นี้กับผู้อื่น
          </p>
        </div>
      </div>

      <UserBottomNav active="token" />
    </main>
  );
}

/* ไอคอนเหรียญซ้อนกัน */
function CoinStack() {
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0">
      <ellipse cx="14" cy="31" rx="10" ry="4" fill="#C98A1E" />
      <rect x="4" y="26" width="20" height="5" fill="#C98A1E" />
      <ellipse cx="14" cy="26" rx="10" ry="4" fill="#F2C14E" />
      <ellipse cx="14" cy="24" rx="10" ry="4" fill="#C98A1E" />
      <rect x="4" y="19" width="20" height="5" fill="#C98A1E" />
      <ellipse cx="14" cy="19" rx="10" ry="4" fill="#F2C14E" />
      <ellipse cx="26" cy="27" rx="10" ry="4" fill="#C98A1E" />
      <rect x="16" y="18" width="20" height="9" fill="#C98A1E" />
      <ellipse cx="26" cy="18" rx="10" ry="4" fill="#F2C14E" />
      <ellipse cx="26" cy="13" rx="10" ry="4" fill="#C98A1E" />
      <rect x="16" y="8" width="20" height="5" fill="#C98A1E" />
      <ellipse cx="26" cy="8" rx="10" ry="4" fill="#F7D47A" />
    </svg>
  );
}

