"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

// เมนูล่าง — ปุ่มกลางเป็น "เติม TOKEN" (ไปหน้าสแกน topup)
// ส่วนปุ่มใหญ่ "สแกนตั๋ว เช็คอิน" ของหน้าแรกยังใช้งานเหมือนเดิม
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
      className={`flex flex-1 flex-col items-center gap-1 text-[11px] ${
        active ? "text-[#f0705a]" : "text-neutral-400"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.8]">
        {children}
      </svg>
      {label}
    </button>
  );
}

export default function BottomNavMain({ active }: { active?: Tab }) {
  const router = useRouter();

  return (
    <nav className="relative z-20 flex border-t border-[#f3e3d3] bg-white px-2 pb-3 pt-2">
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
