"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StaffBadge, UserInfo } from "../_components/ui";
import QrScanner from "../_components/QrScanner";
import BottomNav from "../_components/BottomNav";
import { useCustomers } from "../_lib/mockUsers";

const corner = "absolute z-10 h-9 w-9 border-white";

function ScanContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { loaded, find, checkIn } = useCustomers();

  // ทุกครั้งที่เข้าหน้านี้ state เริ่มใหม่ ไม่ค้างผลสแกนครั้งก่อน
  const [userId, setUserId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [notFound, setNotFound] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const lastNotFound = useRef<string | null>(null);
  // QR ที่เพิ่งล็อกไป — หลังกดสแกนอีกครั้งจะไม่ล็อกซ้ำ จนกว่า QR ใบนั้นจะออกจากกล้อง
  const ignoreCode = useRef<string | null>(null);
  const ignoreSeenAt = useRef(0);

  const user = userId ? find(userId) : null;

  // Next.js เก็บ state ของหน้าที่ออกไปแล้วไว้ พอกลับมาจึงต้องล้างเองทุกครั้ง
  // (effect นี้ทำงานใหม่ทุกครั้งที่กลับเข้าหน้านี้)
  useEffect(() => {
    setUserId(null);
    setLocked(false);
    setNotFound(null);
    lastNotFound.current = null;
    ignoreCode.current = null;
  }, []);

  // มาจากหน้าค้นหา (?id=...) ให้แสดงข้อมูลลูกค้าคนนั้น แต่กล้องยังสแกนต่อ ไม่ล็อกภาพ
  const fromSearchId = params.get("id");
  useEffect(() => {
    if (loaded && fromSearchId && find(fromSearchId)) {
      setUserId(fromSearchId.toUpperCase());
    }
    // ไม่ใส่ find ใน deps — ให้ทำแค่ตอนเข้าหน้า ไม่ทำซ้ำตอนข้อมูลเปลี่ยน
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
      checkIn(found.id);
      setUserId(found.id);
      setNotFound(null);
      lastNotFound.current = null;
      setLocked(true); // ล็อกภาพไว้
    } else if (lastNotFound.current !== code) {
      lastNotFound.current = code;
      setNotFound(code); // ไม่ล็อก สแกนต่อได้
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
    router.replace("/staff/scan");
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
        {/* Header — ปุ่มสแกนอีกครั้งอยู่ซ้ายบน */}
        <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-5 pt-5">
          <div>
            {locked && (
              <button
                onClick={rescan}
                className="flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-white drop-shadow"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                  <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" />
                </svg>
                สแกนอีกครั้ง
              </button>
            )}
          </div>
          <h1 className="whitespace-nowrap text-lg font-semibold text-white drop-shadow">สแกน QR เช็คอิน</h1>
          <div className="flex justify-end">
            <StaffBadge />
          </div>
        </header>
      </div>

      {/* กรอบสแกน — นอกกรอบมืดลงแบบแอปธนาคาร */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 py-8">
        <div className="relative flex h-64 w-64 items-center justify-center rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
          <span className={`${corner} left-0 top-0 rounded-tl-2xl border-l-4 border-t-4`} />
          <span className={`${corner} right-0 top-0 rounded-tr-2xl border-r-4 border-t-4`} />
          <span className={`${corner} bottom-0 left-0 rounded-bl-2xl border-b-4 border-l-4`} />
          <span className={`${corner} bottom-0 right-0 rounded-br-2xl border-b-4 border-r-4`} />
          {!locked && <span className="animate-scanline h-0.5 w-48 rounded-full bg-[#e8743b]" />}
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
            <div className="flex items-start justify-between">
              <UserInfo name={user.name} meta={`รุ่น ${user.batch} · รหัส #${user.id}`} />
              {user.checkedIn ? (
                <span className="rounded-full bg-[#2f8f7f]/15 px-3 py-1 text-xs font-medium text-[#2f8f7f]">
                  เช็คอินแล้ว ✓
                </span>
              ) : (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  ยังไม่มา
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#fbe3dc] px-4 py-3">
              <span className="text-sm text-[#1f2a2e]">TOKEN คงเหลือ</span>
              <span className="text-right">
                <span className="text-lg font-bold text-[#e8743b]">{user.token.toLocaleString()}</span>
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

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push("/staff/search")}
            className="rounded-xl border-2 border-[#2f8f7f] py-3 font-semibold text-[#2f8f7f]"
          >
            ค้นหารายชื่อ
          </button>
          <button
            onClick={goTopup}
            disabled={!user}
            className="rounded-xl bg-[#2f8f7f] py-3 font-semibold text-white disabled:opacity-40"
          >
            เติม TOKEN
          </button>
        </div>
      </section>

      <BottomNav active="scan" topupId={user?.id} />
    </>
  );
}

export default function StaffScanPage() {
  return (
    <main className="relative mx-auto flex min-h-dvh max-w-[390px] flex-col overflow-hidden bg-[#1f2a2e]">
      <Suspense fallback={null}>
        <ScanContent />
      </Suspense>
    </main>
  );
}
