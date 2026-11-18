"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavMain from "../_components/BottomNavMain";
import { avatarPalette, useCustomers } from "../_lib/mockUsers";

type Filter = "all" | "pending" | "in";
type SortKey = "ticket" | "name" | "token";

export default function StaffParticipantsPage() {
  const router = useRouter();
  const { list } = useCustomers();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("ticket");
  const [sortOpen, setSortOpen] = useState(false);

  const checkedInCount = list.filter((a) => a.checkedIn).length;
  const pendingCount = list.length - checkedInCount;
  const totalCount = list.length;

  const q = query.trim().toLowerCase().replace(/^#/, "");
  const shown = useMemo(() => {
    const filtered = list
      .filter(
        (a) => !q || a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)
      )
      .filter((a) =>
        filter === "all" ? true : filter === "in" ? a.checkedIn : !a.checkedIn
      );
    const sorted = [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "th");
      if (sort === "token") return b.token - a.token;
      return a.id.localeCompare(b.id);
    });
    return sorted;
  }, [list, q, filter, sort]);

  const sortLabel: Record<SortKey, string> = {
    ticket: "เลขตั๋ว",
    name: "ชื่อ ก-ฮ",
    token: "TOKEN มาก→น้อย",
  };

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "ทั้งหมด", count: list.length },
    { key: "pending", label: "รอเข้า", count: pendingCount },
    { key: "in", label: "เช็คอินแล้ว", count: checkedInCount },
  ];

  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col bg-[#fdf6ee]">
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
          <h1 className="text-lg font-semibold text-[#1f2a2e]">ผู้เข้าร่วม</h1>
        </div>
        <div className="relative">
          <button
            onClick={() => setSortOpen((v) => !v)}
            aria-label="จัดเรียง"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-[#f0705a] stroke-2">
              <path d="M4 5h16l-6 8v5l-4 2v-7z" strokeLinejoin="round" />
            </svg>
          </button>
          {sortOpen && (
            <>
              <button
                aria-label="ปิด"
                onClick={() => setSortOpen(false)}
                className="fixed inset-0 z-10 cursor-default bg-transparent"
              />
              <ul className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-xl border border-[#f3e3d3] bg-white py-1 shadow-lg">
                {(Object.keys(sortLabel) as SortKey[]).map((k) => (
                  <li key={k}>
                    <button
                      onClick={() => {
                        setSort(k);
                        setSortOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
                        sort === k ? "font-semibold text-[#f0705a]" : "text-[#1f2a2e]"
                      }`}
                    >
                      {sortLabel[k]}
                      {sort === k && (
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2.5]">
                          <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </header>

      {/* Stat cards */}
      <section className="mx-4 mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-[#f3e3d3] bg-white py-2.5 text-center">
          <p className="text-xl font-bold text-[#2f8f7f]">{checkedInCount}</p>
          <p className="mt-0.5 text-[11px] text-neutral-500">เช็คอิน</p>
        </div>
        <div className="rounded-2xl border border-[#f3e3d3] bg-white py-2.5 text-center">
          <p className="text-xl font-bold text-[#c48a2a]">{pendingCount}</p>
          <p className="mt-0.5 text-[11px] text-neutral-500">รอเข้า</p>
        </div>
        <div className="rounded-2xl border border-[#f3e3d3] bg-white py-2.5 text-center">
          <p className="text-xl font-bold text-[#1f2a2e]">{totalCount}</p>
          <p className="mt-0.5 text-[11px] text-neutral-500">ทั้งหมด</p>
        </div>
      </section>

      {/* Search */}
      <div className="mx-4 mt-3">
        <label className="flex items-center gap-2 rounded-2xl border border-[#f3e3d3] bg-white px-3.5 py-2.5">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-neutral-400 stroke-2">
            <circle cx="11" cy="11" r="6" />
            <path d="M20 20l-4.5-4.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อ / เลขตั๋ว"
            className="w-full bg-transparent text-sm text-[#1f2a2e] outline-none placeholder:text-neutral-400"
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
      </div>

      {/* Filter tabs */}
      <div className="s-no-scrollbar mx-4 mt-2.5 flex gap-2 overflow-x-auto">
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

      {/* List */}
      <ul className="mx-4 mt-3 flex-1 space-y-2 overflow-y-auto pb-3">
        {shown.length === 0 && (
          <li className="rounded-2xl border border-dashed border-[#f3e3d3] py-10 text-center text-sm text-neutral-500">
            ไม่พบรายชื่อ
          </li>
        )}
        {shown.map((a) => {
          const i = list.findIndex((x) => x.id === a.id);
          const open = openId === a.id;
          return (
            <li
              key={a.id}
              className={`rounded-2xl border bg-white transition-shadow ${
                open ? "border-[#f0705a] shadow-md" : "border-[#f3e3d3]"
              }`}
            >
              <button
                onClick={() => setOpenId(open ? null : a.id)}
                className="flex w-full items-center gap-3 p-2.5 text-left"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
                    avatarPalette[(i >= 0 ? i : 0) % avatarPalette.length]
                  }`}
                >
                  {a.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#1f2a2e]">
                    {a.name}
                  </p>
                  <p className="truncate text-[11px] text-neutral-500">
                    {a.kind === "VIP" ? (
                      <span className="mr-1 inline-flex items-center rounded bg-[#fbeecf] px-1 text-[10px] font-bold text-[#c48a2a]">
                        VIP
                      </span>
                    ) : null}
                    #{a.id}
                    {a.table ? ` · โต๊ะ ${a.table}` : ""}
                    {a.extra ? ` · +${a.extra}` : ""}
                  </p>
                </div>
                {a.checkedIn ? (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d7ecd9] text-[#2f8f7f]">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2.5]">
                      <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-[#fbeecf] px-2.5 py-0.5 text-[11px] font-semibold text-[#c48a2a]">
                    รอ
                  </span>
                )}
              </button>

              {open && (
                <div className="grid grid-cols-2 gap-2 border-t border-[#f5ead9] p-2.5">
                  <button
                    onClick={() => router.push(`/staff/scan?id=${encodeURIComponent(a.id)}`)}
                    className="rounded-xl border-2 border-[#f0705a] py-2 text-xs font-semibold text-[#f0705a]"
                  >
                    แสดงในหน้าสแกน
                  </button>
                  <button
                    onClick={() => router.push(`/staff/topup?id=${encodeURIComponent(a.id)}`)}
                    className="rounded-xl bg-[#f0705a] py-2 text-xs font-semibold text-white"
                  >
                    เติม TOKEN
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <BottomNavMain active="participants" />
    </main>
  );
}
