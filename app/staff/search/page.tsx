"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavMain from "../_components/BottomNavMain";
import { avatarPalette, useCustomers, type Customer } from "../_lib/mockUsers";

type Filter = "all" | "in" | "out";

function CustomerCard({
  c,
  index,
  open,
  onToggle,
}: {
  c: Customer;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();

  return (
    <li
      className={`rounded-2xl border bg-white transition-shadow ${
        open ? "border-[#f0705a] shadow-md" : "border-[#f3e3d3]"
      }`}
    >
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-2.5 text-left">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
            avatarPalette[index % avatarPalette.length]
          }`}
        >
          {c.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#1f2a2e]">{c.name}</p>
          <p className="truncate text-[11px] text-neutral-500">
            {c.kind} · #{c.id} ·{" "}
            <span className="font-semibold text-[#f0705a]">
              {c.token.toLocaleString()} TOKEN
            </span>
            {c.pending > 0 && (
              <span className="text-[#c48a2a]"> (+{c.pending.toLocaleString()} รอ)</span>
            )}
          </p>
        </div>
        {c.checkedIn ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#d7ecd9] px-2 py-0.5 text-[11px] font-semibold text-[#2f8f7f]">
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current stroke-[2.5]">
              <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            เช็คอิน
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-[#fbeecf] px-2 py-0.5 text-[11px] font-semibold text-[#c48a2a]">
            ยังไม่มา
          </span>
        )}
      </button>

      {open && (
        <div className="grid grid-cols-2 gap-2 border-t border-[#f5ead9] p-2.5">
          <button
            onClick={() => router.push(`/staff/scan?id=${encodeURIComponent(c.id)}`)}
            className="rounded-xl border-2 border-[#f0705a] py-2 text-xs font-semibold text-[#f0705a]"
          >
            แสดงในหน้าสแกน
          </button>
          <button
            onClick={() => router.push(`/staff/topup?id=${encodeURIComponent(c.id)}`)}
            className="rounded-xl bg-[#f0705a] py-2 text-xs font-semibold text-white"
          >
            เติม TOKEN
          </button>
        </div>
      )}
    </li>
  );
}

export default function StaffSearchPage() {
  const router = useRouter();
  const { list, loaded } = useCustomers();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const q = query.trim().toLowerCase().replace(/^#/, "");
  const matched = list.filter(
    (c) => !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
  );
  const shown = matched.filter(
    (c) => filter === "all" || (filter === "in" ? c.checkedIn : !c.checkedIn)
  );

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "ทั้งหมด", count: matched.length },
    { key: "in", label: "เช็คอินแล้ว", count: matched.filter((c) => c.checkedIn).length },
    { key: "out", label: "ยังไม่มา", count: matched.filter((c) => !c.checkedIn).length },
  ];

  return (
    <main className="mx-auto flex h-dvh max-w-[390px] flex-col bg-[#fdf6ee]">
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
          <h1 className="text-lg font-semibold text-[#1f2a2e]">ค้นหารายชื่อ</h1>
        </div>
        <button
          onClick={() => router.push("/staff")}
          className="text-xs font-semibold text-[#f0705a]"
        >
          หน้าหลัก
        </button>
      </header>

      {/* Search + tabs */}
      <div className="flex flex-col gap-2.5 px-4 pt-3">
        <label className="flex items-center gap-2 rounded-2xl border border-[#f3e3d3] bg-white px-3.5 py-2.5 focus-within:border-[#f0705a]">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-neutral-400 stroke-2">
            <circle cx="11" cy="11" r="6" />
            <path d="M20 20l-4.5-4.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อ หรือเลขตั๋ว"
            className="w-full bg-transparent text-sm text-[#1f2a2e] outline-none placeholder:text-neutral-400"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="ล้างคำค้น"
              className="text-neutral-400"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </label>

        <div className="s-no-scrollbar flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                filter === t.key
                  ? "bg-[#f0705a] text-white"
                  : "border border-[#f3e3d3] bg-white text-[#1f2a2e]"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 text-[10px] ${
                  filter === t.key ? "bg-white/25" : "bg-[#fbe3dc] text-[#f0705a]"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <ul className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3">
        {loaded && shown.length === 0 && (
          <li className="rounded-2xl border border-dashed border-[#f3e3d3] py-10 text-center text-sm text-neutral-500">
            {q ? `ไม่พบ "${q}"` : "ไม่พบรายชื่อ"}
          </li>
        )}
        {shown.map((c) => (
          <CustomerCard
            key={c.id}
            c={c}
            index={list.indexOf(c)}
            open={openId === c.id}
            onToggle={() => setOpenId(openId === c.id ? null : c.id)}
          />
        ))}
      </ul>

      <BottomNavMain active="participants" />
    </main>
  );
}
