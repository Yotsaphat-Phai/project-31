"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QrScanner from "./QrScanner";
import BottomNavMain from "./BottomNavMain";
import { avatarPalette, useCustomers } from "../_lib/mockUsers";

const corner = "absolute z-10 h-9 w-9 border-white";

export type ScanMode = "checkin" | "topup";

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
  // ดัชนีผู้ใช้ สำหรับเลือกสีวงกลม avatar ให้คงที่ต่อคน
  const userIndex = user ? list.findIndex((c) => c.id === user.id) : -1;

  useEffect(() => {
    setUserId(null);
    setLocked(false);
    setNotFound(null);
    lastNotFound.current = null;
    ignoreCode.current = null;
  }, []);

  // รับค่าจากหน้าค้นหา/รายชื่อ (?id=...)
  const fromSearchId = params.get("id");
  useEffect(() => {
    if (loaded && fromSearchId && find(fromSearchId)) {
      setUserId(fromSearchId.toUpperCase());
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

      <div className="relative z-20">
        {/* Header — ปุ่มย้อนกลับไปหน้าแรกอยู่ซ้ายบน */}
        <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-5 pt-5">
          <div>
            <button
              onClick={() => router.push("/staff")}
              className="flex items-center gap-1 text-sm font-semibold text-white drop-shadow"
              aria-label="กลับหน้าหลัก"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                <path d="M15 5l-7 7 7 7" />
              </svg>
              หน้าหลัก
            </button>
          </div>
          <h1 className="whitespace-nowrap text-lg font-semibold text-white drop-shadow">
            {isCheckin ? "สแกน QR เช็คอิน" : "สแกน QR เติม TOKEN"}
          </h1>
          <div />
        </header>
      </div>

      {/* กรอบสแกน */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 py-8">
        <div className="relative flex h-64 w-64 items-center justify-center rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
          <span className={`${corner} left-0 top-0 rounded-tl-2xl border-l-4 border-t-4`} />
          <span className={`${corner} right-0 top-0 rounded-tr-2xl border-r-4 border-t-4`} />
          <span className={`${corner} bottom-0 left-0 rounded-bl-2xl border-b-4 border-l-4`} />
          <span className={`${corner} bottom-0 right-0 rounded-br-2xl border-b-4 border-r-4`} />
          {!locked && <span className="animate-scanline h-0.5 w-48 rounded-full bg-[#f0705a]" />}
        </div>
        <p className="px-6 text-center text-sm text-white">
          {cameraError ??
            (locked ? "สแกนสำเร็จ กด “สแกนอีกครั้ง” เพื่อสแกนคนถัดไป" : "วาง QR ของผู้เข้าร่วมในกรอบ")}
        </p>
      </section>

      {/* Bottom sheet */}
      <section className="relative z-20 rounded-t-3xl bg-white px-5 pb-4 pt-3">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300" />

        {user ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white ${
                    avatarPalette[(userIndex >= 0 ? userIndex : 0) % avatarPalette.length]
                  }`}
                >
                  {user.initials}
                </span>
                <div>
                  <p className="font-semibold text-[#1f2a2e]">{user.name}</p>
                  <p className="text-xs text-neutral-500">
                    {user.kind} · #{user.id}
                    {user.table ? ` · โต๊ะ ${user.table}` : ""}
                    {user.extra ? ` · +${user.extra}` : ""}
                  </p>
                </div>
              </div>
              {isCheckin &&
                (user.checkedIn ? (
                  <span className="shrink-0 rounded-full bg-[#d7ecd9] px-3 py-1 text-xs font-medium text-[#2f8f7f]">
                    เช็คอินแล้ว ✓
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full bg-[#fbeecf] px-3 py-1 text-xs font-medium text-[#c48a2a]">
                    ยังไม่มา
                  </span>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#fbe3dc] px-4 py-3">
              <span className="text-sm text-[#1f2a2e]">TOKEN คงเหลือ</span>
              <span className="text-right">
                <span className="text-lg font-bold text-[#f0705a]">
                  {user.token.toLocaleString()}
                </span>
                {user.pending > 0 && (
                  <span className="block text-xs text-neutral-500">
                    +{user.pending.toLocaleString()} รออนุมัติ
                  </span>
                )}
              </span>
            </div>
          </>
        ) : (
          <p className="py-6 text-center text-sm text-neutral-500">
            {notFound ? `ไม่พบผู้ใช้รหัส "${notFound}"` : "ยังไม่ได้สแกน QR"}
          </p>
        )}

        {/* Action buttons */}
        <div className="mt-4 grid gap-2">
          {locked && (
            <button
              onClick={rescan}
              className="w-full rounded-xl border-2 border-[#1f2a2e] py-3 font-semibold text-[#1f2a2e]"
            >
              ↻ สแกนอีกครั้ง
            </button>
          )}
          {isCheckin ? (
            <button
              onClick={() => router.push("/staff/participants")}
              className="w-full rounded-xl bg-[#f0705a] py-3 font-semibold text-white"
            >
              ดูรายชื่อผู้เข้าร่วม
            </button>
          ) : (
            <button
              onClick={goTopup}
              disabled={!user}
              className="w-full rounded-xl bg-[#f0705a] py-3 font-semibold text-white disabled:opacity-40"
            >
              เติม TOKEN
            </button>
          )}
        </div>
      </section>

      {/* หน้าสแกนเช็คอิน ไม่ highlight tab ใด (เข้าได้จากปุ่มใหญ่หน้าแรก)
          หน้าสแกน topup → highlight "เติม TOKEN" */}
      <BottomNavMain active={isCheckin ? undefined : "topup"} />
    </>
  );
}
