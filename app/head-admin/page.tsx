"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Role = "Admin" | "Staff" | "Vendor";
type FilterType = "ทั้งหมด" | Role;

export default function HeadAdminPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("ทั้งหมด");

  const [accounts, setAccounts] = useState([
    { id: 1, name: "ณัฐพงศ์ พรมมาตร", role: "Admin" as Role, active: true, color: "bg-blue-400" },
    { id: 2, name: "ลลิตภัทร กันทา", role: "Staff" as Role, active: true, color: "bg-green-500" },
    { id: 3, name: "ผู้ใช้ตัวอย่าง", role: "Staff" as Role, active: false, color: "bg-green-500" },
    { id: 4, name: "ร้านน้ำเย็น", role: "Vendor" as Role, active: true, color: "bg-[#C8A057]" },
    { id: 5, name: "ร้านขนมหวาน", role: "Vendor" as Role, active: true, color: "bg-pink-400" },
    { id: 6, name: "ร้านอาหารทะเล", role: "Vendor" as Role, active: true, color: "bg-orange-400" },
    { id: 7, name: "ร้านก๋วยเตี๋ยว", role: "Vendor" as Role, active: false, color: "bg-yellow-500" },
  ]);

  const toggleAccount = (id: number) => {
    setAccounts(accounts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const filtered = filter === "ทั้งหมด" ? accounts : accounts.filter(a => a.role === filter);
  const counts = {
    ทั้งหมด: accounts.length,
    Admin: accounts.filter(a => a.role === "Admin").length,
    Staff: accounts.filter(a => a.role === "Staff").length,
    Vendor: accounts.filter(a => a.role === "Vendor").length,
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case "Admin": return "bg-blue-100 text-blue-700";
      case "Staff": return "bg-green-100 text-green-700";
      case "Vendor": return "bg-yellow-100 text-yellow-700";
    }
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case "Admin": return "👑";
      case "Staff": return "👨‍💼";
      case "Vendor": return "🏪";
    }
  };

  return (
    <div className="h-screen w-screen bg-[#FDF5EC] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-md mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button onClick={() => router.back()} className="text-gray-700 text-xl">‹</button>
              <h1 className="text-lg font-bold text-gray-800">Head Admin</h1>
            </div>
            <span className="bg-[#9E4B8E] text-white text-xs font-semibold px-3 py-1 rounded-full">
              Head Admin
            </span>
          </div>

          {/* TOKEN Report Card */}
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

          {/* Account Management */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-800">
              จัดการบัญชีผู้ใช้งาน
            </h3>
            <Link
              href="/admin/vendors/new"
              className="text-xs text-[#9E4B8E] font-semibold"
            >
              + เพิ่ม
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
            {(["ทั้งหมด", "Admin", "Staff", "Vendor"] as FilterType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  filter === tab
                    ? "bg-[#9E4B8E] text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {tab} ({counts[tab]})
              </button>
            ))}
          </div>

          {/* Accounts List */}
          <div className="space-y-2 mb-4">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-gray-400 text-sm">
                ไม่พบบัญชี
              </div>
            ) : (
              filtered.map((account) => (
                <div key={account.id} className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm">
                  <div className={`w-10 h-10 rounded-full ${account.color} flex items-center justify-center text-white text-sm flex-shrink-0`}>
                    {getRoleIcon(account.role)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {account.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getRoleBadge(account.role)}`}>
                        {account.role}
                      </span>
                      {!account.active && (
                        <span className="text-[10px] text-gray-400">ปิดใช้งาน</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAccount(account.id)}
                    className={`relative w-11 h-6 rounded-full transition flex-shrink-0 ${
                      account.active ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      account.active ? "translate-x-5" : "translate-x-0.5"
                    }`}></div>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
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

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-2 py-2 flex items-center justify-around">
        <Link href="/head-admin/report" className="flex flex-col items-center text-gray-400 py-1">
          <span className="text-xl">📊</span>
          <span className="text-[10px] mt-0.5">รายงาน</span>
        </Link>
        <Link href="/head-admin" className="flex flex-col items-center text-[#9E4B8E] py-1">
          <span className="text-xl">👥</span>
          <span className="text-[10px] mt-0.5 font-semibold">บัญชี</span>
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