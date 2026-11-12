"use client";

import Link from "next/link";

export default function VendorScanPage() {
  return (
    <div className="h-screen w-screen bg-[#FDF5EC] flex flex-col overflow-hidden">
      {/* Top: Dark scanner area */}
      <div className="flex-1 bg-[#1A2129] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-12 pb-4">
          <h1 className="text-white text-base font-bold flex-1 text-center">
            สแกน QR ชำระสินค้า
          </h1>
          <span className="bg-[#C8A057] text-white text-xs font-semibold px-3 py-1 rounded-full">
            Vendor
          </span>
        </div>

        {/* Scanner Frame */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="relative w-56 h-56">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white rounded-br-lg"></div>

            {/* Red scan line */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.6)]"></div>
          </div>

          {/* Scan hint */}
          <p className="text-white/70 text-xs mt-8">
            วาง QR ของผู้เข้างานในกรอบ
          </p>
        </div>
      </div>

      {/* Bottom: White card */}
      <div className="bg-white rounded-t-3xl p-5 shadow-2xl">
        <p className="text-sm text-gray-600 mb-3">ชื่อร้าน</p>

        {/* Amount Row */}
        <div className="bg-[#FDF5EC] rounded-xl p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-700">ยอดชำระ:</span>
          <span className="text-xl font-bold text-[#E85D5D]">350</span>
        </div>

        {/* Confirm Button */}
        <button className="w-full bg-[#C8A057] text-white text-sm font-semibold py-3.5 rounded-xl shadow-lg active:scale-95 transition">
          ยืนยันตัด TOKEN
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around">
        <Link
          href="/vendor"
          className="flex flex-col items-center text-[#C8A057] py-1 px-6"
        >
          <span className="text-xl">🏪</span>
          <span className="text-xs mt-0.5 font-semibold">ขายสินค้า</span>
        </Link>
        <Link
          href="#"
          className="flex flex-col items-center text-gray-400 py-1 px-6"
        >
          <span className="text-xl">📋</span>
          <span className="text-xs mt-0.5">ประวัติรายการ</span>
        </Link>
      </nav>
    </div>
  );
}