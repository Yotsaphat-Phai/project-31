"use client";

import Link from "next/link";

export default function VendorPage() {
  return (
    <div className="min-h-screen w-screen bg-gray-200 flex items-center justify-center p-4">
      {/* Phone Container */}
      <div className="w-full max-w-sm h-[844px] bg-[#FDF5EC] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4">

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-base font-bold text-gray-800">ร้านน้ำเย็น</h1>
            <span className="bg-[#C8A057] text-white text-xs font-semibold px-3 py-1 rounded-full">
              Vendor
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <div className="aspect-square bg-white rounded-lg">
              <div className="w-full h-full grid grid-cols-12 gap-0.5 p-2">
                {Array(144).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className={`w-full aspect-square ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-xs text-gray-500">รวมที่รับ (ล่าสุดในวันนี้)</p>
              <p className="text-2xl font-bold text-[#C8A057]">95 TOKEN</p>
            </div>
            <button className="bg-[#C8A057] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg">
              📷 สแกน QR
            </button>
          </div>

        </div>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around">
          <Link href="/vendor" className="flex flex-col items-center text-[#C8A057] py-1 px-6">
            <span className="text-xl">🏪</span>
            <span className="text-xs mt-0.5 font-semibold">ขายสินค้า</span>
          </Link>
          <Link href="#" className="flex flex-col items-center text-gray-400 py-1 px-6">
            <span className="text-xl">📋</span>
            <span className="text-xs mt-0.5">ประวัติรายการ</span>
          </Link>
        </nav>

      </div>
    </div>
  );
}