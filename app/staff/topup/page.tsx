"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { avatarPalette, useCustomers } from "../_lib/mockUsers";

const presets: number[] = [100, 200, 500, 1000];

type PayMethod = "credit" | "promptpay" | "cash";

function TopupContent() {
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { list, loaded, find, adjustToken } = useCustomers();
  const user = find(id);
  const userIndex = user ? list.findIndex((c) => c.id === user.id) : -1;

  const [amount, setAmount] = useState<number>(200);
  const [method, setMethod] = useState<PayMethod>("credit");
  const [mode, setMode] = useState<"add" | "deduct">("add");
  const [error, setError] = useState("");

  useEffect(() => {
    setAmount(200);
    setMethod("credit");
    setMode("add");
    setError("");
  }, [id]);

  const backToScan = () => router.push("/staff/topup-scan");

  if (!loaded) return null;

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fbe3dc]">
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-[#f0705a] stroke-2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16v.5" />
          </svg>
        </div>
        <p className="text-sm text-neutral-500">ไม่พบข้อมูลผู้ใช้ กรุณาสแกน QR ใหม่</p>
        <button
          onClick={backToScan}
          className="rounded-xl bg-[#f0705a] px-6 py-3 text-sm font-semibold text-white"
        >
          กลับไปหน้าสแกน
        </button>
      </div>
    );
  }

  function confirm() {
    if (!user || amount <= 0) return;
    const delta = mode === "add" ? amount : -amount;
    const ok = adjustToken(user.id, delta, mode === "add" ? "เติม TOKEN โดย Staff" : "หัก TOKEN โดย Staff");
    if (!ok) return setError("TOKEN ไม่พอให้หัก");
    const qs = new URLSearchParams({
      id: user.id,
      amount: String(amount),
      mode,
      method,
      last4: "1234",
    });
    router.push(`/staff/topup/success?${qs.toString()}`);
  }

  const verb = mode === "add" ? "เติม" : "หัก";
  const sign = mode === "add" ? "+" : "-";

  const methodOptions: { key: PayMethod; label: string; icon: React.ReactNode }[] = [
    {
      key: "credit",
      label: "บัตรเครดิต",
      icon: (
        <>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18M7 15h4" strokeLinecap="round" />
        </>
      ),
    },
    {
      key: "promptpay",
      label: "พร้อมเพย์",
      icon: (
        <>
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <path d="M13 13h3M16 20h4M20 13v4" />
        </>
      ),
    },
    {
      key: "cash",
      label: "เงินสด",
      icon: (
        <>
          <rect x="3" y="7" width="18" height="10" rx="2" />
          <circle cx="12" cy="12" r="2.5" />
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-3 px-4 pt-3">
      {/* User card */}
      <section className="flex items-center gap-3 rounded-2xl border border-[#f3e3d3] bg-white p-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white ${
            avatarPalette[(userIndex >= 0 ? userIndex : 0) % avatarPalette.length]
          }`}
        >
          {user.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#1f2a2e]">{user.name}</p>
          <p className="truncate text-[11px] text-neutral-500">
            {user.kind} · #{user.id}
            {user.table ? ` · โต๊ะ ${user.table}` : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-neutral-500">ยอดปัจจุบัน</p>
          <p className="text-sm font-bold text-[#f0705a]">{user.token.toLocaleString()}</p>
        </div>
      </section>

      {/* เติม / หัก */}
      <div className="flex rounded-xl bg-[#f3e3d3] p-1">
        {([["add", "เติม TOKEN"], ["deduct", "หัก TOKEN"]] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => { setMode(k); setError(""); }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
              mode === k ? "bg-white text-[#1f2a2e] shadow-sm" : "text-neutral-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Amount */}
      <section>
        <label className="mb-1.5 ml-1 block text-xs font-medium text-neutral-500">
          จำนวน TOKEN ที่{verb}
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={amount || ""}
            placeholder="0"
            onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "")) || 0)}
            className="w-full rounded-2xl border-2 border-[#f0705a] bg-white py-3 pr-16 text-center text-3xl font-bold text-[#1f2a2e] outline-none"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
            TOKEN
          </span>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {presets.map((n) => (
            <button
              key={n}
              onClick={() => setAmount(n)}
              className={`rounded-full py-1.5 text-[13px] font-semibold ${
                n === amount
                  ? "bg-[#f0705a] text-white shadow-[0_6px_14px_-8px_rgba(240,112,90,0.8)]"
                  : "border border-[#f3e3d3] bg-white text-[#1f2a2e]"
              }`}
            >
              {sign}{n.toLocaleString()}
            </button>
          ))}
        </div>
      </section>

      {/* Payment method (เฉพาะตอนเติม) */}
      {mode === "add" && (
      <section>
        <label className="mb-1.5 ml-1 block text-xs font-medium text-neutral-500">
          ช่องทางการชำระเงิน
        </label>
        <div className="grid grid-cols-3 gap-2">
          {methodOptions.map((m) => (
            <button
              key={m.key}
              onClick={() => setMethod(m.key)}
              className={`flex flex-col items-center gap-1 rounded-2xl border py-2.5 text-[12px] font-semibold ${
                m.key === method
                  ? "border-[#f0705a] bg-[#fbe3dc] text-[#1f2a2e]"
                  : "border-[#f3e3d3] bg-white text-[#1f2a2e]"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-[#f0705a] stroke-[1.8]">
                {m.icon}
              </svg>
              {m.label}
            </button>
          ))}
        </div>
      </section>
      )}

      {/* Summary */}
      <section className="rounded-2xl border border-[#f3e3d3] bg-white p-3 text-sm">
        <div className="flex justify-between py-0.5">
          <span className="text-neutral-500">ยอดเดิม</span>
          <span className="font-semibold text-[#1f2a2e]">{user.token.toLocaleString()}</span>
        </div>
        {user.pending > 0 && (
          <div className="flex justify-between py-0.5">
            <span className="text-neutral-500">รออนุมัติ</span>
            <span className="font-semibold text-[#c48a2a]">
              +{user.pending.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex justify-between py-0.5">
          <span className="text-neutral-500">ยอดที่{verb}</span>
          <span className={`font-semibold ${mode === "add" ? "text-[#2f8f7f]" : "text-[#d9534f]"}`}>{sign}{amount.toLocaleString()}</span>
        </div>
        <hr className="my-1.5 border-dashed border-neutral-200" />
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#1f2a2e]">ยอดหลัง{verb}</span>
          <span className="text-xl font-bold text-[#f0705a]">
            {(user.token + (mode === "add" ? amount : -amount)).toLocaleString()}
          </span>
        </div>
      </section>

      <p className="flex items-center gap-2 rounded-xl bg-[#fbe3dc] px-3 py-2 text-[11px] text-[#1f2a2e]">
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-[#f0705a] stroke-2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16v.5" />
        </svg>
        ตรวจสอบจำนวนก่อนยืนยัน — ทำรายการแล้วจะยกเลิกไม่ได้
      </p>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}
      {mode === "deduct" && amount > user.token && (
        <p className="text-center text-xs text-red-500">TOKEN ไม่พอ (มี {user.token.toLocaleString()})</p>
      )}

      <div className="mt-auto flex flex-col gap-2 pb-4">
        <button
          onClick={confirm}
          disabled={amount <= 0 || (mode === "deduct" && amount > user.token)}
          className="rounded-xl bg-[#f0705a] py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(240,112,90,0.9)] disabled:opacity-40"
        >
          ยืนยัน{verb} TOKEN ({amount.toLocaleString()})
        </button>
        <button
          onClick={backToScan}
          className="rounded-xl border border-[#f3e3d3] bg-white py-3 text-sm font-semibold text-[#1f2a2e]"
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
      <header className="flex items-center justify-between px-4 pt-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            aria-label="ย้อนกลับ"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-[#1f2a2e] stroke-2">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-[#1f2a2e]">เติม TOKEN</h1>
        </div>
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
