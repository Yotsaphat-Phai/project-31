"use client";

import Link from "next/link";

export default function ReportPage() {
  return (
    <div className="h-screen w-screen bg-[#FDF5EC] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-gray-800">รายงาน</h1>
            <span className="bg-[#9E4B8E] text-white text-xs font-semibold px-3 py-1 rounded-full">
              Head Admin
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 text-center mb-3">
              รายงาน TOKEN
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <p className="text-xs text-gray-500">เติมแล้ว</p>
                <p className="text-2xl font-bold text-[#E85D5D]">24,000</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">ใช้แล้ว</p>
                <p className="text-2xl font-bold text-[#9E4B8E]">18,450</p>
              </div>
            </div>
            <svg viewBox="0 0 300 100" className="w-full h-24">
              <polyline
                points="10,80 60,60 110,40 160,50 210,25 260,20 290,15"
                fill="none"
                stroke="#9E4B8E"
                strokeWidth="2.5"
              />
              {[[10,80],[60,60],[110,40],[160,50],[210,25],[260,20],[290,15]].map(([x, y]) => (
                <circle key={x} cx={x} cy={y} r="3" fill="#9E4B8E" />
              ))}
            </svg>
          </div>

          <Link
            href="/head-admin/token"
            className="block text-center w-full bg-[#9E4B8E] text-white text-sm font-semibold py-3.5 rounded-xl shadow-lg mb-2 active:scale-95 transition"
          >
            ปรับ TOKEN / คืนเงิน กรณีมีปัญหา
          </Link>
          <Link
            href="/head-admin/audit"
            className="block text-center w-full bg-white border-2 border-[#9E4B8E] text-[#9E4B8E] text-sm font-semibold py-3.5 rounded-xl active:scale-95 transition"
          >
            ดู Audit Log
          </Link>
        </div>
      </div>

      <nav className="bg-white border-t border-gray-200 px-2 py-2 flex items-center justify-around">
        <Link href="/head-admin/report" className="flex flex-col items-center text-[#9E4B8E] py-1">
          <span className="text-xl">📊</span>
          <span className="text-[10px] mt-0.5 font-semibold">รายงาน</span>
        </Link>
        <Link href="/head-admin" className="flex flex-col items-center text-gray-400 py-1">
          <span className="text-xl">👥</span>
          <span className="text-[10px] mt-0.5">บัญชี</span>
        </Link>
        <Link href="/head-admin/audit" className="flex flex-col items-center text-gray-400 py-1">
          <span className="text-xl">📋</span>
          <span className="text-[10px] mt-0.5">Audit Log</span>
        </Link>
        <Link href="/head-admin/token" className="flex flex-col items-center text-gray-400 py-1">
          <span className="text-xl">💾</span>
          <span className="text-[10px] mt-0.5">ปรับ TOKEN</span>
        </Link>
      </nav>
    </div>
  );
}