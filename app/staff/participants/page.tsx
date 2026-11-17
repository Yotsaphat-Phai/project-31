"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavMain from "../_components/BottomNavMain";
import { avatarPalette, useCustomers } from "../_lib/mockUsers";

type Filter = "all" | "pending" | "in";

export default function StaffParticipantsPage() {
  const router = useRouter();
  const { list } = useCustomers();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  // ไม่จำกัดจำนวน — ทั้งหมดคือผู้ลงทะเบียนจริงในระบบ
  const checkedInCount = list.filter((a) => a.checkedIn).length;
  const pendingCount = list.length - checkedInCount;
  const totalCount = list.length;

  const q = query.trim().toLowerCase().replace(/^#/, "");
  const shown = list
    .filter(
      (a) => !q || a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)
    )
    .filter((a) =>
      filter === "all" ? true : filter === "in" ? a.checkedIn : !a.checkedIn
    );

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "ทั้งหมด" },
    { key: "pending", label: "รอเข้า" },
    { key: "in", label: "เช็คอินแล้ว" },
  ];

  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col bg-[#fdf6ee]">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-lg font-semibold text-[#1f2a2e]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          ผู้เข้าร่วม
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-[#f0705a] stroke-2">
            <path d="M4 5h16l-6 8v5l-4 2v-7z" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      {/* Stat cards */}
      <section className="mx-5 mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border-2 border-[#f3e3d3] bg-white py-3 text-center">
          <p className="text-2xl font-bold text-[#2f8f7f]">{checkedInCount}</p>
          <p className="mt-0.5 text-xs text-neutral-500">เช็คอิน</p>
        </div>
        <div className="rounded-2xl border-2 border-[#f3e3d3] bg-white py-3 text-center">
          <p className="text-2xl font-bold text-[#c48a2a]">{pendingCount}</p>
          <p className="mt-0.5 text-xs text-neutral-500">รอเข้า</p>
        </div>
        <div className="rounded-2xl border-2 border-[#f3e3d3] bg-white py-3 text-center">
          <p className="text-2xl font-bold text-[#1f2a2e]">{totalCount}</p>
          <p className="mt-0.5 text-xs text-neutral-500">ทั้งหมด</p>
        </div>
      </section>

      {/* Search */}
      <div className="mx-5 mt-4">
        <label className="flex items-center gap-2 rounded-2xl border-2 border-[#f3e3d3] bg-white px-4 py-3">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-neutral-400 stroke-2">
            <circle cx="11" cy="11" r="6" />
            <path d="M20 20l-4.5-4.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อ / เลขตั๋ว"
            className="w-full bg-transparent text-sm text-[#1f2a2e] outline-none placeholder:text-neutral-400"
          />
        </label>
      </div>

      {/* Filter tabs */}
      <div className="mx-5 mt-4 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              filter === t.key
                ? "bg-[#f0705a] text-white"
                : "border-2 border-[#f3e3d3] bg-white text-[#1f2a2e]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <ul className="mx-5 mt-4 flex-1 space-y-3 overflow-y-auto pb-4">
        {shown.length === 0 && (
          <li className="py-10 text-center text-sm text-neutral-500">ไม่พบรายชื่อ</li>
        )}
        {shown.map((a, i) => (
          <li
            key={a.id}
            className="rounded-2xl border-2 border-[#f3e3d3] bg-white"
          >
            <button
              onClick={() => setOpenId(openId === a.id ? null : a.id)}
              className="flex w-full items-center gap-3 p-3 text-left"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white ${
                  avatarPalette[i % avatarPalette.length]
                }`}
              >
                {a.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#1f2a2e]">{a.name}</p>
                <p className="truncate text-xs text-neutral-500">
                  {a.kind} · #{a.id}
                  {a.extra ? ` · +${a.extra}` : ""}
                </p>
              </div>
              {a.checkedIn ? (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d7ecd9] text-[#2f8f7f]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2.5]">
                    <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-[#fbeecf] px-3 py-1 text-[11px] font-semibold text-[#c48a2a]">
                  รอ
                </span>
              )}
            </button>

            {openId === a.id && (
              <div className="grid grid-cols-2 gap-2 border-t border-[#f5ead9] p-3">
                <button
                  onClick={() => router.push(`/staff/scan?id=${encodeURIComponent(a.id)}`)}
                  className="rounded-xl border-2 border-[#f0705a] py-2 text-sm font-semibold text-[#f0705a]"
                >
                  แสดงในหน้าสแกน
                </button>
                <button
                  onClick={() => router.push(`/staff/topup?id=${encodeURIComponent(a.id)}`)}
                  className="rounded-xl bg-[#f0705a] py-2 text-sm font-semibold text-white"
                >
                  เติม TOKEN
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <BottomNavMain active="participants" />
    </main>
  );
}
