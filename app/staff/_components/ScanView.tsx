"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QrScanner from "./QrScanner";
import BottomNavMain from "./BottomNavMain";
import { avatarPalette, useCustomers } from "../_lib/mockUsers";

export type ScanMode = "checkin" | "topup";

const corner = "absolute h-8 w-8 border-[#f0705a]";

export default function ScanView({ mode }: { mode: ScanMode }) {
  const isCheckin = mode === "checkin";
  const scanPath = isCheckin ? "/staff/scan" : "/staff/topup-scan";
  const router = useRouter();
  const params = useSearchParams();
  const { list, loaded, find, checkIn } = useCustomers();

  const [userId, setUserId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [notFound, setNotFound] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const lastNotFound = useRef<string | null>(null);
  const ignoreCode = useRef<string | null>(null);
  const ignoreSeenAt = useRef(0);

  const user = userId ? find(userId) : null;
  const userIndex = user ? list.findIndex((c) => c.id === user.id) : -1;

  useEffect(() => {
    setUserId(null);
    setLocked(false);
    setNotFound(null);
    lastNotFound.current = null;
    ignoreCode.current = null;
  }, []);

  // รองรับการส่ง ?id= มาจากหน้ารายชื่อ/QR demo
  const fromSearchId = params.get("id");
  useEffect(() => {
    if (loaded && fromSearchId && find(fromSearchId)) {
      const found = find(fromSearchId)!;
      if (isCheckin) checkIn(found.id);
      setUserId(found.id);
      setLocked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, fromSearchId]);

  function handleScan(text: string) {
    if (!loaded || locked) return;
    const code = text.trim();
    if (code.toUpperCase() === ignoreCode.current) {
      ignoreSeenAt.current = Date.now();
      return;
    }
    const found = find(code);
    if (found) {
      if (isCheckin) checkIn(found.id);
      setUserId(found.id);
      setNotFound(null);
      lastNotFound.current = null;
      setLocked(true);
    } else if (lastNotFound.current !== code) {
      lastNotFound.current = code;
      setNotFound(code);
    }
  }

  function handleNoCode() {
    if (ignoreCode.current && Date.now() - ignoreSeenAt.current > 1000) {
      ignoreCode.current = null;
    }
  }

  function rescan() {
    ignoreCode.current = userId;
    ignoreSeenAt.current = Date.now();
    setUserId(null);
    setNotFound(null);
    lastNotFound.current = null;
    setLocked(false);
    router.replace(scanPath);
  }

  function goTopup() {
    if (user) router.push(`/staff/topup?id=${encodeURIComponent(user.id)}`);
  }
  function goCheckinSuccess() {
    if (user) router.push(`/staff/scan/success?id=${encodeURIComponent(user.id)}`);
  }

  return (
    <>
      {/* กล้องเต็มจอด้านหลัง */}
      {!cameraError && (
        <QrScanner
          paused={locked}
          onScan={handleScan}
          onNoCode={handleNoCode}
          onError={setCameraError}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {cameraError && <div className="absolute inset-0 bg-[#1f2a2e]" aria-hidden />}

      {/* Header — รหัสงาน + ปุ่มปิด */}
      <div className="relative z-20">
        <header className="flex items-center justify-between gap-3 px-4 pt-4">
          <button
            onClick={() => router.push("/staff")}
            aria-label="ปิด"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1f2a2e] shadow-sm backdrop-blur"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
          <div className="rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            {isCheckin ? "สแกน QR เช็คอิน" : "สแกน QR เติม TOKEN"}
          </div>
          <div className="h-10 w-10" />
        </header>
      </div>

      {/* กรอบสแกน — มุมสีพีชเรืองเบา ๆ ไม่มีเส้นวิ่ง */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 py-8">
        <div className="relative flex h-60 w-60 items-center justify-center rounded-3xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
          <span className={`${corner} left-0 top-0 rounded-tl-3xl border-l-[3px] border-t-[3px] s-corner-pulse`} />
          <span className={`${corner} right-0 top-0 rounded-tr-3xl border-r-[3px] border-t-[3px] s-corner-pulse`} />
          <span className={`${corner} bottom-0 left-0 rounded-bl-3xl border-b-[3px] border-l-[3px] s-corner-pulse`} />
          <span className={`${corner} bottom-0 right-0 rounded-br-3xl border-b-[3px] border-r-[3px] s-corner-pulse`} />
        </div>
        <p className="max-w-[260px] text-center text-sm font-medium text-white/90 drop-shadow">
          {cameraError ??
            (locked ? "สแกนสำเร็จ กด “สแกนอีกครั้ง” เพื่อสแกนคนถัดไป" : "วาง QR ของผู้เข้าร่วมในกรอบ")}
        </p>
      </section>

      {/* Bottom sheet — ยกขึ้นมาแนบ กระจกใส ๆ */}
      <section className="relative z-20 rounded-t-[28px] bg-white px-4 pb-3 pt-3 shadow-[0_-10px_24px_-18px_rgba(0,0,0,0.25)]">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-300" />

        {user ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white ${
                    avatarPalette[(userIndex >= 0 ? userIndex : 0) % avatarPalette.length]
                  }`}
                >
                  {user.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#1f2a2e]">{user.name}</p>
                  <p className="truncate text-xs text-neutral-500">
                    {user.kind} · #{user.id}
                    {user.table ? ` · โต๊ะ ${user.table}` : ""}
                    {user.extra ? ` · +${user.extra}` : ""}
                  </p>
                </div>
              </div>
              {isCheckin &&
                (user.checkedIn ? (
                  <span className="shrink-0 rounded-full bg-[#d7ecd9] px-2.5 py-1 text-[11px] font-semibold text-[#2f8f7f]">
                    ✓ เช็คอินแล้ว
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-[#fbeecf] px-2.5 py-1 text-[11px] font-semibold text-[#c48a2a]">
                    รอเช็คอิน
                  </span>
                ))}
            </div>

            <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#fbe3dc] px-4 py-2.5">
              <span className="flex items-center gap-2 text-sm text-[#1f2a2e]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#f0705a]">
                  <circle cx="9" cy="13" r="6" opacity="0.85" />
                  <circle cx="15" cy="10" r="6" />
                </svg>
                TOKEN คงเหลือ
              </span>
              <span className="text-right">
                <span className="text-lg font-bold text-[#f0705a]">
                  {user.token.toLocaleString()}
                </span>
                {user.pending > 0 && (
                  <span className="ml-1 text-[11px] text-neutral-500">
                    (+{user.pending.toLocaleString()} รออนุมัติ)
                  </span>
                )}
              </span>
            </div>
          </>
        ) : (
          <p className="py-5 text-center text-sm text-neutral-500">
            {notFound ? `ไม่พบผู้ใช้รหัส "${notFound}"` : "ยังไม่ได้สแกน QR"}
          </p>
        )}

        {/* ปุ่ม Action */}
        <div className="mt-3 grid gap-2">
          {locked && (
            <button
              onClick={rescan}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1f2a2e] py-2.5 text-sm font-semibold text-[#1f2a2e]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                <path d="M4 12a8 8 0 0114-5.3L20 9" />
                <path d="M20 4v5h-5" />
              </svg>
              สแกนอีกครั้ง
            </button>
          )}
          {isCheckin ? (
            <button
              onClick={goCheckinSuccess}
              disabled={!user}
              className="w-full rounded-xl bg-[#f0705a] py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-12px_rgba(240,112,90,0.8)] disabled:opacity-40"
            >
              ดูใบตั๋วเช็คอิน
            </button>
          ) : (
            <button
              onClick={goTopup}
              disabled={!user}
              className="w-full rounded-xl bg-[#f0705a] py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-12px_rgba(240,112,90,0.8)] disabled:opacity-40"
            >
              เติม TOKEN
            </button>
          )}
        </div>
      </section>

      <BottomNavMain active={isCheckin ? undefined : "topup"} />
    </>
  );
}
