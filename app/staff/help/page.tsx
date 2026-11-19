"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavMain from "../_components/BottomNavMain";

type FAQ = { q: string; a: string };

const faqs: FAQ[] = [
  {
    q: "สแกน QR เช็คอินไม่ได้ ทำยังไง?",
    a: "ตรวจสอบว่าเปิดสิทธิ์กล้องให้เบราว์เซอร์แล้ว และเข้าใช้งานผ่าน https หรือ localhost เท่านั้น ถ้ายังไม่ได้ลองใช้ช่องค้นชื่อ/เลขตั๋วแทน",
  },
  {
    q: "เติม TOKEN แล้วยังไม่ขึ้นในบัญชีลูกค้า?",
    a: "ยอดที่เติมจะอยู่ในสถานะ 'รออนุมัติ' (pending) ก่อน แอดมินจะยืนยันเข้าระบบอีกครั้ง คุณสามารถดูรายการที่เติมไว้ได้ที่ 'ประวัติการเติม TOKEN'",
  },
  {
    q: "ลูกค้าไม่มี QR มาได้ไหม?",
    a: "ได้ ใช้หน้า 'ค้นชื่อ' กรอกชื่อหรือเลขตั๋ว แล้วกดเช็คอินได้เลย",
  },
  {
    q: "เผลอเช็คอินผิดคน ยกเลิกยังไง?",
    a: "ติดต่อแอดมินประจำงานเพื่อยกเลิก Staff ไม่สามารถยกเลิกการเช็คอินเองได้เพื่อป้องกันการใช้ตั๋วซ้ำ",
  },
  {
    q: "ออกจากระบบแล้วข้อมูลที่เติมหายไหม?",
    a: "ไม่หาย ข้อมูลทั้งหมดเก็บในระบบกลาง การล็อกเอาต์แค่ปิดสิทธิ์ของอุปกรณ์เครื่องนี้เท่านั้น",
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(0);
  const [toast, setToast] = useState<string | null>(null);

  function fireToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col bg-[#fdf6ee]">
      <header className="flex items-center gap-2 px-3 pt-4">
        <button
          onClick={() => router.back()}
          aria-label="ย้อนกลับ"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#1f2a2e] active:bg-black/5"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-[#1f2a2e]">ช่วยเหลือ</h1>
      </header>

      {/* Hero */}
      <section className="mx-4 mt-3 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#f0705a] to-[#e85a40] p-4 text-white shadow-[0_12px_28px_-18px_rgba(240,112,90,0.9)]">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/85">
          Staff Support
        </p>
        <h2 className="mt-0.5 text-xl font-bold">มีปัญหาระหว่างงาน?</h2>
        <p className="mt-1 text-[12px] text-white/90">
          ติดต่อทีมแอดมินได้ 24 ชั่วโมงระหว่างงาน หรือดูคำถามที่พบบ่อยด้านล่าง
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href="tel:021234567"
            className="flex items-center justify-center gap-2 rounded-xl bg-white/20 px-3 py-2.5 text-xs font-semibold text-white backdrop-blur"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
              <path d="M5 4h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z" />
            </svg>
            โทรแอดมิน
          </a>
          <a
            href="https://line.me"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-white/20 px-3 py-2.5 text-xs font-semibold text-white backdrop-blur"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
              <path d="M21 11.5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z" />
              <path d="M8 10v3M12 10v3M16 10v3" strokeLinecap="round" />
            </svg>
            แชท LINE
          </a>
        </div>
      </section>

      {/* Quick actions */}
      <div className="mx-4 mt-4">
        <p className="mb-1.5 ml-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          ทางลัด
        </p>
        <section className="overflow-hidden rounded-[22px] border border-[#f3e3d3] bg-white">
          <QuickRow
            label="รายงานปัญหาระบบ"
            hint="แจ้งบั๊ก/ข้อเสนอแนะ"
            onClick={() => fireToast("ส่งรายงานเรียบร้อยแล้ว")}
            icon={
              <>
                <path d="M4 20h16" strokeLinecap="round" />
                <path d="M9 4h6l1 4H8l1-4z" />
                <rect x="7" y="8" width="10" height="10" rx="2" />
              </>
            }
          />
          <QuickRow
            label="คู่มือการใช้งาน"
            hint="PDF อ่านออนไลน์"
            onClick={() =>
              typeof window !== "undefined" &&
              window.open("about:blank", "_blank", "noopener")
            }
            icon={
              <>
                <path d="M6 3h9l4 4v14H6z" />
                <path d="M14 3v4h4" />
                <path d="M9 13h6M9 17h4" strokeLinecap="round" />
              </>
            }
          />
          <QuickRow
            label="ส่งอีเมลหาทีมแอดมิน"
            hint="admin@test.com"
            onClick={() =>
              typeof window !== "undefined" &&
              window.location.assign("mailto:admin@test.com")
            }
            last
            icon={
              <>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M4 7l8 6 8-6" />
              </>
            }
          />
        </section>
      </div>

      {/* FAQ */}
      <div className="mx-4 mb-4 mt-4 flex-1">
        <p className="mb-1.5 ml-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          คำถามที่พบบ่อย
        </p>
        <section className="overflow-hidden rounded-[22px] border border-[#f3e3d3] bg-white">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={i < faqs.length - 1 ? "border-b border-[#f5ead9]" : ""}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fbeecf] text-[11px] font-bold text-[#c48a2a]">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium text-[#1f2a2e]">
                    {f.q}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 shrink-0 fill-none stroke-neutral-400 stroke-2 transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3 pl-[52px] text-[12px] leading-relaxed text-neutral-600">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>

      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed bottom-20 left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#1f2a2e] px-4 py-2 text-xs font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}

      <BottomNavMain active="account" />
    </main>
  );
}

function QuickRow({
  icon,
  label,
  hint,
  onClick,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
  last?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-3.5 py-3 text-left ${
        !last ? "border-b border-[#f5ead9]" : ""
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fbeecf] text-[#1f2a2e]">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]">
          {icon}
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#1f2a2e]">{label}</p>
        <p className="text-[11px] text-neutral-500">{hint}</p>
      </div>
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-neutral-400 stroke-2">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
