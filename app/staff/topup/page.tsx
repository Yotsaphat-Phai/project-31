"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { avatarPalette, useCustomers } from "../_lib/mockUsers";

const presets: number[] = [100, 200, 500, 1000];

function TopupContent() {
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { list, loaded, find, addPending } = useCustomers();
  const user = find(id);
  const userIndex = user ? list.findIndex((c) => c.id === user.id) : -1;

  const [amount, setAmount] = useState<number>(200);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAmount(200);
    setSubmitted(false);
  }, [id]);

  // กลับหน้าสแกน topup แบบเริ่มใหม่
  const backToScan = () => router.push("/staff/topup-scan");

  if (!loaded) return null;

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5">
        <p className="text-neutral-500">ไม่พบข้อมูลผู้ใช้ กรุณาสแกน QR ใหม่</p>
        <button
          onClick={backToScan}
          className="rounded-xl bg-[#f0705a] px-6 py-3 font-semibold text-white"
        >
          กลับไปหน้าสแกน
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2f8f7f] text-3xl text-white">
          ✓
        </div>
        <p className="text-lg font-semibold text-[#1f2a2e]">ส่งคำขอเติม TOKEN แล้ว</p>
        <p className="text-sm text-neutral-500">
          {user.name} · +{amount.toLocaleString()} TOKEN
          <br />
          รอแอดมินอนุมัติ
        </p>
        <button
          onClick={backToScan}
          className="mt-4 w-full rounded-xl bg-[#f0705a] py-3.5 font-semibold text-white"
        >
          กลับไปหน้าสแกน
        </button>
      </div>
    );
  }

  function confirm() {
    if (!user || amount <= 0) return;
    addPending(user.id, amount);
    setSubmitted(true);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 pt-5">
      {/* User */}
      <section className="flex items-center gap-3 rounded-2xl border-2 border-[#f3e3d3] bg-white p-4">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white ${
            avatarPalette[(userIndex >= 0 ? userIndex : 0) % avatarPalette.length]
          }`}
        >
          {user.initials}
        </span>
        <div>
          <p className="font-semibold text-[#1f2a2e]">{user.name}</p>
          <p className="text-xs text-neutral-500">
            {user.kind} · #{user.id}
            {user.table ? ` · โต๊ะ ${user.table}` : ""}
          </p>
        </div>
      </section>

      {/* Amount */}
      <section>
        <label className="mb-1.5 block text-xs text-neutral-500">จำนวน TOKEN ที่เติม</label>
        <input
          type="text"
          inputMode="numeric"
          value={amount || ""}
          placeholder="0"
          onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "")) || 0)}
          className="w-full rounded-2xl border-2 border-[#f0705a] bg-white py-3 text-center text-3xl font-bold text-[#1f2a2e] outline-none"
        />
        <div className="mt-3 grid grid-cols-4 gap-2">
          {presets.map((n) => (
            <button
              key={n}
              onClick={() => setAmount(n)}
              className={`rounded-full py-2 text-sm font-semibold ${
                n === amount
                  ? "bg-[#f0705a] text-white"
                  : "border-2 border-[#f3e3d3] bg-white text-[#1f2a2e]"
              }`}
            >
              {n.toLocaleString()}
            </button>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="rounded-2xl border-2 border-[#f3e3d3] bg-white p-4 text-sm">
        <div className="flex justify-between py-1">
          <span className="text-neutral-500">ยอดเดิม</span>
          <span className="font-semibold text-[#1f2a2e]">{user.token.toLocaleString()}</span>
        </div>
        {user.pending > 0 && (
          <div className="flex justify-between py-1">
            <span className="text-neutral-500">รออนุมัติ</span>
            <span className="font-semibold text-neutral-500">
              +{user.pending.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex justify-between py-1">
          <span className="text-neutral-500">ยอดที่เติม</span>
          <span className="font-semibold text-[#2f8f7f]">+{amount.toLocaleString()}</span>
        </div>
        <hr className="my-2 border-neutral-200" />
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#1f2a2e]">ยอดหลังเติม</span>
          <span className="text-2xl font-bold text-[#f0705a]">
            {(user.token + user.pending + amount).toLocaleString()}
          </span>
        </div>
      </section>

      <p className="rounded-xl bg-[#fbe3dc] px-4 py-3 text-center text-xs leading-relaxed text-[#1f2a2e]">
        ตรวจสอบจำนวนก่อนยืนยัน
        <br />
        TOKEN ที่เติมแล้วจะไม่สามารถยกเลิกได้
      </p>

      <div className="mt-auto flex flex-col gap-3 pb-6">
        <button
          onClick={confirm}
          disabled={amount <= 0}
          className="rounded-xl bg-[#f0705a] py-3.5 font-semibold text-white disabled:opacity-40"
        >
          ยืนยันเติม TOKEN
        </button>
        <button
          onClick={backToScan}
          className="rounded-xl border-2 border-[#f3e3d3] bg-white py-3.5 font-semibold text-[#1f2a2e]"
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
}

export default function StaffTopupPage() {
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col bg-[#fdf6ee]">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-lg font-semibold text-[#1f2a2e]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          เติม TOKEN
        </button>
        <button
          onClick={() => router.push("/staff")}
          className="text-xs font-semibold text-[#f0705a]"
        >
          หน้าหลัก
        </button>
      </header>

      <Suspense fallback={null}>
        <TopupContent />
      </Suspense>
    </main>
  );
}
