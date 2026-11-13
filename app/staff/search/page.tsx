"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StaffBadge } from "../_components/ui";
import BottomNav from "../_components/BottomNav";
import { useCustomers, type Customer } from "../_lib/mockUsers";

type Filter = "all" | "in" | "out";

const avatarColors = ["bg-[#f0705a]", "bg-[#2f8f7f]", "bg-[#e0a020]", "bg-[#5b8bd0]"];

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
    <li className="rounded-2xl border-2 border-[#f3e3d3] bg-white">
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-3 text-left">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white ${
            avatarColors[index % avatarColors.length]
          }`}
        >
          {c.name.charAt(0)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-[#1f2a2e]">{c.name}</span>
          <span className="block truncate text-xs text-neutral-500">
            รุ่น {c.batch} · {c.tickets} ใบ · {c.token.toLocaleString()} TOKEN
            {c.pending > 0 && ` (+${c.pending.toLocaleString()} รออนุมัติ)`}
          </span>
        </span>
        {c.checkedIn ? (
          <span className="shrink-0 rounded-full bg-[#2f8f7f]/15 px-4 py-1 text-xs font-medium text-[#2f8f7f]">
            เช็คอินแล้ว
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-amber-100 px-4 py-1 text-xs font-medium text-amber-700">
            ยังไม่มา
          </span>
        )}
      </button>

      {open && (
        <div className="grid grid-cols-2 gap-2 px-3 pb-3">
          <button
            onClick={() => router.push(`/staff/scan?id=${encodeURIComponent(c.id)}`)}
            className="rounded-xl border-2 border-[#2f8f7f] py-2 text-sm font-semibold text-[#2f8f7f]"
          >
            แสดงในหน้าสแกน
          </button>
          <button
            onClick={() => router.push(`/staff/topup?id=${encodeURIComponent(c.id)}`)}
            className="rounded-xl bg-[#2f8f7f] py-2 text-sm font-semibold text-white"
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

  const q = query.trim().toLowerCase();
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
      <header className="flex items-center justify-between px-5 pt-5">
        <button
          onClick={() => router.push("/staff/scan")}
          className="flex items-center gap-1 text-lg font-semibold text-[#1f2a2e]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          ค้นหารายชื่อ
        </button>
        <StaffBadge />
      </header>

      {/* Search + tabs */}
      <div className="flex flex-col gap-3 px-5 pt-5">
        <label className="flex items-center gap-2 rounded-2xl border-2 border-[#2f8f7f] bg-white px-4 py-3">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-neutral-400 stroke-2">
            <circle cx="11" cy="11" r="6" />
            <path d="M20 20l-4.5-4.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อ หรือรหัส"
            className="w-full bg-transparent text-[#1f2a2e] outline-none placeholder:text-neutral-400"
          />
        </label>

        <div className="grid grid-cols-3 gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`rounded-full border py-2 text-sm font-semibold ${
                filter === t.key
                  ? "border-[#2f8f7f] bg-[#2f8f7f] text-white"
                  : "border-neutral-300 bg-white text-[#1f2a2e]"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <ul className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
        {loaded && shown.length === 0 && (
          <li className="py-10 text-center text-sm text-neutral-500">ไม่พบรายชื่อ</li>
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

      <BottomNav active="search" />
    </main>
  );
}
