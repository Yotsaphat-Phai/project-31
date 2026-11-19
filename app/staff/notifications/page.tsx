"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavMain from "../_components/BottomNavMain";

type Notice = {
  id: string;
  kind: "info" | "success" | "warn";
  title: string;
  body: string;
  at: number;
  read: boolean;
};

const KEY = "staff-notifications-v1";

const seed: Notice[] = [
  {
    id: "n-003",
    kind: "success",
    title: "ระบบอัปเดต v1.0.1",
    body: "เพิ่มหน้าประวัติการเติม TOKEN และหน้าแจ้งเตือน",
    at: Date.now() - 5 * 60_000,
    read: false,
  },
  {
    id: "n-002",
    kind: "info",
    title: "เปลี่ยนกะเวลา 20:00",
    body: "ทีม Staff ชุดที่ 2 จะมารับช่วงเวลา 20:00 น.",
    at: Date.now() - 45 * 60_000,
    read: false,
  },
  {
    id: "n-001",
    kind: "warn",
    title: "QR ใกล้หมดอายุ",
    body: "ตั๋ว #00421 จะหมดอายุใน 30 นาที",
    at: Date.now() - 2 * 3600_000,
    read: true,
  },
];

function load(): Notice[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Notice[];
  } catch {}
  return seed;
}
function save(list: Notice[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

function relTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "เมื่อสักครู่";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} นาทีที่แล้ว`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} ชั่วโมงที่แล้ว`;
  return new Date(ts).toLocaleDateString("th-TH", { day: "2-digit", month: "short" });
}

const kindStyles: Record<Notice["kind"], { bg: string; fg: string; icon: React.ReactNode }> = {
  info: {
    bg: "bg-[#e3eef7]",
    fg: "text-[#2f6a8f]",
    icon: <path d="M12 8v5m0 3v.5M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />,
  },
  success: {
    bg: "bg-[#d7ecd9]",
    fg: "text-[#2f8f7f]",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  warn: {
    bg: "bg-[#fbeecf]",
    fg: "text-[#c48a2a]",
    icon: <path d="M12 3L2 20h20L12 3zm0 6v5m0 3v.5" />,
  },
};

export default function NotificationsPage() {
  const router = useRouter();
  const [list, setList] = useState<Notice[] | null>(null);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    setList(load());
    try {
      const prefs = localStorage.getItem("staff-notif-prefs-v1");
      if (prefs) {
        const p = JSON.parse(prefs);
        setPushEnabled(!!p.push);
        setSoundEnabled(!!p.sound);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "staff-notif-prefs-v1",
        JSON.stringify({ push: pushEnabled, sound: soundEnabled })
      );
    } catch {}
  }, [pushEnabled, soundEnabled]);

  const safe = list ?? [];
  const unread = safe.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setList((prev) => {
      const next = (prev ?? []).map((n) => ({ ...n, read: true }));
      save(next);
      return next;
    });
  }, []);

  const removeOne = useCallback((id: string) => {
    setList((prev) => {
      const next = (prev ?? []).filter((n) => n.id !== id);
      save(next);
      return next;
    });
  }, []);

  const toggleRead = useCallback((id: string) => {
    setList((prev) => {
      const next = (prev ?? []).map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      );
      save(next);
      return next;
    });
  }, []);

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
        <h1 className="text-lg font-semibold text-[#1f2a2e]">การแจ้งเตือน</h1>
        {unread > 0 && (
          <span className="ml-auto rounded-full bg-[#f0705a] px-2 py-0.5 text-[10px] font-bold text-white">
            {unread} ใหม่
          </span>
        )}
      </header>

      {/* Preferences */}
      <section className="mx-4 mt-3 overflow-hidden rounded-[22px] border border-[#f3e3d3] bg-white">
        <ToggleRow
          label="แจ้งเตือนแบบ Push"
          hint="รับการแจ้งเตือนทันทีจากระบบ"
          on={pushEnabled}
          onChange={setPushEnabled}
        />
        <div className="border-t border-[#f5ead9]" />
        <ToggleRow
          label="เสียงแจ้งเตือน"
          hint="เล่นเสียงเมื่อมีการแจ้งเตือนใหม่"
          on={soundEnabled}
          onChange={setSoundEnabled}
        />
      </section>

      {/* Actions */}
      <div className="mx-4 mt-4 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          รายการแจ้งเตือน
        </p>
        {safe.some((n) => !n.read) && (
          <button
            onClick={markAllRead}
            className="text-[11px] font-semibold text-[#f0705a]"
          >
            อ่านทั้งหมดแล้ว
          </button>
        )}
      </div>

      {/* List */}
      <section className="mx-4 mb-4 mt-2 flex-1 space-y-2">
        {list === null && <p className="py-10 text-center text-xs text-neutral-400">กำลังโหลด…</p>}
        {list !== null && safe.length === 0 && (
          <div className="rounded-[22px] border border-dashed border-[#f3e3d3] bg-white/60 py-12 text-center text-sm text-neutral-500">
            ไม่มีการแจ้งเตือน
          </div>
        )}
        {safe.map((n) => {
          const s = kindStyles[n.kind];
          return (
            <div
              key={n.id}
              className={`flex gap-3 rounded-[18px] border border-[#f3e3d3] bg-white p-3 ${
                n.read ? "opacity-70" : ""
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.fg}`}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
                  {s.icon}
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-[#1f2a2e]">
                    {n.title}
                  </p>
                  {!n.read && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f0705a]" />
                  )}
                </div>
                <p className="mt-0.5 text-[12px] leading-snug text-neutral-600">
                  {n.body}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-[11px] text-neutral-400">{relTime(n.at)}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleRead(n.id)}
                      className="text-[11px] font-semibold text-[#1f2a2e]"
                    >
                      {n.read ? "ทำเป็นยังไม่อ่าน" : "อ่านแล้ว"}
                    </button>
                    <button
                      onClick={() => removeOne(n.id)}
                      className="text-[11px] font-semibold text-[#d94e35]"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <BottomNavMain active="account" />
    </main>
  );
}

function ToggleRow({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#1f2a2e]">{label}</p>
        <p className="text-[11px] text-neutral-500">{hint}</p>
      </div>
      <span
        aria-pressed={on}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
          on ? "bg-[#f0705a]" : "bg-neutral-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
            on ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
