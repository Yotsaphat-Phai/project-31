"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type TopupStatus = "approved" | "pending" | "rejected";
type TopupItem = {
  id: string;
  participant: string;    // ชื่อผู้เข้าร่วม
  participantId: string;  // รหัสผู้เข้าร่วม
  amount: number;         // จำนวน TOKEN
  createdAt: number;      // เวลาที่ staff ส่งคำขอ
  decidedAt?: number;     // เวลาที่แอดมินตัดสิน
  status: TopupStatus;
  note?: string;
  read?: boolean;
};

const LS_KEY = "staff-notif-topup-v1";

// ข้อมูลตัวอย่าง — ใช้ครั้งแรกถ้ายังไม่มีใน localStorage
const seed: TopupItem[] = [
  {
    id: "tx-20261119-003",
    participant: "ณัฐวุฒิ ศรีวงศ์",
    participantId: "P-00831",
    amount: 50,
    createdAt: Date.now() - 1000 * 60 * 32,
    decidedAt: Date.now() - 1000 * 60 * 18,
    status: "approved",
    read: false,
  },
  {
    id: "tx-20261119-002",
    participant: "ศศิกานต์ ใจดี",
    participantId: "P-00722",
    amount: 20,
    createdAt: Date.now() - 1000 * 60 * 90,
    decidedAt: Date.now() - 1000 * 60 * 70,
    status: "approved",
    read: false,
  },
  {
    id: "tx-20261119-001",
    participant: "ธนกร พงษ์ทอง",
    participantId: "P-00614",
    amount: 100,
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    decidedAt: Date.now() - 1000 * 60 * 60 * 4,
    status: "rejected",
    note: "ยอดเกินสิทธิ์วันนี้",
    read: true,
  },
  {
    id: "tx-20261118-004",
    participant: "ปิยะดา สายทอง",
    participantId: "P-00589",
    amount: 30,
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    status: "pending",
    read: true,
  },
];

function loadList(): TopupItem[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as TopupItem[];
  } catch {}
  localStorage.setItem(LS_KEY, JSON.stringify(seed));
  return seed;
}

function saveList(list: TopupItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {}
}

function timeAgo(ts: number) {
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "เมื่อสักครู่";
  if (m < 60) return `${m} นาทีที่แล้ว`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ชั่วโมงที่แล้ว`;
  const d = Math.floor(h / 24);
  return `${d} วันที่แล้ว`;
}

export default function StaffNotificationsPage() {
  const router = useRouter();
  const [list, setList] = useState<TopupItem[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => setList(loadList()), []);

  const filtered = useMemo(
    () => (filter === "unread" ? list.filter((x) => !x.read) : list),
    [list, filter]
  );
  const unreadCount = useMemo(() => list.filter((x) => !x.read).length, [list]);

  const markAllRead = () => {
    const next = list.map((x) => ({ ...x, read: true }));
    setList(next);
    saveList(next);
  };

  const markOneRead = (id: string) => {
    const next = list.map((x) => (x.id === id ? { ...x, read: true } : x));
    setList(next);
    saveList(next);
  };

  const clearAll = () => {
    if (!confirm("ลบการแจ้งเตือนทั้งหมด?")) return;
    setList([]);
    saveList([]);
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
        <h1 className="flex-1 text-base font-semibold text-[#1f2a2e]">การแจ้งเตือน</h1>
        {list.length > 0 && (
          <button
            onClick={markAllRead}
            className="rounded-full px-3 py-1 text-xs font-medium text-[#c84a30] hover:bg-[#fbe3dc]"
          >
            อ่านทั้งหมด
          </button>
        )}
      </header>

      <div className="flex items-center gap-2 px-4 pt-3">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            filter === "all"
              ? "bg-[#1f2a2e] text-white"
              : "border border-[#f3e3d3] bg-white text-[#1f2a2e]"
          }`}
        >
          ทั้งหมด ({list.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            filter === "unread"
              ? "bg-[#1f2a2e] text-white"
              : "border border-[#f3e3d3] bg-white text-[#1f2a2e]"
          }`}
        >
          ยังไม่อ่าน ({unreadCount})
        </button>
      </div>

      <section className="flex-1 space-y-2 px-4 pb-6 pt-3">
        {filtered.length === 0 ? (
          <div className="mt-20 flex flex-col items-center gap-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fbeecf]">
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-[#c48a2a] stroke-[1.8]">
                <path d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15z" strokeLinejoin="round" />
                <path d="M10 19a2 2 0 004 0" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[#1f2a2e]">ยังไม่มีการแจ้งเตือน</p>
            <p className="text-xs text-neutral-500">
              เมื่อแอดมินอนุมัติคำขอเติม TOKEN จะแสดงรายการที่นี่
            </p>
          </div>
        ) : (
          filtered.map((n) => <NotificationCard key={n.id} item={n} onRead={markOneRead} />)
        )}

        {list.length > 0 && (
          <button
            onClick={clearAll}
            className="mt-4 w-full rounded-full border border-[#f3e3d3] bg-white py-2 text-xs font-medium text-[#8a8580]"
          >
            ล้างการแจ้งเตือนทั้งหมด
          </button>
        )}
      </section>
    </main>
  );
}

function NotificationCard({
  item,
  onRead,
}: {
  item: TopupItem;
  onRead: (id: string) => void;
}) {
  const palette =
    item.status === "approved"
      ? { bg: "bg-[#d7ecd9]", ink: "text-[#2f8f7f]", label: "อนุมัติแล้ว" }
      : item.status === "rejected"
      ? { bg: "bg-[#fbe3dc]", ink: "text-[#d94e35]", label: "ไม่อนุมัติ" }
      : { bg: "bg-[#fbeecf]", ink: "text-[#c48a2a]", label: "รอตรวจสอบ" };

  const ts = item.decidedAt ?? item.createdAt;

  return (
    <article
      onClick={() => !item.read && onRead(item.id)}
      className={`relative overflow-hidden rounded-[18px] border bg-white p-3.5 transition ${
        item.read ? "border-[#f3e3d3]" : "border-[#f0705a]/40 bg-[#fff8f4]"
      }`}
    >
      {!item.read && (
        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#f0705a]" />
      )}
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${palette.bg} ${palette.ink}`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
            {item.status === "approved" ? (
              <path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
            ) : item.status === "rejected" ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#1f2a2e]">
            {item.status === "approved"
              ? "แอดมินอนุมัติการเติม TOKEN"
              : item.status === "rejected"
              ? "คำขอเติม TOKEN ไม่ถูกอนุมัติ"
              : "ส่งคำขอเติม TOKEN แล้ว รอตรวจสอบ"}
          </p>
          <p className="mt-0.5 text-xs text-neutral-600">
            <span className="font-medium text-[#1f2a2e]">{item.participant}</span>{" "}
            <span className="text-neutral-400">· {item.participantId}</span>
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${palette.bg} ${palette.ink}`}
            >
              {palette.label}
            </span>
            <span className="rounded-full bg-[#fbeecf] px-2 py-0.5 text-[10px] font-semibold text-[#c48a2a]">
              +{item.amount} TOKEN
            </span>
            <span className="ml-auto text-[10px] text-neutral-400">{timeAgo(ts)}</span>
          </div>
          {item.note && (
            <p className="mt-2 rounded-lg bg-[#faf1e4] px-2.5 py-1.5 text-[11px] text-[#8a6a20]">
              หมายเหตุจากแอดมิน: {item.note}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}