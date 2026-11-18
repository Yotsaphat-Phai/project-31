"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { event, useCustomers } from "../../_lib/mockUsers";

function buildTicketRef(userId: string) {
  const year = new Date().getFullYear();
  const seq = (userId || "0000").padStart(4, "0").slice(-4);
  return `#RC${year}-${seq}`;
}

const THAI_MONTH_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];
function thaiDateLabel(d: Date) {
  return `${d.getDate()} ${THAI_MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`;
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
      <div className="min-w-0">
        <p className="text-[11px] text-neutral-500">{label}</p>
        <p className="text-sm font-semibold text-[#1f2a2e]">{value}</p>
      </div>
    </li>
  );
}

function ScanSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { find, loaded } = useCustomers();
  const user = find(id);

  const [now] = useState<Date>(() => new Date());
  const [copied, setCopied] = useState(false);

  const ticketRef = buildTicketRef(user?.id ?? id);
  const dateLabel = thaiDateLabel(now);

  async function shareTicket() {
    const text = `${event.name}\nวันที่: ${dateLabel}\nเวลา: ${event.timeLabel} น.\nสถานที่: ${event.venue}\nหมายเลขตั๋ว: ${ticketRef}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: event.name, text });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  if (!loaded) return null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col bg-[#fdf6ee] px-4 pb-5 pt-5">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-neutral-500">สแกนตั๋ว</p>
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

      {/* Big checkmark */}
      <section className="mt-4 flex flex-col items-center gap-2">
        <div className="relative s-pop-in">
          <span className="absolute -left-3 -top-1 text-lg text-[#f0705a] s-sparkle">✦</span>
          <span className="absolute -right-4 top-1 text-sm text-[#f0705a] s-sparkle" style={{ animationDelay: "0.3s" }}>✧</span>
          <span className="absolute -bottom-1 -right-1 text-sm text-[#f0705a] s-sparkle" style={{ animationDelay: "0.6s" }}>✦</span>
          <div className="relative s-ring-expand">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#f3a9a0] shadow-[0_12px_28px_-12px_rgba(240,112,90,0.7)]">
              <svg viewBox="0 0 24 24" className="h-12 w-12 fill-none stroke-white stroke-[3]" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>
          </div>
        </div>
        <p className="text-sm font-semibold text-[#1f2a2e]">สแกนตั๋วสำเร็จ</p>
      </section>

      {/* Event info card */}
      <section className="s-rise mt-4 overflow-hidden rounded-[22px] bg-white shadow-[0_8px_24px_-16px_rgba(31,42,46,0.15)]">
        <div className="bg-gradient-to-br from-[#f0705a] to-[#e85a40] px-4 py-3 text-white">
          <h2 className="text-base font-bold leading-snug">{event.name}</h2>
          <p className="mt-0.5 text-[11px] text-white/85">{event.venue}</p>
        </div>

        <ul className="divide-y divide-[#f5ead9] px-4">
          <InfoRow
            label="วันที่จัดงาน"
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
            value={`${event.timeLabel} น.`}
            icon={
              <>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7v5l3 2" strokeLinecap="round" />
              </>
            }
          />
          <InfoRow
            label="สถานที่"
            value={event.venue}
            icon={
              <>
                <path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.6" />
              </>
            }
          />
        </ul>
      </section>

      {/* Ticket number + share */}
      <section className="s-rise-150 mt-3 flex items-center gap-3 rounded-2xl border border-[#f3e3d3] bg-white p-2.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fbe0d9]">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-[#f0705a] stroke-2">
            <path d="M4 8a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 100-4V8z" />
            <path d="M14 7v10" strokeDasharray="1.5 2" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-neutral-500">หมายเลขตั๋ว</p>
          <p className="truncate text-sm font-bold text-[#1f2a2e]">{ticketRef}</p>
        </div>
        <button
          onClick={shareTicket}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#f3a9a0] px-3.5 py-1.5 text-[11px] font-semibold text-white"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
            <circle cx="6" cy="12" r="2.2" />
            <circle cx="17" cy="6" r="2.2" />
            <circle cx="17" cy="18" r="2.2" />
            <path d="M8 11l7-4M8 13l7 4" />
          </svg>
          {copied ? "คัดลอกแล้ว" : "แชร์ตั๋ว"}
        </button>
      </section>

      {/* Home button */}
      <div className="s-rise-300 mt-auto pt-4">
        <button
          onClick={() => router.push("/staff")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1f2a2e] py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(31,42,46,0.6)]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
            <path d="M3 11l9-7 9 7" />
            <path d="M5 10v9h14v-9" />
          </svg>
          กลับหน้าหลัก
        </button>
      </div>
    </main>
  );
}

export default function StaffScanSuccessPage() {
  return (
    <Suspense fallback={null}>
      <ScanSuccessContent />
    </Suspense>
  );
}
