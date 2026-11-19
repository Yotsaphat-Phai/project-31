"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCustomers } from "../../_lib/mockUsers";

const THAI_MONTH_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];
function thaiDateLabel(d: Date) {
  return `${d.getDate()} ${THAI_MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}
function thaiTimeLabel(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm} น.`;
}
function paymentChannelLabel(method: string) {
  switch (method) {
    case "promptpay": return "พร้อมเพย์";
    case "cash":      return "เงินสด";
    case "qr":        return "QR พร้อมเพย์";
    case "credit":
    default:          return "บัตรเครดิต";
  }
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fbe0d9]">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-[#f0705a] stroke-2">
          {icon}
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-neutral-500">{label}</p>
        <p className="text-sm font-semibold text-[#1f2a2e]">{value}</p>
      </div>
    </li>
  );
}

function TopupSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();

  const id = params.get("id") ?? "";
  const amount = Number(params.get("amount") ?? "0") || 0;
  const method = params.get("method") ?? "credit";
  const last4 = params.get("last4") ?? "1234";

  const { find, loaded } = useCustomers();
  const user = find(id);

  const [now] = useState<Date>(() => new Date());
  const dateLabel = useMemo(() => thaiDateLabel(now), [now]);
  const timeLabel = useMemo(() => thaiTimeLabel(now), [now]);

  const currentBalance = user ? user.token + user.pending : amount;

  useEffect(() => {
    if (loaded && amount <= 0) {
      router.replace("/staff/topup-scan");
    }
  }, [loaded, amount, router]);

  if (!loaded) return null;

  const channelText = `${paymentChannelLabel(method)}${
    method === "credit" || !method ? ` •••• ${last4}` : ""
  }`;

  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col bg-[#fdf6ee] px-4 pb-5 pt-5">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-neutral-500">เติมโทเคน</p>
          <h1 className="mt-0.5 text-[22px] font-bold leading-tight text-[#1f2a2e]">
            สำเร็จแล้ว! <span aria-hidden>🎉</span>
          </h1>
        </div>
        <button
          onClick={() => router.push("/staff")}
          aria-label="หน้าหลัก"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f3e3d3] bg-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-[#1f2a2e] stroke-2">
            <path d="M3 11l9-7 9 7" />
            <path d="M5 10v9h14v-9" />
          </svg>
        </button>
      </header>

      {/* Coin illustration */}
      <section className="mt-3 flex flex-col items-center">
        <div className="relative s-pop-in">
          <span className="absolute -left-4 top-0 text-lg text-[#e8b96a] s-sparkle">✦</span>
          <span className="absolute -right-4 top-2 text-sm text-[#e8b96a] s-sparkle" style={{ animationDelay: "0.4s" }}>✧</span>
          <svg viewBox="0 0 140 110" className="h-24 w-32" aria-hidden>
            <ellipse cx="55" cy="88" rx="38" ry="12" fill="#c9872a" />
            <ellipse cx="55" cy="84" rx="38" ry="12" fill="#f5b04b" />
            <ellipse cx="55" cy="80" rx="38" ry="12" fill="#c9872a" />
            <ellipse cx="55" cy="76" rx="38" ry="12" fill="#f5b04b" />
            <circle cx="55" cy="55" r="32" fill="#c9872a" />
            <circle cx="55" cy="52" r="32" fill="#f5b04b" />
            <circle cx="55" cy="52" r="24" fill="#f6c36f" />
            <path d="M55 38l4.3 8.7 9.6 1.4-7 6.8 1.7 9.5L55 60l-8.6 4.5 1.7-9.5-7-6.8 9.6-1.4z" fill="#c9872a" />
            <circle cx="98" cy="40" r="26" fill="#c9872a" />
            <circle cx="98" cy="37" r="26" fill="#f5b04b" />
            <circle cx="98" cy="37" r="19" fill="#f6c36f" />
            <path d="M98 24l3.4 7 7.7 1.1-5.6 5.4 1.3 7.6L98 41.5l-6.9 3.6 1.3-7.6-5.6-5.4 7.7-1.1z" fill="#c9872a" />
          </svg>
        </div>

        <div className="relative z-10 -mt-3 flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 shadow-[0_4px_12px_-6px_rgba(31,42,46,0.2)]">
          <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#f0705a] text-[10px] font-bold text-white">
            ✓
          </span>
          <span className="text-sm font-semibold text-[#1f2a2e]">เติมโทเคนสำเร็จ</span>
        </div>
      </section>

      {/* Amount card */}
      <section className="s-rise mt-3 overflow-hidden rounded-[22px] bg-white shadow-[0_8px_24px_-16px_rgba(31,42,46,0.15)]">
        <div className="flex items-center justify-between bg-gradient-to-br from-[#f0705a] to-[#e85a40] px-4 py-2 text-white">
          <span className="flex items-center gap-2 text-xs font-semibold">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <circle cx="9" cy="13" r="6" opacity="0.85" />
              <circle cx="15" cy="10" r="6" />
            </svg>
            จำนวนโทเคนที่ได้รับ
          </span>
          <span className="text-sm">✦</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <svg viewBox="0 0 48 48" className="h-12 w-12 shrink-0" aria-hidden>
            <circle cx="18" cy="28" r="14" fill="#c9872a" />
            <circle cx="18" cy="26" r="14" fill="#f5b04b" />
            <circle cx="18" cy="26" r="10" fill="#f6c36f" />
            <path d="M18 18l1.8 3.7 4.1.6-3 2.9.7 4-3.6-1.9-3.6 1.9.7-4-3-2.9 4.1-.6z" fill="#c9872a" />
            <circle cx="31" cy="20" r="11" fill="#c9872a" />
            <circle cx="31" cy="18" r="11" fill="#f5b04b" />
            <circle cx="31" cy="18" r="8" fill="#f6c36f" />
            <path d="M31 11l1.4 3 3.1.4-2.3 2.1.6 3L31 18l-2.8 1.5.6-3-2.3-2.1 3.1-.4z" fill="#c9872a" />
          </svg>

          <div className="flex-1">
            <p className="text-2xl font-extrabold leading-none text-[#1f2a2e]">
              + {amount.toLocaleString()}{" "}
              <span className="text-sm font-semibold text-neutral-500">โทเคน</span>
            </p>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">ยอดคงเหลือปัจจุบัน</span>
              <span className="rounded-full bg-[#fbe0d9] px-2.5 py-0.5 text-[11px] font-bold text-[#f0705a]">
                {currentBalance.toLocaleString()} โทเคน
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Transaction details */}
      <section className="s-rise-150 mt-3 overflow-hidden rounded-[22px] bg-white shadow-[0_8px_24px_-16px_rgba(31,42,46,0.1)]">
        <ul className="divide-y divide-[#f5ead9] px-4">
          <InfoRow
            label="วันที่ทำรายการ"
            value={dateLabel}
            icon={
              <>
                <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
                <path d="M3.5 10h17M8 3v4M16 3v4" />
              </>
            }
          />
          <InfoRow
            label="เวลา"
            value={timeLabel}
            icon={
              <>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7v5l3 2" strokeLinecap="round" />
              </>
            }
          />
          <InfoRow
            label="ช่องทางการชำระเงิน"
            value={channelText}
            icon={
              <>
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <path d="M3 10h18" />
                <path d="M7 15h4" strokeLinecap="round" />
              </>
            }
          />
        </ul>
      </section>

      {/* Actions */}
      <div className="s-rise-300 mt-auto flex flex-col gap-2 pt-4">
        <button
          onClick={() => router.push("/staff")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f0705a] py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(240,112,90,0.9)]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
            <path d="M3 11l9-7 9 7" />
            <path d="M5 10v9h14v-9" />
          </svg>
          กลับหน้าหลัก
        </button>
        <button
          onClick={() => router.push("/staff/topup-scan")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#f3e3d3] bg-white py-3.5 text-sm font-semibold text-[#f0705a]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
            <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />
          </svg>
          เติม TOKEN ให้คนถัดไป
        </button>
      </div>
    </main>
  );
}

export default function StaffTopupSuccessPage() {
  return (
    <Suspense fallback={null}>
      <TopupSuccessContent />
    </Suspense>
  );
}
