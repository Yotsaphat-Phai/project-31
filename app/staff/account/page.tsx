"use client";

import { useRouter } from "next/navigation";
import BottomNavMain from "../_components/BottomNavMain";
import { useStaffProfile } from "../_lib/mockUsers";
import { signOut } from "../_lib/auth";

type RowProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
  last?: boolean;
};

function Row({ icon, label, value, onClick, danger, last }: RowProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-3.5 py-3 text-left ${
        !last ? "border-b border-[#f5ead9]" : ""
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          danger ? "bg-[#fbe3dc] text-[#d94e35]" : "bg-[#fbeecf] text-[#1f2a2e]"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]">
          {icon}
        </svg>
      </span>
      <span className={`flex-1 text-sm font-medium ${danger ? "text-[#d94e35]" : "text-[#1f2a2e]"}`}>
        {label}
      </span>
      {value && <span className="truncate text-xs text-neutral-500">{value}</span>}
      {!danger && (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-neutral-400 stroke-2">
          <path d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 ml-4 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
      {children}
    </p>
  );
}

export default function StaffAccountPage() {
  const staffProfile = useStaffProfile();
  const router = useRouter();

  const openMail = () =>
    typeof window !== "undefined" && window.location.assign(`mailto:${staffProfile.email}`);
  const openTel = () =>
    typeof window !== "undefined" && window.location.assign(`tel:${staffProfile.phone.replace(/-/g, "")}`);

  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col bg-[#fdf6ee]">
      {/* Header */}
      <header className="px-4 pt-5">
        <h1 className="text-xl font-semibold text-[#1f2a2e]">บัญชีของฉัน</h1>
      </header>

      {/* Profile card */}
      <section className="mx-4 mt-3 flex items-center gap-3 rounded-[22px] border border-[#f3e3d3] bg-white p-3.5">
        <div className="relative shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f3a9a0] text-xl font-semibold text-white">
            {staffProfile.initials}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#2f8f7f] ring-2 ring-white">
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-white stroke-[3]">
              <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-[#1f2a2e]">
            {staffProfile.name}
          </p>
          <p className="truncate text-xs text-neutral-500">{staffProfile.role}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-neutral-400">
            <span className="rounded bg-[#fbe3dc] px-1.5 py-0.5 text-[10px] font-semibold text-[#f0705a]">
              {staffProfile.employeeId}
            </span>
          </p>
        </div>
      </section>

      {/* Info */}
      <div className="mx-4 mt-4">
        <SectionHeader>ข้อมูลติดต่อ</SectionHeader>
        <section className="overflow-hidden rounded-[22px] border border-[#f3e3d3] bg-white">
          <Row
            icon={
              <>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M4 7l8 6 8-6" />
              </>
            }
            label="อีเมล"
            value={staffProfile.email}
            onClick={openMail}
          />
          <Row
            icon={<path d="M5 4h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z" />}
            label="เบอร์โทร"
            value={staffProfile.phone}
            onClick={openTel}
            last
          />
        </section>
      </div>

      {/* Activity */}
      <div className="mx-4 mt-4">
        <SectionHeader>กิจกรรม</SectionHeader>
        <section className="overflow-hidden rounded-[22px] border border-[#f3e3d3] bg-white">
          <Row
            icon={
              <>
                <ellipse cx="12" cy="6" rx="7" ry="2.5" />
                <path d="M5 6v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
                <path d="M5 12v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
              </>
            }
            label="ประวัติการเติม TOKEN"
            onClick={() => router.push("/staff/topup-history")}
            last
          />
        </section>
      </div>

      {/* Settings */}
      <div className="mx-4 mt-4">
        <SectionHeader>ตั้งค่า</SectionHeader>
        <section className="overflow-hidden rounded-[22px] border border-[#f3e3d3] bg-white">
          <Row
            icon={
              <>
                <path d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15z" strokeLinejoin="round" />
                <path d="M10 19a2 2 0 004 0" />
              </>
            }
            label="การแจ้งเตือน"
            onClick={() => router.push("/staff/notifications")}
          />
          <Row
            icon={
              <>
                <circle cx="12" cy="12" r="9" />
                <path d="M9.1 9a3 3 0 115.8 1c0 2-3 2-3 4M12 17v.5" />
              </>
            }
            label="ช่วยเหลือ"
            onClick={() => router.push("/staff/help")}
            last
          />
        </section>
      </div>

      {/* Logout */}
      <div className="mx-4 mb-4 mt-4">
        <section className="overflow-hidden rounded-[22px] border border-[#f3e3d3] bg-white">
          <Row
            icon={
              <>
                <path d="M15 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4" />
                <path d="M10 8l-4 4 4 4M6 12h10" />
              </>
            }
            label="ออกจากระบบ"
            danger
            last
            onClick={() => {
              if (confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
                signOut();
                router.replace("/");
              }
            }}
          />
        </section>
        <p className="mt-2 text-center text-[10px] text-neutral-400">
          Staff App · เวอร์ชัน 1.0.0
        </p>
      </div>

      <BottomNavMain active="account" />
    </main>
  );
}
