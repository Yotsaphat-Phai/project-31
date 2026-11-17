"use client";

import { useRouter } from "next/navigation";
import BottomNavMain from "./_components/BottomNavMain";
import { avatarPalette, event, useCustomers } from "./_lib/mockUsers";

function QuickTile({
  label,
  color,
  onClick,
  children,
}: {
  label: string;
  color: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 border-[#f3e3d3] bg-white py-4"
    >
      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-[#1f2a2e] stroke-[1.8]">
          {children}
        </svg>
      </span>
      <span className="text-sm font-medium text-[#1f2a2e]">{label}</span>
    </button>
  );
}

export default function StaffHomePage() {
  const router = useRouter();
  const { list } = useCustomers();

  // ไม่จำกัดจำนวน — แสดงแค่ยอดเช็คอินปัจจุบัน ไม่มีเพดาน
  const checkedInCount = list.filter((c) => c.checkedIn).length;

  const recent = list
    .filter((c) => c.checkedIn && c.checkedInAt)
    .sort((a, b) => (a.checkedInAt! < b.checkedInAt! ? 1 : -1))
    .slice(0, 2);

  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col bg-[#fdf6ee]">
      {/* Header — เอาปุ่มกระดิ่งและ avatar ออก เหลือแค่คำทักทาย */}
      <header className="px-5 pt-5">
        <p className="text-xs text-neutral-500">สวัสดีตอนเช้า</p>
        <h1 className="mt-0.5 text-xl font-semibold text-[#1f2a2e]">
          ลลิตภัทร <span>👋</span>
        </h1>
      </header>

      {/* Event card */}
      <section className="mx-5 mt-5 rounded-3xl bg-[#f0705a] p-5 text-white shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/25 px-3 py-1 text-[11px] font-semibold">
            {event.onDuty ? "ON DUTY" : "OFF DUTY"} · {event.shift}
          </span>
          <span className="pt-1 text-[11px] text-white/85">
            {event.dateLabel} · {event.timeLabel}
          </span>
        </div>

        <h2 className="mt-3 text-2xl font-bold leading-snug">{event.name}</h2>
        <p className="mt-1 text-sm text-white/85">{event.venue}</p>

        {/* นับผู้เช็คอินสะสม — ไม่จำกัดจำนวน จึงไม่มีเพดานหรือ progress bar */}
        <div className="mt-5 flex items-end justify-between">
          <span className="text-sm text-white/85">เช็คอินแล้ว</span>
          <span className="text-3xl font-bold leading-none">
            {checkedInCount.toLocaleString()}{" "}
            <span className="text-base font-medium text-white/85">คน</span>
          </span>
        </div>
      </section>

      {/* Big scan button */}
      <button
        onClick={() => router.push("/staff/scan")}
        className="mx-5 mt-4 flex items-center justify-center gap-3 rounded-2xl bg-[#1f2a2e] py-4 text-base font-semibold text-white"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
          <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />
          <path d="M8 8h3v3H8zM13 8h3v3h-3zM8 13h3v3H8zM13 13h3v3h-3z" />
        </svg>
        สแกนตั๋ว เช็คอิน
      </button>

      {/* Quick actions — เหลือสองปุ่ม เอา "แจ้งปัญหา" ออก */}
      <div className="mx-5 mt-4 flex gap-3">
        <QuickTile
          label="รายชื่อ"
          color="bg-[#fbe0d9]"
          onClick={() => router.push("/staff/participants")}
        >
          <circle cx="9" cy="9" r="3" />
          <circle cx="17" cy="10" r="2.2" />
          <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <path d="M14.5 19c0-2.4 1.6-4.5 4-4.8" />
        </QuickTile>
        <QuickTile
          label="ค้นชื่อ"
          color="bg-[#fbeecf]"
          onClick={() => router.push("/staff/search")}
        >
          <circle cx="11" cy="11" r="6" />
          <path d="M20 20l-4.5-4.5" />
        </QuickTile>
      </div>

      {/* Recent check-ins */}
      <section className="mx-5 mt-5 flex-1 rounded-3xl border-2 border-[#f3e3d3] bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1f2a2e]">เช็คอินล่าสุด</h3>
          <button
            onClick={() => router.push("/staff/participants")}
            className="text-xs font-semibold text-[#f0705a]"
          >
            ดูทั้งหมด →
          </button>
        </div>

        <ul className="mt-3 divide-y divide-[#f5ead9]">
          {recent.length === 0 && (
            <li className="py-6 text-center text-sm text-neutral-500">
              ยังไม่มีการเช็คอิน
            </li>
          )}
          {recent.map((a, i) => (
            <li key={a.id} className="flex items-center gap-3 py-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
                  avatarPalette[i % avatarPalette.length]
                }`}
              >
                {a.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#1f2a2e]">{a.name}</p>
                <p className="truncate text-xs text-neutral-500">
                  ตั๋ว{a.kind}
                  {a.table ? ` · โต๊ะ ${a.table}` : ""}
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium text-[#2f8f7f]">
                ✓ {a.checkedInAt}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <BottomNavMain active="home" />
    </main>
  );
}
