"use client";

// หน้ารวม QR ของผู้เข้าร่วมทุกคน — เปิดจากอีกเครื่องแล้วให้สแตฟสแกน
// ติดตั้ง: npm i qrcode.react

import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { avatarPalette, useCustomers } from "../_lib/mockUsers";

export default function StaffQrDemoPage() {
  const router = useRouter();
  const { list, loaded } = useCustomers();

  if (!loaded) return null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col bg-[#fdf6ee] pb-5">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            aria-label="ย้อนกลับ"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-[#1f2a2e] stroke-2">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-[#1f2a2e]">QR สำหรับทดสอบ</h1>
        </div>
        <button
          onClick={() => router.push("/staff")}
          className="text-xs font-semibold text-[#f0705a]"
        >
          หน้าหลัก
        </button>
      </header>

      <p className="mx-4 mt-3 flex items-start gap-2 rounded-xl bg-[#fbe3dc] px-3 py-2.5 text-[11px] leading-relaxed text-[#1f2a2e]">
        <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 fill-none stroke-[#f0705a] stroke-2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16v.5" />
        </svg>
        <span>
          เปิดหน้านี้ในอีกเครื่อง แล้วใช้มือถือของสแตฟสแกน QR
          <br />
          ใบเดียวกันใช้ได้ทั้ง <b>เช็คอิน</b> และ <b>เติม TOKEN</b>
        </span>
      </p>

      {/* ปุ่มลัดเข้าหน้าสแกนทั้งสองโหมด */}
      <div className="mx-4 mt-2.5 grid grid-cols-2 gap-2">
        <button
          onClick={() => router.push("/staff/scan")}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1f2a2e] py-2 text-xs font-semibold text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
            <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />
          </svg>
          สแกนเช็คอิน
        </button>
        <button
          onClick={() => router.push("/staff/topup-scan")}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[#f0705a] py-2 text-xs font-semibold text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
            <ellipse cx="12" cy="7" rx="7" ry="3" />
            <path d="M5 7v10c0 1.7 3.1 3 7 3s7-1.3 7-3V7" />
          </svg>
          สแกน TOKEN
        </button>
      </div>

      {/* Grid ของ QR */}
      <section className="mx-4 mt-3 grid grid-cols-2 gap-2.5">
        {list.map((u, i) => (
          <article
            key={u.id}
            className="flex flex-col items-center gap-2 rounded-2xl border border-[#f3e3d3] bg-white p-2.5"
          >
            <div className="rounded-xl bg-white p-1.5 ring-1 ring-[#f3e3d3]">
              <QRCodeSVG value={u.id} size={110} level="M" />
            </div>
            <div className="flex w-full items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${
                  avatarPalette[i % avatarPalette.length]
                }`}
              >
                {u.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold text-[#1f2a2e]">
                  #{u.id}
                </p>
                <p className="truncate text-[10px] text-neutral-500">
                  {u.kind}
                  {u.table ? ` · โต๊ะ ${u.table}` : ""}
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-1">
              <button
                onClick={() => router.push(`/staff/scan?id=${encodeURIComponent(u.id)}`)}
                className="rounded-full border border-[#1f2a2e] py-0.5 text-[10px] font-semibold text-[#1f2a2e]"
              >
                เช็คอิน
              </button>
              <button
                onClick={() => router.push(`/staff/topup?id=${encodeURIComponent(u.id)}`)}
                className="rounded-full bg-[#f0705a] py-0.5 text-[10px] font-semibold text-white"
              >
                เติม
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
