"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import UserBottomNav from "@/app/_components/UserBottomNav";

/* โครงหน้าย่อยของโปรไฟล์: หัวข้อ + ปุ่มย้อนกลับ + แถบเมนูล่าง */
export default function SubPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#FDF5EC] pb-28">
      <div className="max-w-md mx-auto px-5 pt-6 space-y-5">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            aria-label="ย้อนกลับ"
            className="w-9 h-9 rounded-full bg-white border border-[#EEE6E6] flex items-center justify-center"
          >
            <i className="bi bi-chevron-left text-[#2F2F45]" />
          </Link>
          <h1 className="text-xl font-bold text-[#2F2F45]">{title}</h1>
        </div>
        {children}
      </div>
      <UserBottomNav active="profile" />
    </main>
  );
}

export const inputCls =
  "w-full bg-white border border-[#EEE6E6] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#E07A68]";
export const primaryBtnCls =
  "w-full bg-[#E07A68] text-white font-semibold rounded-2xl py-3.5 disabled:opacity-60";

export function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EEE6E6] py-12 text-center text-gray-400">
      <i className={`bi ${icon} text-4xl`} />
      <p className="mt-2 text-sm">{text}</p>
    </div>
  );
}

/* true หลัง hydrate เสร็จ — ใช้รอก่อนอ่าน localStorage */
export function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}
const noop = () => () => {};
