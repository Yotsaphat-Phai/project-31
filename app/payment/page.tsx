"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentPage() {
  const router = useRouter();
  const [slipUploaded, setSlipUploaded] = useState(false);
  const total = 1000;

  // QR pattern คงที่
  const qrPattern = [
    1,1,1,1,1,1,1,0,1,0,1,1,0,1,
    1,0,0,0,0,0,1,0,0,1,1,0,1,1,
    1,0,1,1,1,0,1,0,1,0,1,1,0,1,
    1,0,1,1,1,0,1,0,0,1,0,1,1,0,
    1,0,1,1,1,0,1,0,1,0,1,0,1,1,
    1,0,0,0,0,0,1,0,0,1,1,0,1,0,
    1,1,1,1,1,1,1,0,1,0,1,1,0,1,
    0,0,0,0,0,0,0,0,1,1,0,1,0,1,
    1,0,1,1,0,1,1,0,0,1,1,0,1,0,
    0,1,0,0,1,0,0,1,1,0,1,1,0,1,
    1,1,0,1,0,1,1,0,0,1,0,0,1,1,
    0,1,1,0,1,0,1,1,1,0,1,1,0,0,
    1,0,1,0,1,1,0,1,0,1,0,1,1,1,
    0,1,0,1,0,0,1,0,1,0,1,0,0,1,
  ];

  const handleConfirm = () => {
    if (!slipUploaded) {
      alert("กรุณาแนบสลิปการโอนเงินก่อน");
      return;
    }
    router.push("/event/ticket");
  };

  return (
    <div className="h-screen w-screen bg-[#FDF5EC] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-md mx-auto">

          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <Link href="/event/participants" className="text-gray-700 text-xl">‹</Link>
            <h1 className="text-base font-bold text-gray-800">ชำระเงิน</h1>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-5 px-2">
            {/* Step 1 - Done */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#E85D5D] flex items-center justify-center text-white text-xs font-bold">
                ✓
              </div>
              <span className="text-[10px] mt-1 text-[#E85D5D] font-semibold">
                ข้อมูล
              </span>
            </div>

            <div className="flex-1 h-0.5 bg-[#E85D5D] mx-1 mb-4"></div>

            {/* Step 2 - Active */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-[#E85D5D] flex items-center justify-center text-white text-xs font-bold">
                2
              </div>
              <span className="text-[10px] mt-1 text-[#E85D5D] font-semibold">
                ชำระเงิน
              </span>
            </div>

            <div className="flex-1 h-0.5 bg-gray-200 mx-1 mb-4"></div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">
                3
              </div>
              <span className="text-[10px] mt-1 text-gray-400">รับ QR</span>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center mb-4">
            <p className="text-xs text-gray-500">ยอดชำระ</p>
            <p className="text-3xl font-bold text-gray-800">฿{total.toLocaleString()}</p>
          </div>

          {/* QR Card */}
          <div className="bg-white rounded-2xl mb-4 border-2 border-[#E85D5D] overflow-hidden">
            {/* Header Bar */}
            <div className="bg-[#E85D5D] text-white text-center text-xs font-bold py-2">
              THAI QR PAYMENT
            </div>

            {/* QR Code */}
            <div className="p-4">
              <div className="aspect-square bg-white rounded-lg">
                <div className="w-full h-full grid grid-cols-14 gap-0.5">
                  {qrPattern.map((val, i) => (
                    <div
                      key={i}
                      className={`w-full aspect-square ${val === 1 ? "bg-black" : "bg-white"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Slip Button */}
          <button
            onClick={() => setSlipUploaded(!slipUploaded)}
            className={`w-full border-2 border-dashed rounded-xl p-3 mb-3 transition ${
              slipUploaded
                ? "border-green-500 bg-green-50"
                : "border-[#E85D5D] bg-white"
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">
                {slipUploaded ? "✅" : "📤"}
              </span>
              <p className={`text-xs font-semibold ${slipUploaded ? "text-green-600" : "text-[#E85D5D]"}`}>
                {slipUploaded ? "แนบสลิปแล้ว" : "แนบสลิปการโอนเงิน"}
              </p>
            </div>
          </button>

          {/* Info */}
          <div className="bg-[#E8F5E9] border border-green-100 rounded-xl p-2.5 mb-4">
            <p className="text-[11px] text-green-800 text-center">
              Admin จะตรวจสอบและออก QR ประจำตัว
            </p>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className="w-full bg-[#E85D5D] text-white text-sm font-semibold py-3.5 rounded-xl shadow-lg active:scale-95 transition"
          >
            ส่งให้ตรวจสอบ
          </button>

        </div>
      </div>
    </div>
  );
}