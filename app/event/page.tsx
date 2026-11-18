"use client";

// หน้ารายละเอียดงาน: รูปปก → ชื่องาน + ข้อมูล → เลือกจำนวนบัตร → แถบรวมราคา/ซื้อบัตรติดล่างจอ

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { events } from "../_lib/mock";
import { useTicketsLeft } from "../_lib/tickets";

function EventDetail() {
  const id = useSearchParams().get("id");
  const ev = events.find((e) => e.id === id) ?? events[0];
  const ticketsLeft = useTicketsLeft(ev.id);
  const soldOut = ticketsLeft === 0;
  const [quantity, setQuantity] = useState(1);
  const qty = Math.min(quantity, Math.max(1, ticketsLeft));
  const total = ev.price * qty;
  const maxQty = Math.max(1, Math.min(10, ticketsLeft));

  const info = [
    { icon: "bi-calendar-event", label: "วันและเวลา", value: ev.dateText, color: "#E07A68" },
    { icon: "bi-geo-alt-fill", label: "สถานที่", value: ev.venue, color: "#4E9C8F" },
    { icon: "bi-tag-fill", label: "ราคาต่อใบ", value: `฿${ev.price.toLocaleString()}`, color: "#D9A53B" },
    { icon: "bi-ticket-perforated-fill", label: "บัตรคงเหลือ", value: soldOut ? "บัตรหมดแล้ว" : `${ticketsLeft} ใบ`, color: "#A86BA6" },
  ];

  return (
    <main className="min-h-screen bg-[#FDF5EC] pb-32">
      <div className="max-w-md mx-auto px-5 pt-5 space-y-5">
        {/* หัวหน้า: ปุ่มย้อนกลับ + ชื่อหน้า (ชื่ออยู่กึ่งกลาง) */}
        <div className="relative flex items-center justify-center h-10">
          <Link
            href="/events"
            aria-label="ย้อนกลับ"
            className="absolute left-0 w-10 h-10 rounded-full bg-white border border-[#EEE6E6] flex items-center justify-center"
          >
            <i className="bi bi-chevron-left text-lg text-[#2F2F45]" />
          </Link>
          <h2 className="text-lg font-bold text-[#2F2F45]">รายละเอียดงาน</h2>
        </div>

        {/* รูปปกในกรอบ */}
        <div className="bg-white rounded-3xl border border-[#EEE6E6] p-2 shadow-sm">
          <div className="relative aspect-[3/2] rounded-2xl overflow-hidden bg-[#F3E3D3]">
            <Image src={ev.image} alt={ev.title} fill sizes="(max-width: 448px) 100vw, 448px" className="object-cover" priority />
          </div>
        </div>

        <div className="space-y-5">
          {/* ชื่องาน */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#2F2F45]">{ev.title}</h1>
            <span className="inline-block mt-2 bg-[#FBEAE5] text-[#E07A68] text-xs font-semibold px-3 py-1 rounded-full">
              บัตรประเภทเดียว ราคาเดียว
            </span>
          </div>

          {/* ข้อมูลงาน */}
          <div className="bg-white rounded-2xl border border-[#EEE6E6] divide-y divide-[#F3ECEC]">
            {info.map((it) => (
              <div key={it.label} className="flex items-center gap-3 px-4 py-3">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${it.color}22` }}
                >
                  <i className={`bi ${it.icon} text-lg`} style={{ color: it.color }} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">{it.label}</p>
                  <p className="text-[15px] font-semibold text-[#2F2F45] break-words">{it.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* จำนวนบัตร */}
          <div className="bg-white rounded-2xl border border-[#EEE6E6] px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-[15px] font-semibold text-[#2F2F45]">จำนวนบัตร</p>
              <p className="text-xs text-gray-400">สูงสุด {maxQty} ใบต่อครั้ง</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={qty <= 1 || soldOut}
                aria-label="ลดจำนวน"
                className="w-9 h-9 rounded-full bg-[#FBEAE5] text-[#E07A68] flex items-center justify-center disabled:opacity-40"
              >
                <i className="bi bi-dash-lg" />
              </button>
              <span className="w-6 text-center text-lg font-bold text-[#2F2F45]">{qty}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={qty >= maxQty || soldOut}
                aria-label="เพิ่มจำนวน"
                className="w-9 h-9 rounded-full bg-[#E07A68] text-white flex items-center justify-center disabled:opacity-40"
              >
                <i className="bi bi-plus-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* แถบรวมราคา + ซื้อบัตร */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[#EEE6E6]">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500">ราคารวม ({qty} ใบ)</p>
            <p className="text-2xl font-bold text-[#2F2F45]">฿{total.toLocaleString()}</p>
          </div>
          <Link
            href={soldOut ? "#" : `/event/participants?id=${ev.id}&qty=${qty}&total=${total}`}
            aria-disabled={soldOut}
            className={`text-white font-semibold px-7 py-3.5 rounded-2xl flex items-center gap-2 ${soldOut ? "bg-gray-300 pointer-events-none" : "bg-[#E07A68] active:scale-95"}`}
          >
            {soldOut ? "บัตรหมด" : <>ซื้อบัตร <i className="bi bi-arrow-right" /></>}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function EventPage() {
  return (
    <Suspense>
      <EventDetail />
    </Suspense>
  );
}
