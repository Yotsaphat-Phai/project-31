"use client";

import { useRouter } from "next/navigation";
import BottomNavMain from "../_components/BottomNavMain";
import { event, staffProfile, useCustomers } from "../_lib/mockUsers";

type RowProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
};

function Row({ icon, label, value, onClick, danger }: RowProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          danger ? "bg-[#fbe3dc] text-[#d94e35]" : "bg-[#fbeecf] text-[#1f2a2e]"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
          {icon}
        </svg>
      </span>
      <span className={`flex-1 text-sm font-medium ${danger ? "text-[#d94e35]" : "text-[#1f2a2e]"}`}>
        {label}
      </span>
      {value && <span className="text-xs text-neutral-500">{value}</span>}
      {!danger && (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-neutral-400 stroke-2">
          <path d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}

export default function StaffAccountPage() {
  const router = useRouter();
  const { list } = useCustomers();

  // สถิติของ Staff คนนี้ในกะปัจจุบัน
  const myCheckedIn = list.filter((a) => a.checkedIn).length;
  const myTopup = list.reduce((sum, a) => sum + a.pending, 0);

  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col bg-[#fdf6ee]">
      {/* Header */}
      <header className="px-5 pt-5">
        <h1 className="text-xl font-semibold text-[#1f2a2e]">บัญชีของฉัน</h1>
      </header>

      {/* Profile card */}
      <section className="mx-5 mt-4 flex items-center gap-4 rounded-3xl border-2 border-[#f3e3d3] bg-white p-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f3a9a0] text-xl font-semibold text-white">
          {staffProfile.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-[#1f2a2e]">
            {staffProfile.name}
          </p>
          <p className="truncate text-xs text-neutral-500">{staffProfile.role}</p>
          <p className="mt-1 truncate text-[11px] text-neutral-400">
            รหัส {staffProfile.employeeId}
          </p>
        </div>
      </section>

      {/* Shift info */}
      <section className="mx-5 mt-3 rounded-3xl bg-[#f0705a] p-4 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
          กะปัจจุบัน
        </p>
        <p className="mt-1 text-base font-semibold">{staffProfile.shift}</p>
        <p className="text-xs text-white/85">
          {event.name} · {event.venue}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/25 pt-3">
          <div>
            <p className="text-2xl font-bold">{myCheckedIn}</p>
            <p className="text-[11px] text-white/85">เช็คอินวันนี้</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{myTopup.toLocaleString()}</p>
            <p className="text-[11px] text-white/85">TOKEN ที่เติม</p>
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="mx-5 mt-4 overflow-hidden rounded-3xl border-2 border-[#f3e3d3] bg-white">
        <p className="px-4 pt-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          ข้อมูลติดต่อ
        </p>
        <Row
          icon={
            <>
              <path d="M4 6h16v12H4z" />
              <path d="M4 7l8 6 8-6" />
            </>
          }
          label="อีเมล"
          value={staffProfile.email}
        />
        <div className="mx-4 border-t border-[#f5ead9]" />
        <Row
          icon={<path d="M5 4h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z" />}
          label="เบอร์โทร"
          value={staffProfile.phone}
        />
      </section>

      {/* Settings */}
      <section className="mx-5 mt-4 overflow-hidden rounded-3xl border-2 border-[#f3e3d3] bg-white">
        <p className="px-4 pt-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          ตั้งค่า
        </p>
        <Row
          icon={
            <>
              <path d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15z" strokeLinejoin="round" />
              <path d="M10 19a2 2 0 004 0" />
            </>
          }
          label="การแจ้งเตือน"
        />
        <div className="mx-4 border-t border-[#f5ead9]" />
        <Row
          icon={
            <>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51h.01a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </>
          }
          label="ตั้งค่าแอป"
        />
        <div className="mx-4 border-t border-[#f5ead9]" />
        <Row
          icon={
            <>
              <circle cx="12" cy="12" r="9" />
              <path d="M9.1 9a3 3 0 115.8 1c0 2-3 2-3 4M12 17v.5" />
            </>
          }
          label="ช่วยเหลือ"
        />
      </section>

      {/* Logout */}
      <section className="mx-5 mb-5 mt-4 overflow-hidden rounded-3xl border-2 border-[#f3e3d3] bg-white">
        <Row
          icon={
            <>
              <path d="M15 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4" />
              <path d="M10 8l-4 4 4 4M6 12h10" />
            </>
          }
          label="ออกจากระบบ"
          danger
          onClick={() => {
            if (confirm("ต้องการออกจากระบบใช่หรือไม่?")) router.push("/staff");
          }}
        />
      </section>

      <BottomNavMain active="account" />
    </main>
  );
}
