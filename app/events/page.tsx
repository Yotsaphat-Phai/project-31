"use client";

// หน้าแรกของ User หลัง login: รายการอีเวนต์ทั้งหมด → กด "ดูรายละเอียด" ไปหน้า /event

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import UserBottomNav from "@/app/_components/UserBottomNav";
import { getCurrentUser } from "../_lib/auth";
import { events, type EventItem } from "../_lib/mock";

const noopSubscribe = () => () => {};

// รูปปกอีเวนต์
function EventCover({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-56 bg-[#F3E3D3]">
      <Image src={src} alt={alt} fill sizes="(max-width: 448px) 100vw, 448px" className="object-cover" priority />
    </div>
  );
}

function EventCard({ ev }: { ev: EventItem }) {
  return (
    <div className="bg-white rounded-3xl border border-[#EEE6E6] overflow-hidden">
      <EventCover src={ev.image} alt={ev.title} />
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