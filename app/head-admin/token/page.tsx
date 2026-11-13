"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Mode = "ปรับ TOKEN" | "คืนเงิน";
type ActionType = "add" | "deduct";

export default function TokenAdjustPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("ปรับ TOKEN");
  const [actionType, setActionType] = useState<ActionType>("add");
  const [amount, setAmount] = useState("500");
  const [reason, setReason] = useState("");
  const [selectedUser, setSelectedUser] = useState({
    name: "ลลิตภัทร กันทา",
    role: "Staff",
    balance: 1200,
  });

  const users = [
    { name: "ลลิตภัทร กันทา", role: "Staff", balance: 1200 },
    { name: "ณัฐพงศ์ พรมมาตร", role: "Admin", balance: 3500 },
    { name: "สมชาย ใจดี", role: "User", balance: 450 },
    { name: "ร้านน้ำเย็น", role: "Vendor", balance: 95 },
    { name: "ร้านขนมหวาน", role: "Vendor", balance: 230 },
  ];

  const [showUserList, setShowUserList] = useState(false);

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("กรุณาระบุเหตุผล");
      return;
    }
    if (!amount || parseInt(amount) <= 0) {
      alert("กรุณาระบุจำนวน TOKEN");
      return;
    }

    const params = new URLSearchParams({
      user: selectedUser.name,
      type: actionType,
      amount: String(parseInt(amount)),
      before: String(selectedUser.balance),
      reason: reason,
    });

    router.push(`/head-admin/token/confirm?${params.toString()}`);
  };

  return (
    <div className="h-screen w-screen bg-[#FDF5EC] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-md mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link href="/head-admin" className="text-gray-700 text-xl">‹</Link>
              <h1 className="text-lg font-bold text-gray-800">ปรับ TOKEN / คืนเงิน</h1>
            </div>
            <span className="bg-[#9E4B8E] text-white text-xs font-semibold px-3 py-1 rounded-full">
              Head Admin
            </span>
          </div>

          {/* Mode Switch */}
          <div className="bg-white rounded-full p-1 flex mb-4 shadow-sm">
            {(["ปรับ TOKEN", "คืนเงิน"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-full text-xs font-semibold transition ${
                  mode === m
                    ? "bg-[#9E4B8E] text-white shadow-md"
                    : "text-gray-500"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Select User */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              เลือกผู้ใช้
            </label>
            <div className="relative">
              <button
                onClick={() => setShowUserList(!showUserList)}
                className="w-full bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-[#2D9D8F] flex-shrink-0"></div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {selectedUser.name}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {selectedUser.role} · ยอดคงเหลือ {selectedUser.balance.toLocaleString()} TOKEN
                  </p>
                </div>
                <span className="text-gray-400">⌄</span>
              </button>

              {/* Dropdown */}
              {showUserList && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-10 overflow-hidden">
                  {users.map((user) => (
                    <button
                      key={user.name}
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserList(false);
                      }}
                      className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#2D9D8F] flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-500">{user.role} · {user.balance.toLocaleString()} TOKEN</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Type */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              ประเภทรายการ
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActionType("add")}
                className={`py-3 rounded-xl text-xs font-semibold transition ${
                  actionType === "add"
                    ? "bg-[#F5EAFE] text-[#9E4B8E] border-2 border-[#9E4B8E]"
                    : "bg-white text-gray-500 border-2 border-gray-200"
                }`}
              >
                + เพิ่ม TOKEN
              </button>
              <button
                onClick={() => setActionType("deduct")}
                className={`py-3 rounded-xl text-xs font-semibold transition ${
                  actionType === "deduct"
                    ? "bg-[#F5EAFE] text-[#9E4B8E] border-2 border-[#9E4B8E]"
                    : "bg-white text-gray-500 border-2 border-gray-200"
                }`}
              >
                − หัก TOKEN
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              จำนวน TOKEN
            </label>
            <div className="bg-white rounded-xl p-3 flex items-center gap-2 shadow-sm">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 text-2xl font-bold text-gray-800 outline-none bg-transparent"
                placeholder="0"
                min="0"
              />
              <span className="text-xs text-gray-500 font-semibold">TOKEN</span>
            </div>
          </div>

          {/* Reason */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              เหตุผล
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white rounded-xl p-3 text-sm text-gray-800 outline-none shadow-sm resize-none"
              placeholder="ระบุเหตุผล เช่น ระบบขัดข้อง / คืนส่วนเกิน"
              rows={3}
            />
            <p className="text-[10px] text-gray-500 mt-2">
              ทุกรายการจะถูกบันทึกใน Audit Log
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#9E4B8E] text-white text-sm font-semibold py-3.5 rounded-xl shadow-lg active:scale-95 transition"
          >
            ตรวจสอบรายการ
          </button>

        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-2 py-2 flex items-center justify-around">
        <Link href="/head-admin/report" className="flex flex-col items-center text-gray-400 py-1">
          <span className="text-xl">📊</span>
          <span className="text-[10px] mt-0.5">รายงาน</span>
        </Link>
        <Link href="/head-admin" className="flex flex-col items-center text-gray-400 py-1">
          <span className="text-xl">👥</span>
          <span className="text-[10px] mt-0.5">บัญชี</span>
        </Link>
        <Link href="/head-admin/audit" className="flex flex-col items-center text-gray-400 py-1">
          <span className="text-xl">📋</span>
          <span className="text-[10px] mt-0.5">Audit Log</span>
        </Link>
        <Link href="/head-admin/token" className="flex flex-col items-center text-[#9E4B8E] py-1">
          <span className="text-xl">💾</span>
          <span className="text-[10px] mt-0.5 font-semibold">ปรับ TOKEN</span>
        </Link>
      </nav>
    </div>
  );
}