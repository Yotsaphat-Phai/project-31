"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

type ItemProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

function NavItem({ label, active = false, disabled = false, onClick, children }: ItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-1 flex-col items-center gap-1 text-[11px] disabled:opacity-40 ${
        active ? "text-[#2f8f7f]" : "text-neutral-400"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2">
        {children}
      </svg>
      {label}
    </button>
  );
}

type Props = {
  active: "scan" | "search";
  topupId?: string; // รหัสลูกค้าที่จะเติม TOKEN ถ้าไม่มีปุ่มจะกดไม่ได้
};

export default function BottomNav({ active, topupId }: Props) {
  const router = useRouter();

  return (
    <nav className="relative z-20 flex border-t border-neutral-200 bg-white py-2">
      <NavItem label="สแกน" active={active === "scan"} onClick={() => router.push("/staff/scan")}>
        <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M8 8h3v3H8zM13 13h3v3h-3z" />
      </NavItem>
      <NavItem label="ค้นหา" active={active === "search"} onClick={() => router.push("/staff/search")}>
        <circle cx="11" cy="11" r="6" />
        <path d="M20 20l-4.5-4.5" />
      </NavItem>
      <NavItem
        label="เติม TOKEN"
        disabled={!topupId}
        onClick={() => topupId && router.push(`/staff/topup?id=${encodeURIComponent(topupId)}`)}
      >
        <ellipse cx="12" cy="7" rx="7" ry="3" />
        <path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
      </NavItem>
    </nav>
  );
}
