"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

// เมนูล่าง — 4 เมนูหลัก ทำให้ปุ่ม active มีจุดบอกสถานะ + ช่องว่างกว้างขึ้นเล็กน้อย
// ทุกหน้าใช้ปุ่มเดียวกัน ไม่มีปุ่ม FAB กลางที่ยื่นออกมา ดูเนียนและเหมือนแอปจริง
type Tab = "home" | "topup" | "participants" | "account";

type ItemProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

function NavItem({ label, active = false, onClick, children }: ItemProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-1 flex-col items-center gap-0.5 py-1.5 text-[11px] transition-colors ${
        active ? "text-[#f0705a]" : "text-neutral-400"
      }`}
    >
      {/* จุดเล็กบอกสถานะ active ไว้บนปุ่ม */}
      <span
        aria-hidden
        className={`absolute top-0 h-1 w-1 rounded-full ${
          active ? "bg-[#f0705a]" : "bg-transparent"
        }`}
      />
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] fill-none stroke-current stroke-[1.8]">
        {children}
      </svg>
      <span className={active ? "font-semibold" : "font-medium"}>{label}</span>
    </button>
  );
}

export default function BottomNavMain({ active }: { active?: Tab }) {
  const router = useRouter();

  return (
    <nav className="sticky bottom-0 z-20 mt-auto flex border-t border-[#f3e3d3] bg-white/95 px-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1 backdrop-blur">
      <NavItem label="หน้าแรก" active={active === "home"} onClick={() => router.push("/staff")}>
        <path d="M4 11l8-7 8 7v8a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1z" />
      </NavItem>
      <NavItem
        label="เติม TOKEN"
        active={active === "topup"}
        onClick={() => router.push("/staff/topup-scan")}
      >
        <ellipse cx="12" cy="7" rx="7" ry="3" />
        <path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
      </NavItem>
      <NavItem
        label="ผู้เข้าร่วม"
        active={active === "participants"}
        onClick={() => router.push("/staff/participants")}
      >
        <circle cx="9" cy="9" r="3" />
        <circle cx="17" cy="10" r="2.2" />
        <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M14.5 19c0-2.4 1.6-4.5 4-4.8" />
      </NavItem>
      <NavItem label="บัญชี" active={active === "account"} onClick={() => router.push("/staff/account")}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
      </NavItem>
    </nav>
  );
}
