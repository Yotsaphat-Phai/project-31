"use client";

import { useState } from "react";
import Link from "next/link";

type FilterType = "ทั้งหมด" | "TOKEN" | "บัญชี" | "คืนเงิน";

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("ทั้งหมด");

  const logs = [
    { id: 1, action: "ปรับ TOKEN +500", user: "ลลิตภัทร กันทา", reason: "ระบบขัดข้อง", by: "Head Admin", time: "14:32", type: "TOKEN" as FilterType, color: "bg-[#9E4B8E]", sign: "+" },
    { id: 2, action: "คืนเงิน 1,200 TOKEN", user: "ตั๋ว #T-0482", reason: "ยกเลิกบัตร", by: "Head Admin", time: "13:10", type: "คืนเงิน" as FilterType, color: "bg-[#E85D5D]", sign: "↩" },
    { id: 3, action: "ระงับบัญชี Staff", user: "สมชาย ใจดี", reason: "", by: "Head Admin", time: "11:45", type: "บัญชี" as FilterType, color: "bg-gray-400", sign: "⛔" },
    { id: 4, action: "เพิ่มบัญชี Staff", user: "มานี รักงาน", reason: "", by: "Head Admin", time: "10:20", type: "บัญชี" as FilterType, color: "bg-[#2D9D8F]", sign: "+" },
    { id: 5, action: "ปรับ TOKEN −200", user: "ปรีชา สุขใจ", reason: "คืนส่วนเกิน", by: "Head Admin", time: "09:05", type: "TOKEN" as FilterType, color: "bg-[#9E4B8E]", sign: "−" },
  ];

  const filtered = logs.filter((log) => {
    const matchFilter = filter === "ทั้งหมด" || log.type === filter;
    const matchSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="h-screen w-screen bg-[#FDF5EC] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-md mx-auto">

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link href="/head-admin" className="text-gray-700 text-xl">‹</Link>
              <h1 className="text-xl font-bold text-gray-800">Audit Log</h1>
            </div>
            <span className="bg-[#9E4B8E] text-white text-xs font-semibold px-3 py-1 rounded-full">
              Head Admin
            </span>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9E4B8E] outline-none mb-3"
            placeholder="ค้นหาผู้ใช้ / รายการ"
          />

          <div className="flex gap-1.5 mb-4 overflow-x-auto">
            {(["ทั้งหมด", "TOKEN", "บัญชี", "คืนเงิน"] as FilterType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                  filter === tab
                    ? "bg-[#9E4B8E] text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 mb-2 font-semibold">
            วันนี้ · 1 พ.ย. 2569
          </p>

          <div className="space-y-2 mb-4">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-gray-400 text-sm">
                ไม่พบรายการ
              </div>
            ) : (
              filtered.map((log) => (
                <div key={log.id} className="bg-white rounded-xl p-3 flex items-start gap-3 shadow-sm">
                  <div className={`w-10 h-10 rounded-full ${log.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {log.sign}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-800">{log.action}</p>
                      <span className="text-[10px] text-gray-500 flex-shrink-0">{log.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      ผู้ใช้: {log.user}{log.reason && ` · เหตุผล: ${log.reason}`}
                    </p>
                    <p className="text-[10px] text-[#9E4B8E] font-medium mt-1">
                      โดย {log.by}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

           <nav className="bg-white border-t border-gray-200 px-2 py-2 flex items-center justify-around">
        <Link href="#" className="flex flex-col items-center text-gray-400 py-1">
          <span className="text-xl">📊</span>
          <span className="text-[10px] mt-0.5">รายงาน</span>
        </Link>
        <Link href="/head-admin" className="flex flex-col items-center text-gray-400 py-1">
          <span className="text-xl">👥</span>
          <span className="text-[10px] mt-0.5">บัญชี</span>
        </Link>
        <Link href="/head-admin/audit" className="flex flex-col items-center text-[#9E4B8E] py-1">
          <span className="text-xl">📋</span>
          <span className="text-[10px] mt-0.5 font-semibold">Audit Log</span>
        </Link>
        <Link href="/head-admin/token" className="flex flex-col items-center text-gray-400 py-1">
          <span className="text-xl">💾</span>
          <span className="text-[10px] mt-0.5">ปรับ TOKEN</span>
        </Link>
      </nav>
    </div>
  );
}