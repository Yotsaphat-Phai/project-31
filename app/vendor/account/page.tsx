"use client";

// หน้าแรกของ Vendor หลัง login: บัญชีร้านค้า → เมนูไปหน้า QR รับเงิน / สแกน / ประวัติ

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "../../_lib/auth";
import { shops, type Shop } from "../../_lib/mock";

const noopSubscribe = () => () => {};

// ร้านของ vendor ที่ login อยู่ (ยังไม่ login / ไม่พบ → ร้านแรกใน mock)
function useMyShop(): Shop {
  const vendorId = useSyncExternalStore(
    noopSubscribe,
    () => getCurrentUser()?.id ?? "",
    () => ""
  );
  return shops.find((s) => s.vendorId === vendorId) ?? shops[0];
}

function MenuRow({
  href,
  icon,
  label,
  onClick,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="w-9 h-9 rounded-xl bg-[#FDF0DD] flex items-center justify-center text-[#E0A537] text-xs font-bold">
        {icon}
      </span>
      <span className="flex-1 text-[15px] text-gray-800">{label}</span>
      <span className="text-gray-300 text-lg">›</span>
    </>
  );
  const cls = "w-full flex items-center gap-4 px-4 py-4 text-left hover:bg-gray-50 transition";
  return href ? (
    <Link href={href} className={cls}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {content}
    </button>
  );
}

export default function VendorAccountPage() {
  const router = useRouter();
  const shop = useMyShop();

  const comingSoon = () => alert("ฟีเจอร์นี้ยังไม่เปิดใช้งาน");

  const handleLogout = () => {
    if (!confirm("ต้องการออกจากระบบใช่หรือไม่?")) return;
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen w-screen bg-gray-200 flex items-center justify-center p-4">
      {/* Phone Container (แบบเดียวกับหน้า vendor อื่น) */}
      <div className="w-full max-w-sm h-[844px] bg-[#FAF4EC] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-5 pt-8 pb-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">บัญชีร้านค้า</h1>
            <span className="bg-[#E0A537] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              Vendor
            </span>
          </div>

          {/* Shop card */}
          <div className="bg-white rounded-3xl p-5 mb-6">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-[#FDF0DD] flex items-center justify-center text-3xl">
                🏪
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{shop.name}</p>
                <p className="text-xs text-gray-400">
                  {shop.code} · {shop.category}
                </p>
              </div>
            </div>
            <div className="flex items-end justify-between pt-4">
              <div>
                <p className="text-xs text-gray-500">Token คงเหลือ</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {shop.token.toLocaleString()} <span className="text-sm">฿</span>
                </p>
              </div>
              <button
                type="button"
                onClick={comingSoon}
                className="bg-[#E0A537] text-white font-semibold px-5 py-3 rounded-xl border border-[#C88F25] active:scale-95 transition"
              >
                ถอนเงิน
              </button>
            </div>
          </div>

          {/* Shop menu */}
          <p className="text-xs text-gray-500 mb-2 ml-1">การจัดการร้าน</p>
          <div className="bg-white rounded-3xl overflow-hidden divide-y divide-gray-100 mb-4">
            <MenuRow icon="i" label="ข้อมูลร้าน" onClick={comingSoon} />
            <MenuRow href="/vendor/scan" icon="QR" label="QR รับเงินของร้าน" />
            <MenuRow
              icon={<i className="bi bi-people-fill text-[#7E57C2] text-base" />}
              label={`พนักงาน · ${shop.staffCount} คน`}
              onClick={comingSoon}
            />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full bg-white border border-gray-300 rounded-xl py-3 text-gray-800 hover:bg-gray-50 transition"
          >
            ออกจากระบบ
          </button>
        </div>

        {/* Bottom Navigation — 4 icons (consistent with other vendor pages) */}
        <nav className="bg-[#FAF4EC] px-6 py-4 flex items-center justify-around text-gray-900 border-t border-[#EADFCB]">
          <Link href="/vendor" aria-label="หน้าแรก" className="p-2 hover:text-[#D9A441] transition-colors">
            <i className="bi bi-house text-2xl" />
          </Link>
          <Link href="/vendor/scan" aria-label="สแกน / ขายสินค้า" className="p-2 hover:text-[#D9A441] transition-colors">
            <i className="bi bi-grid text-2xl" />
          </Link>
          <Link href="/vendor/history" aria-label="ประวัติรายการ" className="p-2 hover:text-[#D9A441] transition-colors">
            <i className="bi bi-list text-3xl" />
          </Link>
          <Link href="/vendor/account" aria-label="บัญชีร้านค้า" className="p-2 text-[#D9A441]">
            <i className="bi bi-person-fill text-2xl" />
          </Link>
        </nav>
      </div>
    </div>
  );
}
