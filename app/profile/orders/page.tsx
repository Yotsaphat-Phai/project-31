import Link from "next/link";
import SubPage from "../_components/SubPage";
import { events } from "../../_lib/mock";

// TODO: ดึงคำสั่งซื้อจริงจาก backend — ตอนนี้แสดงตัวอย่าง 1 รายการ
const orders = [{ id: "ORD-0001", eventId: events[0]?.id, qty: 1, status: "ชำระเงินแล้ว", at: "1 พ.ย. 2569" }];

export default function OrdersPage() {
  return (
    <SubPage title="ประวัติการสั่งซื้อบัตร">
      <div className="space-y-3">
        {orders.map((o) => {
          const ev = events.find((e) => e.id === o.eventId);
          return (
            <Link
              key={o.id}
              href="/event/ticket"
              className="block bg-white rounded-2xl border border-[#EEE6E6] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{o.id} · {o.at}</span>
                <span className="text-xs font-semibold text-[#4E9C8F] bg-[#4E9C8F1A] rounded-full px-2.5 py-1">
                  {o.status}
                </span>
              </div>
              <p className="mt-2 font-semibold text-[#2F2F45]">{ev?.title ?? "อีเวนต์"}</p>
              <p className="text-sm text-gray-500">
                <i className="bi bi-ticket-perforated me-1.5" />
                {o.qty} ใบ · {((ev?.price ?? 0) * o.qty).toLocaleString()} บาท
              </p>
            </Link>
          );
        })}
      </div>
    </SubPage>
  );
}
