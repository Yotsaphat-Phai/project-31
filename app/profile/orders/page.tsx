"use client";

// ประวัติการสั่งซื้อบัตร: ดึงจากคำสั่งซื้อจริงของ user ที่ login อยู่ — ยังไม่เคยซื้อจะแสดงว่าว่าง

import Link from "next/link";
import SubPage, { EmptyState, useMounted } from "../_components/SubPage";
import { events } from "../../_lib/mock";
import { getMyOrders } from "../../_lib/tickets";

export default function OrdersPage() {
  const mounted = useMounted();
  const orders = mounted ? getMyOrders() : [];

  return (
    <SubPage title="ประวัติการสั่งซื้อบัตร">
      {!mounted ? null : orders.length === 0 ? (
        <>
          <EmptyState icon="bi-receipt" text="ยังไม่มีประวัติการสั่งซื้อ" />
          <Link href="/events" className="block text-center text-[#E07A68] font-semibold">
            <i className="bi bi-ticket-perforated me-1.5" />ไปเลือกซื้อบัตร
          </Link>
        </>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const ev = events.find((e) => e.id === o.eventId);
            const date = new Date(o.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
            return (
              <Link key={o.orderId} href="/event/ticket" className="block bg-white rounded-2xl border border-[#EEE6E6] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{o.orderId} · {date}</span>
                  <span className="text-xs font-semibold text-[#4E9C8F] bg-[#4E9C8F1A] rounded-full px-2.5 py-1">
                    ชำระเงินแล้ว
                  </span>
                </div>
                <p className="mt-2 font-semibold text-[#2F2F45]">{ev?.title ?? "อีเวนต์"}</p>
                <p className="text-sm text-gray-500">
                  <i className="bi bi-ticket-perforated me-1.5" />
                  {o.tickets.length} ใบ · {o.total.toLocaleString()} บาท
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </SubPage>
  );
}
