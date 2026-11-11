"use client";

import { useState } from "react";
import Link from "next/link";

export default function EventPage() {
  const [quantity, setQuantity] = useState(2);
  const pricePerTicket = 500;

  const handleBuy = () => {
    alert(
      `ซื้อบัตรจำนวน ${quantity} ใบ\nรวม ฿${(pricePerTicket * quantity).toLocaleString()}`
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF5EC] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-[#FDF5EC] rounded-3xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/50 transition"
          >
            <i className="bi bi-chevron-left text-gray-700 text-xl"></i>
          </Link>
          <h1 className="text-lg font-bold text-gray-800">รายละเอียดงาน</h1>
        </div>

        {/* Event Image Card */}
        <div className="bg-[#FFE5DC] rounded-3xl p-8 mb-6 relative overflow-hidden h-48 flex items-center justify-center">
          {/* Balloons */}
          <div className="absolute top-3 left-6 text-3xl">🎈</div>
          <div className="absolute top-2 right-12 text-2xl">🎈</div>
          <div className="absolute top-8 right-4 text-3xl">🎈</div>

          {/* Center Icon */}
          <div className="bg-[#E85D5D] rounded-2xl p-6 shadow-lg">
            <i className="bi bi-credit-card-2-front-fill text-white text-5xl"></i>
          </div>
        </div>

        {/* Event Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          งานเลี้ยงรุ่น Class of 20XX
        </h2>

        {/* Badge */}
        <div className="inline-block bg-[#FFE5DC] text-[#E85D5D] text-xs font-semibold px-3 py-1 rounded-full mb-4">
          <i className="bi bi-mortarboard-fill mr-1"></i>
          มัธยมปลายคริสต์ - ภาคเขียว
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          {/* Date */}
          <div className="flex items-center gap-3 bg-white rounded-xl p-3">
            <div className="w-10 h-10 bg-[#FFE5DC] rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="bi bi-calendar-event-fill text-[#E85D5D] text-lg"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">วันที่</p>
              <p className="text-sm font-semibold text-gray-800">
                เสาร์ 20 ธ.ค. • 18:00 น.
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 bg-white rounded-xl p-3">
            <div className="w-10 h-10 bg-[#FFE5DC] rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="bi bi-geo-alt-fill text-[#E85D5D] text-lg"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">สถานที่</p>
              <p className="text-sm font-semibold text-gray-800">
                ห้องสัมมนาที่โรงเรียน
              </p>
            </div>
          </div>

          {/* Price per ticket */}
          <div className="flex items-center gap-3 bg-white rounded-xl p-3">
            <div className="w-10 h-10 bg-[#FFE5DC] rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="bi bi-tag-fill text-[#E85D5D] text-lg"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">ราคา</p>
              <p className="text-sm font-semibold text-gray-800">
                ฿{pricePerTicket.toLocaleString()} / ใบ
              </p>
            </div>
          </div>

          {/* Remaining */}
          <div className="flex items-center gap-3 bg-white rounded-xl p-3">
            <div className="w-10 h-10 bg-[#FFE5DC] rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="bi bi-ticket-detailed-fill text-[#E85D5D] text-lg"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">บัตรเหลือ</p>
              <p className="text-sm font-semibold text-gray-800">126 ใบ</p>
            </div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="bg-white rounded-xl p-4 mb-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            จำนวนบัตร
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 bg-[#FFE5DC] text-[#E85D5D] rounded-full font-bold hover:bg-[#E85D5D] hover:text-white transition flex items-center justify-center"
            >
              <i className="bi bi-dash-lg"></i>
            </button>
            <span className="text-lg font-bold text-gray-800 w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 bg-[#E85D5D] text-white rounded-full font-bold hover:bg-[#d54f4f] transition flex items-center justify-center"
            >
              <i className="bi bi-plus-lg"></i>
            </button>
          </div>
        </div>

        {/* Bottom: Price + Buy */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">รวม</p>
            <p className="text-2xl font-bold text-gray-800">
              ฿{(pricePerTicket * quantity).toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleBuy}
            className="bg-[#E85D5D] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#d54f4f] active:scale-95 transition shadow-lg flex items-center gap-2"
          >
            <i className="bi bi-ticket-perforated-fill"></i>
            ซื้อบัตร
          </button>
        </div>
      </div>
    </div>
  );
}