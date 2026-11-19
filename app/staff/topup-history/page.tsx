"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavMain from "../_components/BottomNavMain";
import { avatarPalette } from "../_lib/mockUsers";
import { useTopupHistory, type TopupRecord } from "../_lib/topupHistory";

type Filter = "all" | "today" | "7d";

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString("th-TH", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function sameDay(a: number, b: number) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function groupByDay(list: TopupRecord[]) {
  const groups = new Map<string, { label: string; items: TopupRecord[] }>();
  for (const r of list) {
    const d = new Date(r.at);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const label = d.toLocaleDateString("th-TH", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
    if (!groups.has(key)) groups.set(key, { label, items: [] });
    groups.get(key)!.items.push(r);
  }
  return [...groups.values()];
}

export default function TopupHistoryPage() {
  const router = useRouter();
  const { list, loaded, clear } = useTopupHistory();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const now = Date.now();
    if (filter === "today") return list.filter((r) => sameDay(r.at, now));
    if (filter === "7d") return list.filter((r) => now - r.at <= 7 * 86400_000);
    return list;
  }, [list, filter]);

  const totalAmount = filtered.reduce((s, r) => s + r.amount, 0);
  const groups = groupByDay(filtered);

  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col bg-[#fdf6ee]">
      {/* Header */}
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
        <h1 className="text-lg font-semibold text-[#1f2a2e]">ประวัติการเติม TOKEN</h1>
      </header>

      {/* Summary card */}
      <section className="mx-4 mt-3 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#f0705a] to-[#e85a40] p-4 text-white shadow-[0_12px_28px_-18px_rgba(240,112,90,0.9)]">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/85">
          รวม TOKEN ที่เติม
        </p>
        <p className="mt-1 text-3xl font-bold leading-tight">
          {totalAmount.toLocaleString()}{" "}
          <span className="text-sm font-medium text-white/85">
            · {filtered.length} รายการ
          </span>
        </p>
      </section>

      {/* Filter chips */}
      <div className="mx-4 mt-3 flex gap-2">
        {([
          ["all", "ทั้งหมด"],
          ["today", "วันนี้"],
          ["7d", "7 วัน"],
        ] as [Filter, string][]).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === k
                ? "bg-[#1f2a2e] text-white"
                : "bg-white text-[#1f2a2e] border border-[#f3e3d3]"
            }`}
          >
            {label}
          </button>
        ))}
        {list.length > 0 && (
          <button
            onClick={() => {
              if (confirm("ล้างประวัติทั้งหมด?")) clear();
            }}
            className="ml-auto rounded-full border border-[#f3c6bd] px-3 py-1.5 text-xs font-semibold text-[#d94e35]"
          >
            ล้าง
          </button>
        )}
      </div>

      {/* List */}
      <section className="mx-4 mb-4 mt-3 flex-1 space-y-4">
        {!loaded && <p className="py-10 text-center text-xs text-neutral-400">กำลังโหลด…</p>}
        {loaded && filtered.length === 0 && <EmptyState />}
        {groups.map((g) => (
          <div key={g.label}>
            <p className="mb-1.5 ml-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              {g.label}
            </p>
            <ul className="overflow-hidden rounded-[22px] border border-[#f3e3d3] bg-white">
              {g.items.map((r, i) => {
                const paletteIdx =
                  (r.customerId.charCodeAt(r.customerId.length - 1) || 0) % avatarPalette.length;
                return (
                  <li
                    key={r.id}
                    className={`flex items-center gap-3 px-3 py-2.5 ${
                      i < g.items.length - 1 ? "border-b border-[#f5ead9]" : ""
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarPalette[paletteIdx]}`}
                    >
                      {r.customerInitials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#1f2a2e]">
                        {r.customerName}
                      </p>
                      <p className="truncate text-[11px] text-neutral-500">
                        #{r.customerId} · ตั๋ว{r.customerKind} · {formatDate(r.at)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#fbeecf] px-2.5 py-1 text-xs font-bold text-[#c48a2a]">
                      +{r.amount.toLocaleString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>

      <BottomNavMain active="topup" />
    </main>
  );
}

function EmptyState() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-3 rounded-[22px] border border-dashed border-[#f3e3d3] bg-white/60 px-4 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fbeecf]">
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-[#c48a2a] stroke-[1.8]">
          <ellipse cx="12" cy="6" rx="7" ry="2.5" />
          <path d="M5 6v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
          <path d="M5 12v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
        </svg>
      </div>
      <p className="text-sm font-medium text-[#1f2a2e]">ยังไม่มีประวัติการเติม TOKEN</p>
      <p className="-mt-2 text-xs text-neutral-500">
        รายการเติมจะมาเก็บที่นี่หลังทำรายการสำเร็จ
      </p>
      <button
        onClick={() => router.push("/staff/topup-scan")}
        className="mt-1 rounded-full bg-[#f0705a] px-5 py-2.5 text-xs font-semibold text-white"
      >
        เริ่มเติม TOKEN
      </button>
    </div>
  );
}
