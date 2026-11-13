"use client";

import Link from "next/link";

export default function TicketPage() {
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

  return (
    <div className="h-screen w-screen bg-[#FDF5EC] flex flex-col overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-md mx-auto">

          {/* Title */}
          <h1 className="text-lg font-bold text-gray-800 text-center mb-4">
            บัตรของฉัน
          </h1>

          {/* Dark Ticket Card */}
          <div className="bg-[#1A3A3A] rounded-2xl p-4 mb-3 text-center">
            <p className="text-white text-sm font-bold">
              งานเลี้ยงรุ่น Class of 20XX
            </p>
            <p className="text-white/60 text-xs mb-3">
              สมชาย ใจดี · รุ่น 20XX
            </p>

            {/* QR Code */}
            <div className="bg-white rounded-xl p-3 mb-3 mx-auto max-w-[200px]">
              <div className="aspect-square bg-white">
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

            <p className="text-white/70 text-[10px] mb-2">
              ใช้สแกนเข้างาน · เติม TOKEN · สั่งสินค้า
            </p>

            {/* Status Badge */}
            <div className="inline-block bg-green-500/20 text-green-300 text-[10px] font-semibold px-3 py-1 rounded-full">
              ✓ สถานะ: อนุมัติแล้ว
            </div>
          </div>

          {/* TOKEN Card */}
          <div className="bg-[#FFE5DC] rounded-2xl p-4 mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-600">TOKEN คงเหลือ</p>
              <p className="text-3xl font-bold text-[#E85D5D]">350</p>
            </div>
            <button className="bg-[#E85D5D] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md active:scale-95 transition">
              ประวัติการใช้
            </button>
          </div>

          {/* Status Tags */}
          <div className="bg-white rounded-xl p-3">
            <p className="text-[10px] text-gray-500 mb-2">
              สถานะเช็กอิน และกิจกรรม - รุ่น 20XX
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                ✓ ตอบรับ
              </span>
              <span className="bg-[#FFE5DC] text-[#E85D5D] text-[10px] font-semibold px-2.5 py-1 rounded-full">
                ● ชำระ
              </span>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                ● โหวต
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around">
        <Link href="/" className="flex flex-col items-center text-gray-400 py-1">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] mt-0.5">หน้าแรก</span>
        </Link>
        <Link href="/event/ticket" className="flex flex-col items-center text-[#E85D5D] py-1">
          <span className="text-xl">🎫</span>
          <span className="text-[10px] mt-0.5 font-semibold">บัตรของฉัน</span>
        </Link>
        <Link href="#" className="flex flex-col items-center text-gray-400 py-1">
          <span className="text-xl">🪙</span>
          <span className="text-[10px] mt-0.5">TOKEN</span>
        </Link>
        <Link href="#" className="flex flex-col items-center text-gray-400 py-1">
          <span className="text-xl">👤</span>
          <span className="text-[10px] mt-0.5">โปรไฟล์</span>
        </Link>
      </nav>
    </div>
  );
}