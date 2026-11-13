"use client";

import { useState } from "react";
import Link from "next/link";

export default function EventPage() {
  const [quantity, setQuantity] = useState(2);
  const pricePerTicket = 500;
  const total = pricePerTicket * quantity;

  return (
    <div className="h-screen w-screen bg-[#FDF5EC] flex items-center justify-center overflow-hidden p-3">
      <div className="w-full max-w-md max-h-full overflow-y-auto px-2 py-2">

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-full">
            <span className="text-gray-700 text-xl">‹</span>
          </Link>
          <h1 className="text-base font-bold text-gray-800">รายละเอียดงาน</h1>
        </div>

        {/* Event Image */}
        <div className="bg-[#FFE5DC] rounded-2xl p-4 mb-3 relative h-28 flex items-center justify-center">
          <div className="absolute top-1 left-4 text-xl">🎈</div>
          <div className="absolute top-0 right-8 text-lg">🎈</div>
          <div className="absolute top-4 right-2 text-xl">🎈</div>
          <div className="bg-[#E85D5D] rounded-xl p-3 shadow-lg">
            <span className="text-white text-3xl">💳</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-800 mb-1">
          งานเลี้ยงรุ่น Class of 20XX
        </h2>
        <div className="inline-block bg-[#FFE5DC] text-[#E85D5D] text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3">
          🎓 มัธยมปลายคริสต์ - ภาคเขียว
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { icon: "📅", label: "วันที่", value: "20 ธ.ค. • 18:00" },
            { icon: "📍", label: "สถานที่", value: "ห้องสัมมนา" },
            { icon: "🏷️", label: "ราคา", value: `฿${pricePerTicket}` },
            { icon: "🎟️", label: "บัตรเหลือ", value: "126 ใบ" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-white rounded-lg p-2">
              <div className="w-8 h-8 bg-[#FFE5DC] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm">{item.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-gray-500">{item.label}</p>
                <p className="text-[11px] font-semibold text-gray-800 truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quantity */}
        <div className="bg-white rounded-lg p-3 mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">จำนวนบัตร</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 bg-[#FFE5DC] text-[#E85D5D] rounded-full font-bold flex items-center justify-center"
            >
              −
            </button>
            <span className="text-base font-bold text-gray-800 w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 bg-[#E85D5D] text-white rounded-full font-bold flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* 🔗 Total + Buy Button → /event/participants */}
        <div className="flex items-center justify-between gap-2 bg-white rounded-lg p-3">
          <div>
            <p className="text-[10px] text-gray-500">รวม</p>
            <p className="text-xl font-bold text-gray-800">
              ฿{total.toLocaleString()}
            </p>
          </div>
          <Link
            href={`/event/participants?qty=${quantity}&total=${total}`}
            className="bg-[#E85D5D] text-white text-sm font-semibold px-5 py-2.5 rounded-lg active:scale-95 shadow-lg flex items-center gap-1.5"
          >
            🎫 ซื้อบัตร
          </Link>
        </div>

      </div>
    </div>
  );
}