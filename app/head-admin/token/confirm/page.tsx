"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ConfirmContent() {
  const router = useRouter();
  const params = useSearchParams();

  const user = params.get("user") ?? "ลลิตภัทร กันทา";
  const type = params.get("type") ?? "add";
  const amount = Number(params.get("amount") ?? 500);
  const before = Number(params.get("before") ?? 1200);
  const reason = params.get("reason") ?? "ระบบขัดข้อง";

  const isAdd = type === "add";
  const after = isAdd ? before + amount : before - amount;

  const rows = [
    { label: "ผู้ใช้", value: user, color: "text-gray-800" },
    {
      label: "ประเภท",
      value: isAdd ? "เพิ่ม TOKEN" : "หัก TOKEN",
      color: isAdd ? "text-teal-600" : "text-red-500",
    },
    {
      label: "จำนวน",
      value: `${isAdd ? "+" : "-"}${amount.toLocaleString()} TOKEN`,
      color: "text-[#9E4B8E]",
    },
    { label: "ยอดก่อนปรับ", value: before.toLocaleString(), color: "text-gray-800" },
    { label: "ยอดหลังปรับ", value: after.toLocaleString(), color: "text-gray-800" },
    { label: "เหตุผล", value: reason, color: "text-gray-800" },
  ];

  const handleConfirm = () => {
    alert("บันทึกรายการเรียบร้อย");
    router.push("/head-admin/audit");
  };

  return (
    <div className="h-screen w-screen bg-[#FDF5EC] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button onClick={() => router.back()} className="text-gray-700 text-xl">‹</button>
              <h1 className="text-lg font-bold text-gray-800">ยืนยันรายการ</h1>
            </div>
            <span className="bg-[#9E4B8E] text-white text-xs font-semibold px-3 py-1 rounded-full">
              Head Admin
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 mb-4">
            <p className="text-sm font-bold text-gray-600 mb-3">สรุปรายการ</p>
            <div className="space-y-4">
              {rows.map((r) => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 text-red-500 text-xs rounded-xl p-3 mb-4">
            ตรวจสอบให้แน่ใจก่อนยืนยัน รายการนี้ย้อนกลับไม่ได้ และจะบันทึกใน Audit Log
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-[#B86BA6] text-white text-sm font-semibold py-3.5 rounded-xl mb-3 active:scale-95 transition"
          >
            ยืนยัน
          </button>
          <button
            onClick={() => router.back()}
            className="w-full bg-white border-2 border-[#B86BA6] text-[#B86BA6] text-sm font-semibold py-3.5 rounded-xl active:scale-95 transition"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>

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

export default function ConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmContent />
    </Suspense>
  );
}