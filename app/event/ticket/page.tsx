"use client";

// บัตรของฉัน: แสดงตามคำสั่งซื้อ — 1 คำสั่งซื้อมีได้หลายใบ, บัตร 1 ใบ = ผู้เข้าร่วม 1 คน (QR แยกกัน)
// แตะบัตร → เปิด sheet แสดง QR ของใบนั้น เลื่อนดูใบอื่นได้ ; Staff สแกน QR ได้ที่ /staff/scan

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import UserBottomNav from "@/app/_components/UserBottomNav";
import { events } from "../../_lib/mock";
import { getMyOrders, type Order, type OrderTicket } from "../../_lib/tickets";
import { getCustomer } from "../../staff/_lib/mockUsers";

const noop = () => () => {};

function useCheckedIn(code: string) {
  const c = getCustomer(code);
  return { checkedIn: c?.checkedIn ?? false, at: c?.checkedInAt };
}

function StatusChip({ code, dark = false }: { code: string; dark?: boolean }) {
  const { checkedIn, at } = useCheckedIn(code);
  const cls = checkedIn
    ? dark
      ? "bg-green-500/20 text-green-300"
      : "bg-[#E1F5EE] text-[#0F6E56]"
    : dark
      ? "bg-[#EBB654]/20 text-[#F2C14E]"
      : "bg-[#FBEAE5] text-[#B0503F]";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      <i className={`bi ${checkedIn ? "bi-check-circle-fill" : "bi-hourglass-split"}`} />
      {checkedIn ? `เช็คอินแล้ว${at ? ` · ${at}` : ""}` : "ยังไม่เช็คอิน"}
    </span>
  );
}

