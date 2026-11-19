"use client";

import { useRouter } from "next/navigation";

// แก้ข้อมูลแอดมินที่นี่จุดเดียว
const ADMIN = {
  name: "ADMIN",
  phone: "02-123-4567",
  email: "admin@test.com",
  lineId: "@admin888",
  hours: "จันทร์–ศุกร์ 08:30–23:30",
};

export default function StaffHelpPage() {
  const router = useRouter();

  const callAdmin = () =>
    window.location.assign(`tel:${ADMIN.phone.replace(/[^\d+]/g, "")}`);
  const mailAdmin = () => window.location.assign(`mailto:${ADMIN.email}`);
  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`คัดลอก${label}แล้ว`);
    } catch {
      alert("คัดลอกไม่สำเร็จ");
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
        <h1 className="flex-1 text-base font-semibold text-[#1f2a2e]">ช่วยเหลือ</h1>
      </header>

      <section className="mx-4 mt-4 rounded-[22px] border border-[#f3e3d3] bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fbeecf] text-[#c48a2a]">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.8]">
              <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2h-7l-5 4v-4H6a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#1f2a2e]">{ADMIN.name}</p>
            <p className="text-[11px] text-neutral-500">เวลาทำการ {ADMIN.hours}</p>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-[#faf1e4] px-3 py-2 text-[12px] leading-relaxed text-[#8a6a20]">
          พบปัญหาการใช้งานแอป หรือคำขอเติม TOKEN ไม่ผ่าน — กรุณาติดต่อแอดมินตามช่องทางด้านล่าง
        </p>
      </section>

      <section className="mx-4 mt-4 overflow-hidden rounded-[22px] border border-[#f3e3d3] bg-white">
        <ContactRow
          onClick={callAdmin}
          onLongPress={() => copy(ADMIN.phone, "เบอร์โทร")}
          icon={
            <path d="M5 4h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z" />
          }
          label="โทรหาแอดมิน"
          value={ADMIN.phone}
        />
        <ContactRow
          onClick={mailAdmin}
          onLongPress={() => copy(ADMIN.email, "อีเมล")}
          icon={
            <>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M4 7l8 6 8-6" />
            </>
          }
          label="ส่งอีเมล"
          value={ADMIN.email}
        />
        <ContactRow
          onClick={() => copy(ADMIN.lineId, "LINE ID")}
          icon={
            <>
              <circle cx="12" cy="12" r="9" />
              <path d="M8 11h2v3M14 11v3M12 11v3" strokeLinecap="round" />
            </>
          }
          label="LINE ID"
          value={ADMIN.lineId}
          last
        />
      </section>

      <p className="mx-4 mt-3 text-center text-[10px] text-neutral-400">
        แตะเพื่อติดต่อ · กดค้างเพื่อคัดลอก
      </p>
    </main>
  );
}

function ContactRow({
  icon,
  label,
  value,
  onClick,
  onLongPress,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick?: () => void;
  onLongPress?: () => void;
  last?: boolean;
}) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const start = () => {
    if (!onLongPress) return;
    timer = setTimeout(() => {
      onLongPress();
      timer = null;
    }, 500);
  };
  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return (
    <button
      onClick={onClick}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      className={`flex w-full items-center gap-3 px-3.5 py-3 text-left ${
        !last ? "border-b border-[#f5ead9]" : ""
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fbeecf] text-[#1f2a2e]">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]">
          {icon}
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-[#1f2a2e]">{label}</span>
        <span className="block truncate text-[11px] text-neutral-500">{value}</span>
      </span>
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-neutral-400 stroke-2">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}