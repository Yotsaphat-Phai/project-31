"use client";

// หน้าแรกของ User หลัง login: รายการอีเวนต์ทั้งหมด → กด "ดูรายละเอียด" ไปหน้า /event

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { getCurrentUser } from "../_lib/auth";
import { events, type EventItem } from "../_lib/mock";

const noopSubscribe = () => () => {};

// รูปปกอีเวนต์: ลูกโป่ง + บัตร + ป้ายชื่อรุ่น
function EventCover({ badge }: { badge: string }) {
  return (
    <div className="relative h-56 bg-gradient-to-br from-[#F6E6E1] to-[#F3E3D3] rounded-3xl overflow-hidden">
      <svg viewBox="0 0 560 230" className="absolute inset-0 w-full h-full" aria-hidden="true">
        {/* จุดตกแต่ง */}
        <circle cx="68" cy="50" r="5" fill="#E07A68" />
        <circle cx="338" cy="36" r="3.5" fill="#4E9C8F" />
        <circle cx="474" cy="42" r="4.5" fill="#4E9C8F" />
        <circle cx="525" cy="100" r="4" fill="#EBB654" />
        <circle cx="102" cy="200" r="4" fill="#A86BA6" />
        <circle cx="440" cy="216" r="3.5" fill="#E07A68" />
        {/* ลูกโป่งเขียว */}
        <ellipse cx="93" cy="98" rx="26" ry="34" fill="#4E9C8F" />
        <line x1="93" y1="132" x2="88" y2="170" stroke="#4E9C8F" strokeWidth="2" />
        {/* ลูกโป่งเหลือง */}
        <ellipse cx="466" cy="104" rx="26" ry="34" fill="#EBB654" />
        <line x1="466" y1="138" x2="471" y2="176" stroke="#EBB654" strokeWidth="2" />
        {/* บัตร */}
        <rect x="216" y="102" width="126" height="70" rx="9" fill="#2F2F45" />
        <circle cx="216" cy="137" r="6" fill="#F5E6DF" />
        <circle cx="342" cy="137" r="6" fill="#F5E6DF" />
        <rect x="230" y="121" width="68" height="6" rx="3" fill="#FFFFFF" />
        <rect x="230" y="141" width="44" height="5" rx="2.5" fill="#B9B9C6" />
        <rect x="311" y="117" width="23" height="38" rx="3" fill="#E07A68" />
      </svg>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[62%] text-center bg-[#47465A] text-white text-[15px] py-2.5 rounded-lg whitespace-nowrap">
        {badge}
      </div>
    </div>
  );
}

function EventCard({ ev }: { ev: EventItem }) {
  return (
    <div className="bg-white rounded-3xl border border-[#EEE6E6] overflow-hidden">
      <EventCover badge={ev.badge} />
      <div className="px-6 pt-5 pb-4">
        <h2 className="text-xl font-bold text-[#2F2F45]">{ev.title}</h2>
        <div className="mt-4 space-y-2 text-[15px] text-gray-600">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#FBEAE5] flex items-center justify-center">
              <span className="w-3 h-3 rounded-sm bg-[#E07A68]" />
            </span>
            {ev.dateText}
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#FBEAE5] flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E07A68]" />
            </span>
            {ev.venue}
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-gray-500 text-sm whitespace-nowrap">
            เริ่มต้น{" "}
            <span className="ml-2 text-xl font-bold text-[#2F2F45]">
              ฿{ev.price.toLocaleString()} / ใบ
            </span>
          </p>
          <Link
            href={`/event?id=${ev.id}`}
            className="bg-[#E07A68] text-white text-sm font-semibold px-4 py-2.5 rounded-full whitespace-nowrap active:scale-95 transition shadow-sm"
          >
            ซื้อบัตร ›
          </Link>
        </div>
      </div>
    </div>
  );
}

function UserBottomNav({ active }: { active: "home" | "ticket" | "token" | "profile" }) {
  const items = [
    { key: "home", href: "/events", label: "หน้าแรก", icon: "bi-house-door-fill", color: "#E07A68" },
    { key: "ticket", href: "/event/ticket", label: "บัตรของฉัน", icon: "bi-ticket-perforated-fill", color: "#EBB654" },
    { key: "token", href: "#", label: "TOKEN", icon: "", color: "#D9A53B" },
    { key: "profile", href: "#", label: "โปรไฟล์", icon: "bi-person-fill", color: "#A86BA6" },
  ] as const;
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-[#EEE6E6]">
      <div className="max-w-md mx-auto flex justify-around py-3">
        {items.map((it) => (
          <Link key={it.key} href={it.href} className="flex flex-col items-center gap-1 w-20">
            {it.icon ? (
              <i className={`bi ${it.icon} text-3xl`} style={{ color: it.color }} />
            ) : (
              // เหรียญ TOKEN (฿)
              <span className="w-9 h-9 rounded-full bg-[#EBB654] border-2 border-[#D9A53B] flex items-center justify-center text-[#9A6A1A] font-bold">
                ฿
              </span>
            )}
            <span
              className={`text-sm ${active === it.key ? "font-semibold" : "text-gray-500"}`}
              style={active === it.key ? { color: it.color } : undefined}
            >
              {it.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function EventsPage() {
  // อ่านชื่อจาก localStorage (ฝั่ง server ไม่มี localStorage → ได้ "" ไปก่อน)
  const name = useSyncExternalStore(
    noopSubscribe,
    () => getCurrentUser()?.name.split(" ")[0] ?? "",
    () => ""
  );

  return (
    <div className="min-h-screen bg-[#FDF5EC] pb-28">
      <div className="max-w-md mx-auto px-6 pt-10">
        {/* ทักทาย */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#F6E1DC] flex items-center justify-center overflow-hidden">
            <i className="bi bi-person-fill text-[#E07A68] text-6xl translate-y-2" />
          </div>
          <div>
            <p className="text-gray-500">Hello,</p>
            <p className="text-xl font-bold text-[#2F2F45]">คุณ{name || "ผู้ใช้"}</p>
          </div>
        </div>

        <h1 className="mt-6 text-4xl font-bold text-[#2F2F45]">Event</h1>

        <div className="mt-6 space-y-5">
          {events.map((ev) => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>
      </div>

      <UserBottomNav active="home" />
    </div>
  );
}
