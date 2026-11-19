"use client";

// หน้าโปรไฟล์ของ User: ข้อมูลส่วนตัว, สรุป TOKEN/บัตร, เมนูบัญชี และออกจากระบบ

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserBottomNav from "@/app/_components/UserBottomNav";
import { getCurrentUser, logout, type SessionUser } from "../_lib/auth";
import { getMyOrders } from "../_lib/tickets";
import { getMyTokenBalance } from "../_lib/tokens";

const noopSubscribe = () => () => {};
let cachedRaw: string | null = null;
let cachedUser: SessionUser | null = null;

// คืน object เดิมถ้าข้อมูลไม่เปลี่ยน (useSyncExternalStore ต้องการค่าที่ stable)
function readUser(): SessionUser | null {
  const u = getCurrentUser();
  const raw = u ? JSON.stringify(u) : null;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedUser = u;
  }
  return cachedUser;
}

// TODO: ดึงจาก backend จริงภายหลัง
// ยอด TOKEN จริง: อ่านจากข้อมูลที่ staff เติม/หัก (app/_lib/tokens.ts)

// จำนวนบัตรทั้งหมดของ user ที่ login อยู่ (นับจากทุกคำสั่งซื้อ)
function countMyTickets(): number {
  return getMyOrders().reduce((sum, o) => sum + o.tickets.length, 0);
}

type MenuItem = { icon: string; label: string; href: string; color: string; note?: string };

const accountMenu: MenuItem[] = [
  { icon: "bi-person-gear", label: "แก้ไขข้อมูลส่วนตัว", href: "/profile/edit", color: "#E07A68" },
  { icon: "bi-shield-lock", label: "เปลี่ยนรหัสผ่าน", href: "/profile/password", color: "#4E9C8F" },
];

const activityMenu: MenuItem[] = [
  { icon: "bi-ticket-perforated", label: "บัตรของฉัน", href: "/event/ticket", color: "#EBB654" },
  { icon: "bi-clock-history", label: "ประวัติการเติม / ใช้ TOKEN", href: "/profile/token-history", color: "#D9A53B" },
  { icon: "bi-receipt", label: "ประวัติการสั่งซื้อบัตร", href: "/profile/orders", color: "#A86BA6" },
];

const otherMenu: MenuItem[] = [
  { icon: "bi-question-circle", label: "ช่วยเหลือ / ติดต่อทีมงาน", href: "/profile/help", color: "#A86BA6" },
];

function MenuSection({ title, items }: { title: string; items: MenuItem[] }) {
  return (
    <section>
      <h3 className="px-2 mb-2 text-sm font-semibold text-gray-500">{title}</h3>
      <div className="bg-white rounded-2xl border border-[#EEE6E6] divide-y divide-[#F3ECEC]">
        {items.map((it) => (
          <Link key={it.label} href={it.href} className="flex items-center gap-3 px-4 py-3.5">
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${it.color}22` }}
            >
              <i className={`bi ${it.icon} text-lg`} style={{ color: it.color }} />
            </span>
            <span className="flex-1 text-[15px] text-[#2F2F45]">{it.label}</span>
            {it.note && <span className="text-sm text-gray-400">{it.note}</span>}
            <i className="bi bi-chevron-right text-gray-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useSyncExternalStore(noopSubscribe, readUser, () => null);
  const ticketCount = useSyncExternalStore(noopSubscribe, countMyTickets, () => 0);
  const tokenBalance = useSyncExternalStore(noopSubscribe, getMyTokenBalance, () => 0);

  const initial = user?.name.trim().charAt(0) ?? "?";

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <main className="min-h-screen bg-[#FDF5EC] pb-28">
      <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
        <h1 className="text-2xl font-bold text-[#2F2F45]">โปรไฟล์</h1>

        {/* ข้อมูลผู้ใช้ */}
        <div className="bg-white rounded-3xl border border-[#EEE6E6] p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E07A68] to-[#EBB654] flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-[#2F2F45] truncate">{user?.name ?? "ผู้ใช้งาน"}</p>
            <p className="text-sm text-gray-500 truncate">
              <i className="bi bi-envelope me-1.5" />
              {user?.email ?? "-"}
            </p>
            <p className="text-sm text-gray-500">
              <i className="bi bi-telephone me-1.5" />
              {user?.phone || "-"}
            </p>
          </div>
        </div>

        {/* สรุป */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/token" className="bg-white rounded-2xl border border-[#EEE6E6] py-4 text-center">
            <i className="bi bi-coin text-2xl text-[#D9A53B]" />
            <p className="text-lg font-bold text-[#2F2F45]">{tokenBalance.toLocaleString()}</p>
            <p className="text-xs text-gray-500">TOKEN คงเหลือ</p>
          </Link>
          <Link href="/event/ticket" className="bg-white rounded-2xl border border-[#EEE6E6] py-4 text-center">
            <i className="bi bi-ticket-perforated-fill text-2xl text-[#EBB654]" />
            <p className="text-lg font-bold text-[#2F2F45]">{ticketCount}</p>
            <p className="text-xs text-gray-500">บัตรของฉัน</p>
          </Link>
        </div>

        <MenuSection title="บัญชี" items={accountMenu} />
        <MenuSection title="กิจกรรมของฉัน" items={activityMenu} />
        <MenuSection title="อื่นๆ" items={otherMenu} />

        <button
          onClick={handleLogout}
          className="w-full bg-white border border-[#F3C9C1] text-[#E07A68] font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2"
        >
          <i className="bi bi-box-arrow-right" />
          ออกจากระบบ
        </button>
      </div>

      <UserBottomNav active="profile" />
    </main>
  );
}
