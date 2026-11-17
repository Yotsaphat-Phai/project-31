"use client";

// หน้าแรกของ Vendor หลัง login: Dashboard ร้านค้า
// - สแกน QR รับชำระ → /vendor/scan
// - รับชำระเร็ว (50/100/200/500) → /vendor/scan?amount=X
// - ดูทั้งหมด → /vendor/history
// - Bottom nav: หน้าแรก / สแกน / ประวัติ / บัญชีร้าน

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { getCurrentUser } from "../_lib/auth";
import { shops, type Shop } from "../_lib/mock";

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

// ===== Mock: ยอดรวมวันนี้ + รายการล่าสุด (ภายหลังย้ายไป mock.ts ได้) =====
const TODAY_TOTAL = 4250;

type RecentTx = {
  id: string;
  customerName: string;
  amount: number;
  time: string;
  status: "success";
};

const RECENT_TX: RecentTx[] = [
  { id: "T001", customerName: "PIZZARTH K.", amount: 350, time: "09:50", status: "success" },
];

const QUICK_AMOUNTS = [50, 100, 200, 500] as const;

export default function VendorHomePage() {
  const shop = useMyShop();

  return (
    <div className="min-h-screen w-screen bg-gray-200 flex items-center justify-center p-4">
      {/* Phone Container (match other vendor pages) */}
      <div className="w-full max-w-sm h-[844px] bg-[#FAF4EC] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4">
          {/* Header: shop code + name + status dot */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs text-gray-400">{shop.code}</p>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                {shop.name}
              </h1>
            </div>
            <div
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center"
              title="สถานะร้าน: เปิดอยู่"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#E85D5D]" />
            </div>
          </div>

          {/* Today's total card */}
          <div className="bg-white border border-[#F0E6D2] rounded-2xl px-5 py-4 mb-5 text-center shadow-sm">
            <p className="text-sm text-gray-500">ยอดรวมวันนี้</p>
            <p className="mt-1">
              <span className="text-3xl font-extrabold text-gray-900">
                {TODAY_TOTAL.toLocaleString()}
              </span>{" "}
              <span className="text-sm font-semibold text-[#C8A057]">TOKEN</span>
            </p>
          </div>

          {/* Scan QR button → /vendor/scan */}
          <Link
            href="/vendor/scan"
            className="w-full flex items-center justify-center gap-3 bg-[#D9A441] hover:bg-[#c8942f] active:scale-[0.98] transition text-white font-semibold py-4 rounded-2xl mb-6 shadow-md"
          >
            <i className="bi bi-qr-code text-2xl" />
            <span className="text-base">สแกน QR รับชำระ</span>
          </Link>

          {/* Quick receive amounts */}
          <p className="text-sm font-semibold text-gray-800 mb-2">รับชำระเร็ว</p>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {QUICK_AMOUNTS.map((amt) => (
              <Link
                key={amt}
                href={`/vendor/scan?amount=${amt}`}
                className="bg-white border border-gray-200 rounded-xl py-3 text-center text-gray-800 font-medium hover:border-[#D9A441] hover:text-[#D9A441] active:scale-95 transition"
              >
                {amt}
              </Link>
            ))}
          </div>

          {/* Recent transactions */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-800">รายการล่าสุด</p>
            <Link
              href="/vendor/history"
              className="text-sm text-[#D9A441] hover:underline flex items-center gap-0.5"
            >
              ดูทั้งหมด <span className="text-base leading-none">›</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl divide-y divide-gray-100 shadow-sm">
            {RECENT_TX.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">
                ยังไม่มีรายการ
              </p>
            ) : (
              RECENT_TX.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {tx.customerName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {tx.time} · รับชำระสำเร็จ
                    </p>
                  </div>
                  <p className="font-bold text-emerald-600">
                    +{tx.amount.toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Navigation (matches /vendor/account) */}
        <nav className="bg-[#FAF4EC] px-6 py-4 flex items-center justify-around text-gray-900 border-t border-[#EADFCB]">
          <Link
            href="/vendor"
            aria-label="หน้าแรก"
            className="p-2 text-[#D9A441]"
          >
            <i className="bi bi-house-fill text-2xl" />
          </Link>
          <Link
            href="/vendor/scan"
            aria-label="สแกน / ขายสินค้า"
            className="p-2 hover:text-[#D9A441] transition-colors"
          >
            <i className="bi bi-grid text-2xl" />
          </Link>
          <Link
            href="/vendor/history"
            aria-label="ประวัติรายการ"
            className="p-2 hover:text-[#D9A441] transition-colors"
          >
            <i className="bi bi-list text-3xl" />
          </Link>
          <Link
            href="/vendor/account"
            aria-label="บัญชีร้านค้า"
            className="p-2 hover:text-[#D9A441] transition-colors"
          >
            <i className="bi bi-person text-2xl" />
          </Link>
        </nav>
      </div>
    </div>
  );
}
