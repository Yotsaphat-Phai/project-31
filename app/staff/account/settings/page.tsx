"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FS_KEY,
  loadStaffFontSize,
  saveStaffFontSize,
  type StaffFontSize,
} from "@/app/staff/_lib/fontSize";

export default function StaffAppSettingsPage() {
  const router = useRouter();
  const [size, setSize] = useState<StaffFontSize>("md");
  const [toast, setToast] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => setSize(loadStaffFontSize()), []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const choose = (s: StaffFontSize) => {
    setSize(s);
    saveStaffFontSize(s); // เซฟ + ใช้ผลทันทีทุกหน้า
    setToast("บันทึกขนาดตัวอักษรแล้ว");
  };

  const clearCache = async () => {
    if (!confirm("ล้างข้อมูลแคชในเครื่อง? (จะไม่ออกจากระบบ)")) return;
    setClearing(true);
    try {
      const keep = ["staff-auth-v1", FS_KEY];
      const keys = Object.keys(localStorage);
      for (const k of keys) {
        if (!keep.includes(k)) localStorage.removeItem(k);
      }
      if ("caches" in window) {
        const names = await caches.keys();
        await Promise.all(names.map((n) => caches.delete(n)));
      }
      setToast("ล้างแคชเรียบร้อย");
    } catch {
      setToast("ล้างแคชไม่สำเร็จ");
    } finally {
      setClearing(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col bg-[#fdf6ee]">
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-[#f3e3d3] bg-[#fdf6ee]/95 px-2 py-2.5 backdrop-blur">
        <button
          onClick={() => router.back()}
          aria-label="ย้อนกลับ"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f5ead9]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-[#1f2a2e] stroke-2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="flex-1 text-base font-semibold text-[#1f2a2e]">ตั้งค่าแอป</h1>
      </header>

      <section className="mx-4 mt-4">
        <p className="mb-1.5 ml-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          ขนาดตัวอักษร
        </p>
        <div className="overflow-hidden rounded-[22px] border border-[#f3e3d3] bg-white p-3">
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { k: "sm", label: "เล็ก", demo: "14px" },
                { k: "md", label: "ปกติ", demo: "16px" },
                { k: "lg", label: "ใหญ่", demo: "18px" },
              ] as { k: StaffFontSize; label: string; demo: string }[]
            ).map((opt) => {
              const active = size === opt.k;
              return (
                <button
                  key={opt.k}
                  onClick={() => choose(opt.k)}
                  className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 transition ${
                    active
                      ? "border-[#f0705a] bg-[#fff2ec]"
                      : "border-[#f3e3d3] bg-white hover:bg-[#fdf6ee]"
                  }`}
                >
                  <span
                    style={{ fontSize: opt.demo }}
                    className="font-semibold text-[#1f2a2e]"
                  >
                    Aa
                  </span>
                  <span
                    className={`text-[11px] ${
                      active ? "font-semibold text-[#c84a30]" : "text-neutral-500"
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 rounded-lg bg-[#faf1e4] px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#c48a2a]">
              ตัวอย่าง
            </p>
            <p className="mt-1 text-sm text-[#8a6a20]">
              สแกน QR ผู้เข้าร่วมเพื่อเติม TOKEN
            </p>
            <p className="mt-0.5 text-xs text-[#8a6a20]/80">
              การปรับจะมีผลทุกหน้าในแอปทันที
            </p>
          </div>
        </div>
      </section>

      <section className="mx-4 mt-5">
        <p className="mb-1.5 ml-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          ข้อมูลในเครื่อง
        </p>
        <div className="overflow-hidden rounded-[22px] border border-[#f3e3d3] bg-white">
          <button
            onClick={clearCache}
            disabled={clearing}
            className="flex w-full items-center gap-3 px-3.5 py-3 text-left disabled:opacity-60"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fbe3dc] text-[#d94e35]">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]">
                <path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2" strokeLinecap="round" />
                <path d="M7 7l1 12a2 2 0 002 2h4a2 2 0 002-2l1-12" />
              </svg>
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium text-[#1f2a2e]">
                {clearing ? "กำลังล้างข้อมูล…" : "ล้างข้อมูลแคช"}
              </span>
              <span className="block text-[11px] text-neutral-500">
                ลบข้อมูลชั่วคราวในเครื่อง (ยังคงล็อกอินอยู่)
              </span>
            </span>
          </button>
        </div>
        <p className="mt-2 ml-1 text-[10px] text-neutral-400">
          * จะไม่ลบ session การล็อกอินและขนาดตัวอักษร
        </p>
      </section>

      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#1f2a2e] px-4 py-2 text-xs font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </main>
  );
}