/* บัตร 1 ใบ แบบมีรอยฉีก — แตะเพื่อดู QR */
function TicketStub({ t, index, count, title, onOpen }: {
  t: OrderTicket; index: number; count: number; title: string; onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left bg-white rounded-2xl border border-[#EEE6E6] overflow-hidden active:scale-[0.99] transition"
    >
      <div className="bg-[#2F2F45] px-4 py-3 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs text-[#B9B9C6] truncate">{title}</p>
          <p className="text-white font-semibold truncate">{t.name}</p>
        </div>
        <p className="text-white text-lg font-bold shrink-0">
          {index + 1}<span className="text-xs text-[#9A9AB0]">/{count}</span>
        </p>
      </div>
      <div className="flex">
        <div className="flex-1 px-4 py-3 min-w-0">
          <p className="text-xs text-gray-400">หมายเลขบัตร</p>
          <p className="font-semibold text-[#2F2F45] tracking-wider mb-1.5">#{t.code}</p>
          <StatusChip code={t.code} />
        </div>
        <div className="w-24 border-l-2 border-dashed border-[#EEE6E6] flex flex-col items-center justify-center text-center text-xs text-gray-500 gap-1">
          <i className="bi bi-qr-code text-2xl text-[#2F2F45]" />
          แตะเพื่อ<br />แสดง QR
        </div>
      </div>
    </button>
  );
}

/* Sheet แสดง QR ทีละใบ เลื่อนซ้าย/ขวาได้ */
function QrSheet({ order, start, onClose }: { order: Order; start: number; onClose: () => void }) {
  const [cur, setCur] = useState(start);
  const t = order.tickets[cur];
  const ev = events.find((e) => e.id === order.eventId);
  const n = order.tickets.length;

  return (
    <div className="fixed inset-0 z-[60] bg-black/45 flex items-end" onClick={onClose}>
      <div
        className="w-full max-w-md mx-auto bg-[#FDF5EC] rounded-t-3xl p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`บัตรใบที่ ${cur + 1} จาก ${n}`}
      >
        <div className="flex items-center justify-between">
          <p className="font-bold text-[#2F2F45]">บัตรใบที่ {cur + 1} จาก {n}</p>
          <button onClick={onClose} aria-label="ปิด" className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="mt-4 bg-[#2F2F45] rounded-3xl p-5 text-center">
          <p className="text-xs text-[#B9B9C6]">{ev?.title ?? "อีเวนต์"}</p>
          <p className="text-white text-lg font-semibold mt-0.5">{t.name}</p>
          {(t.studentId || t.faculty) && (
            <p className="text-xs text-[#B9B9C6] mt-0.5">
              {[t.studentId, t.faculty, t.major].filter(Boolean).join(" · ")}
            </p>
          )}
          <div className="bg-white rounded-2xl p-4 my-4 mx-auto w-fit">
            <QRCodeSVG value={t.code} size={180} level="M" />
          </div>
          <p className="text-white font-mono tracking-widest mb-2">#{t.code}</p>
          <StatusChip code={t.code} dark />
        </div>

        <p className="text-center text-xs text-gray-500 my-3">แสดง QR นี้ที่จุดเช็คอิน · ใช้ได้ 1 ครั้งต่อ 1 คน</p>

        {n > 1 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCur((c) => Math.max(0, c - 1))}
              disabled={cur === 0}
              aria-label="ใบก่อนหน้า"
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center disabled:opacity-30"
            >
              <i className="bi bi-chevron-left" />
            </button>
            <div className="flex gap-1.5">
              {order.tickets.map((x, i) => (
                <button
                  key={x.code}
                  onClick={() => setCur(i)}
                  aria-label={`ใบที่ ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${i === cur ? "w-6 bg-[#E07A68]" : "w-2 bg-gray-300"}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCur((c) => Math.min(n - 1, c + 1))}
              disabled={cur === n - 1}
              aria-label="ใบถัดไป"
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center disabled:opacity-30"
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderBlock({ order }: { order: Order }) {
  const [tab, setTab] = useState<"tickets" | "detail">("tickets");
  const [openAt, setOpenAt] = useState<number | null>(null);
  const ev = events.find((e) => e.id === order.eventId);
  const title = ev?.title ?? "อีเวนต์";
  const n = order.tickets.length;
  const unit = n ? Math.round(order.total / n) : 0;

  return (
    <section className="space-y-3">
      {/* สรุปคำสั่งซื้อ */}
      <div className="bg-white rounded-3xl border border-[#EEE6E6] p-4">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-gray-400">รหัสคำสั่งซื้อ {order.orderId}</p>
            <p className="font-bold text-[#2F2F45] mt-0.5">{title}</p>
          </div>
          <span className="h-fit shrink-0 bg-[#FBEAE5] text-[#B0503F] text-xs font-semibold px-2.5 py-1 rounded-full">
            {n} ใบ
          </span>
        </div>
        {ev && (
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p><i className="bi bi-calendar-event text-[#E07A68] me-2" />{ev.dateText}</p>
            <p><i className="bi bi-geo-alt-fill text-[#E07A68] me-2" />{ev.venue}</p>
          </div>
        )}
      </div>

      {/* แท็บ */}
      <div className="flex bg-[#F3E8DD] rounded-xl p-1">
        {([["tickets", "บัตรเข้างาน"], ["detail", "รายละเอียดการสั่งซื้อ"]] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex-1 py-2 rounded-lg text-sm transition ${
              tab === k ? "bg-white font-semibold text-[#2F2F45] shadow-sm" : "text-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "tickets" ? (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">
            <i className="bi bi-info-circle me-1" />บัตร 1 ใบ ใช้ได้ 1 คน · แตะที่บัตรเพื่อแสดง QR
          </p>
          {order.tickets.map((t, i) => (
            <TicketStub key={t.code} t={t} index={i} count={n} title={title} onOpen={() => setOpenAt(i)} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#EEE6E6] p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="font-semibold text-[#2F2F45]">ผู้เข้างาน</p>
            <span className="bg-[#E1F5EE] text-[#0F6E56] text-xs font-semibold px-2.5 py-1 rounded-full">ชำระแล้ว</span>
          </div>
          {order.tickets.map((t, i) => (
            <div key={t.code} className="flex items-center justify-between py-2.5 border-b border-[#F3EEE6] last:border-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-6 h-6 shrink-0 rounded-full bg-[#FBEAE5] text-[#B0503F] text-xs flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-[#2F2F45] truncate">{t.name}</p>
                  <p className="text-xs text-gray-400">#{t.code}{t.studentId ? ` · ${t.studentId}` : ""}</p>
                </div>
              </div>
              <span className="text-sm text-gray-600">฿{unit.toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t-2 border-dashed border-[#EEE6E6] mt-2 pt-3 flex items-center justify-between">
            <p className="font-semibold text-[#2F2F45]">ยอดรวม</p>
            <p className="text-lg font-bold text-[#E07A68]">฿{order.total.toLocaleString()}</p>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            สั่งซื้อเมื่อ {new Date(order.createdAt).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
      )}

      {openAt !== null && <QrSheet order={order} start={openAt} onClose={() => setOpenAt(null)} />}
    </section>
  );
}

export default function TicketPage() {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const orders = mounted ? getMyOrders() : [];

  return (
    <main className="min-h-screen bg-[#FDF5EC] pb-28">
      <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
        <h1 className="text-xl font-bold text-[#2F2F45]">บัตรของฉัน</h1>

        {!mounted ? null : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EEE6E6] py-12 text-center">
            <i className="bi bi-ticket-perforated text-4xl text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">ยังไม่มีบัตร</p>
            <Link
              href="/events"
              className="inline-block mt-4 bg-[#E07A68] text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
            >
              ไปเลือกซื้อบัตร
            </Link>
          </div>
        ) : (
          orders.map((o) => <OrderBlock key={o.orderId} order={o} />)
        )}
      </div>

      <UserBottomNav active="ticket" />
    </main>
  );
}
