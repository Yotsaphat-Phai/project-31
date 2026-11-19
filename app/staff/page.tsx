"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavMain from "./_components/BottomNavMain";
import { avatarPalette, event, useStaffProfile, useCustomers } from "./_lib/mockUsers";

function Icon({
  bg,
  children,
}: {
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-[#1f2a2e] stroke-[1.8]">
        {children}
      </svg>
    </span>
  );
}

export default function StaffHomePage() {
  const staffProfile = useStaffProfile();
  const router = useRouter();
  const { list } = useCustomers();

  // อัปเดตเวลาและคำทักทายตามเวลาจริง (เบา ๆ ทุก 60 วินาที)
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const recent = list
    .filter((c) => c.checkedIn && c.checkedInAt)
    .sort((a, b) => (a.checkedInAt! < b.checkedInAt! ? 1 : -1))
    .slice(0, 3);

  const timeNow = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col bg-[#fdf6ee]">
      {/* Header — avatar + ทักทาย */}
      <header className="flex items-center gap-3 px-4 pt-5">
        <button
          onClick={() => router.push("/staff/account")}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3a9a0] text-sm font-semibold text-white shadow-sm"
          aria-label="บัญชีของฉัน"
        >
          {staffProfile.initials}
        </button>
        <div>
          <p className="text-[11px] text-neutral-500">สวัสดี</p>
          <p className="-mt-0.5 text-[15px] font-semibold text-[#1f2a2e]">
            {staffProfile.name.split(" ")[0]} <span>👋</span>
          </p>
        </div>
      </header>

      {/* Event card */}
      <section className="mx-4 mt-3 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#f0705a] to-[#e85a40] p-4 text-white shadow-[0_12px_28px_-18px_rgba(240,112,90,0.9)]">
        <div className="flex items-start justify-end gap-2">
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] text-white/95 backdrop-blur">
            {timeNow} น.
          </span>
        </div>

        <h2 className="mt-2 text-[22px] font-bold leading-snug">{event.name}</h2>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/90">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
            <path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.6" />
          </svg>
          {event.venue}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-white/85">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
            <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
            <path d="M3.5 10h17M8 3v4M16 3v4" />
          </svg>
          {event.dateLabel} · {event.timeLabel} น.
        </p>

      </section>

      {/* Big scan button */}
      <button
        onClick={() => router.push("/staff/scan")}
        className="mx-4 mt-3 flex items-center justify-center gap-2.5 rounded-2xl bg-[#1f2a2e] py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-14px_rgba(31,42,46,0.65)]"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
          <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />
          <path d="M8 8h3v3H8zM13 8h3v3h-3zM8 13h3v3H8zM13 13h3v3h-3z" />
        </svg>
        สแกนตั๋ว เช็คอิน
      </button>

      {/* Quick actions — 3 ปุ่ม เพิ่ม QR demo */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2.5">
        <button
          onClick={() => router.push("/staff/participants")}
          className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#f3e3d3] bg-white py-3"
        >
          <Icon bg="bg-[#fbe0d9]">
            <circle cx="9" cy="9" r="3" />
            <circle cx="17" cy="10" r="2.2" />
            <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
            <path d="M14.5 19c0-2.4 1.6-4.5 4-4.8" />
          </Icon>
          <span className="text-xs font-medium text-[#1f2a2e]">รายชื่อ</span>
        </button>
        <button
          onClick={() => router.push("/staff/search")}
          className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#f3e3d3] bg-white py-3"
        >
          <Icon bg="bg-[#fbeecf]">
            <circle cx="11" cy="11" r="6" />
            <path d="M20 20l-4.5-4.5" />
          </Icon>
          <span className="text-xs font-medium text-[#1f2a2e]">ค้นชื่อ</span>
        </button>
        <button
          onClick={() => router.push("/staff/qr")}
          className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#f3e3d3] bg-white py-3"
        >
          <Icon bg="bg-[#d7ecd9]">
            <rect x="4" y="4" width="7" height="7" rx="1.5" />
            <rect x="13" y="4" width="7" height="7" rx="1.5" />
            <rect x="4" y="13" width="7" height="7" rx="1.5" />
            <path d="M13 13h3M16 20h4M20 13v4M13 17h2" />
          </Icon>
          <span className="text-xs font-medium text-[#1f2a2e]">QR ทดสอบ</span>
        </button>
      </div>

      {/* Recent check-ins */}
      <section className="mx-4 mb-4 mt-3 flex-1 rounded-[22px] border border-[#f3e3d3] bg-white p-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold text-[#1f2a2e]">เช็คอินล่าสุด</h3>
          <button
            onClick={() => router.push("/staff/participants")}
            className="text-xs font-semibold text-[#f0705a]"
          >
            ดูทั้งหมด →
          </button>
        </div>

        <ul className="mt-2 divide-y divide-[#f5ead9]">
          {recent.length === 0 && (
            <li className="py-8 text-center text-sm text-neutral-500">ยังไม่มีการเช็คอิน</li>
          )}
          {recent.map((a) => {
            const i = list.findIndex((x) => x.id === a.id);
            return (
              <li key={a.id} className="flex items-center gap-3 px-1 py-2.5">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
                    avatarPalette[(i >= 0 ? i : 0) % avatarPalette.length]
                  }`}
                >
                  {a.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#1f2a2e]">{a.name}</p>
                  <p className="truncate text-[11px] text-neutral-500">
                    ตั๋ว{a.kind}
                    {a.table ? ` · โต๊ะ ${a.table}` : ""}
                  </p>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#d7ecd9] px-2.5 py-1 text-[11px] font-semibold text-[#2f8f7f]">
                  <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current stroke-[2.5]">
                    <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {a.checkedInAt}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <BottomNavMain active="home" />
    </main>
  );
}
