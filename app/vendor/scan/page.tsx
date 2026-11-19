"use client";

// หน้าสแกน QR รับชำระของ Vendor
// - รับ query ?amount=XXX (จากปุ่ม "รับชำระเร็ว" บนหน้าแรก) มา prefill ช่องยอดชำระ
// - ปุ่มย้อนกลับ → /vendor
// - Bottom nav 4 ไอคอน (เหมือนทุกหน้า vendor)

import { Suspense, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentUser } from "../../_lib/auth";
import { shops, type Shop } from "../../_lib/mock";
import { payAtShop, type VendorTx } from "../../_lib/vendorTx";
// ใช้ตัวสแกนเดียวกับฝั่ง staff (jsQR) — เปิดกล้องครั้งเดียว อ่าน QR ทั้งภาพ
import QrScanner from "../../staff/_components/QrScanner";

const noopSubscribe = () => () => {};

function useMyShop(): Shop {
  const vendorId = useSyncExternalStore(
    noopSubscribe,
    () => getCurrentUser()?.id ?? "",
    () => ""
  );
  return shops.find((s) => s.vendorId === vendorId) ?? shops[0];
}

function VendorScanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shop = useMyShop();

  // prefill จาก ?amount=XXX (ปุ่มรับชำระเร็ว); ถ้าไม่มีให้ 0
  const presetAmount = Number(searchParams.get("amount") || 0);

  const [scanResult, setScanResult] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(presetAmount);
  const [manualCode, setManualCode] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ tx: VendorTx; balance: number } | null>(null);
  const [cameraError, setCameraError] = useState("");

  // กล้องอ่าน QR ได้ → เก็บเลข (ตัด # และช่องว่าง) แล้วหยุดภาพไว้
  const handleScan = (text: string) => {
    if (scanResult) return;
    setScanResult(text.trim().replace(/^#/, ""));
    setError("");
  };

  // ยืนยัน: ใช้เลขจากกล้อง หรือเลขที่พิมพ์เอง → ตัด TOKEN จริง + บันทึกรายการร้าน
  const handleConfirm = () => {
    const code = (scanResult ?? manualCode).trim();
    if (!amount || amount <= 0) return setError("กรุณากรอกยอดชำระ");
    if (!code) return setError("กรุณาสแกน QR หรือพิมพ์เลข QR ของลูกค้า");
    const res = payAtShop(shop, code, amount);
    if (!res.ok) return setError(res.error);
    setError("");
    setDone({ tx: res.tx, balance: res.balance });
  };

  const nextCustomer = () => {
    setDone(null);
    setManualCode("");
    setAmount(presetAmount);
    handleRescan();
  };

  // สแกนใหม่ = ล้างผลเดิม → ภาพกล้องเล่นต่อและอ่าน QR ใหม่
  const handleRescan = () => {
    setScanResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen w-screen bg-gray-200 flex items-center justify-center p-4">
      {/* Phone Container */}
      <div className="w-full max-w-sm h-[844px] bg-[#FAF4EC] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        {/* Top: Dark scanner area */}
        <div className="flex-1 bg-[#1A2129] relative overflow-hidden">
          <QrScanner
            paused={!!scanResult || !!done}
            onScan={handleScan}
            onError={setCameraError}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />

          {/* Header: back button + title + Vendor badge */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-6 pb-4 z-10">
            <button
              type="button"
              onClick={() => router.push("/vendor")}
              aria-label="ย้อนกลับ"
              className="text-white p-1 active:scale-90 transition"
            >
              <i className="bi bi-chevron-left text-xl" />
            </button>
            <h1 className="text-white text-base font-semibold drop-shadow-lg">
              สแกน QR ชำระสินค้า
            </h1>
            <span className="bg-[#D9A441] text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-lg">
              Vendor
            </span>
          </div>

          {/* Scan frame */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <div className="relative w-56 h-56">
              <div className="absolute -top-1 -left-1 w-10 h-10 border-t-[3px] border-l-[3px] border-white rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-10 h-10 border-t-[3px] border-r-[3px] border-white rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-[3px] border-l-[3px] border-white rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-[3px] border-r-[3px] border-white rounded-br-lg" />

              {!scanResult && (
                <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.8)] animate-pulse" />
              )}
            </div>

            <p className="text-white text-sm mt-6 drop-shadow-lg">
              {scanResult ? "✅ สแกนสำเร็จแล้ว" : "วาง QR ของผู้ใช้งานในกรอบ"}
            </p>
            {cameraError && !scanResult && (
              <p className="mt-2 mx-6 text-center text-xs text-red-300 drop-shadow-lg">{cameraError}</p>
            )}

            {scanResult && (
              <div className="mt-3 bg-black/50 rounded-lg px-3 py-2 max-w-xs">
                <p className="text-white text-[10px] break-all text-center">
                  {scanResult}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: White card */}
        <div className="bg-white rounded-t-3xl p-5 shadow-2xl -mt-5 relative z-20">
          {done ? (
            <div className="text-center">
              <i className="bi bi-check-circle-fill text-4xl text-emerald-500" />
              <p className="mt-1 font-bold text-gray-900">ตัด TOKEN สำเร็จ</p>
              <p className="text-sm text-gray-500">{done.tx.customerName} · #{done.tx.customerId}</p>
              <p className="mt-2 text-3xl font-extrabold text-gray-900">
                −{done.tx.amount.toLocaleString()} <span className="text-sm font-semibold text-[#C8A057]">TOKEN</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">ยอดคงเหลือลูกค้า {done.balance.toLocaleString()} TOKEN</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => router.push("/vendor")} className="flex-1 bg-gray-200 text-gray-700 text-sm font-semibold py-3 rounded-xl">
                  หน้าแรก
                </button>
                <button onClick={nextCustomer} className="flex-1 bg-[#D9A441] text-white text-sm font-semibold py-3 rounded-xl shadow-lg">
                  สแกนคนถัดไป
                </button>
              </div>
            </div>
          ) : (
          <>
          <p className="text-sm text-gray-700 font-semibold mb-3">{shop.name}</p>

          {!scanResult && (
            <input
              value={manualCode}
              onChange={(e) => { setManualCode(e.target.value.replace(/D/g, "")); setError(""); }}
              inputMode="numeric"
              maxLength={5}
              placeholder="หรือพิมพ์เลข QR ลูกค้า เช่น 00429"
              className="w-full mb-3 bg-[#FAF4EC] rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#D9A441]"
            />
          )}

          <div className="bg-[#FAF4EC] rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
            <span className="text-xs text-gray-600 whitespace-nowrap">
              ยอดชำระ:
            </span>
            <input
              type="number"
              value={amount || ""}
              onChange={(e) => { setAmount(parseInt(e.target.value) || 0); setError(""); }}
              suppressHydrationWarning
              placeholder="0"
              className="flex-1 bg-white rounded-lg px-3 py-2 text-xl font-bold text-gray-900 text-right outline-none focus:ring-2 focus:ring-[#D9A441]"
            />
          </div>

          {error && <p className="text-center text-sm text-red-500 mb-2">{error}</p>}

          {scanResult ? (
            <div className="flex gap-2">
              <button
                onClick={handleRescan}
                suppressHydrationWarning
                className="flex-1 bg-gray-200 text-gray-700 text-sm font-semibold py-3 rounded-xl active:scale-95 transition"
              >
                สแกนใหม่
              </button>
              <button
                onClick={handleConfirm}
                suppressHydrationWarning
                className="flex-1 bg-[#D9A441] hover:bg-[#c8942f] text-white text-sm font-semibold py-3 rounded-xl shadow-lg active:scale-95 transition"
              >
                ยืนยันตัด TOKEN
              </button>
            </div>
          ) : (
            <button
              onClick={handleConfirm}
              suppressHydrationWarning
              className="w-full bg-[#D9A441] hover:bg-[#c8942f] text-white text-sm font-semibold py-3 rounded-xl shadow-lg active:scale-95 transition"
            >
              ยืนยันตัด TOKEN
            </button>
          )}
          </>
          )}
        </div>

        {/* Bottom Navigation — 4 icons (consistent with other vendor pages) */}
        <nav className="bg-white px-6 py-4 flex items-center justify-around text-gray-900 border-t border-gray-200">
          <Link href="/vendor" aria-label="หน้าแรก" className="p-2 hover:text-[#D9A441] transition-colors">
            <i className="bi bi-house text-2xl" />
          </Link>
          <Link href="/vendor/scan" aria-label="สแกน / ขายสินค้า" className="p-2 text-[#D9A441]">
            <i className="bi bi-grid-fill text-2xl" />
          </Link>
          <Link href="/vendor/history" aria-label="ประวัติรายการ" className="p-2 hover:text-[#D9A441] transition-colors">
            <i className="bi bi-list text-3xl" />
          </Link>
          <Link href="/vendor/account" aria-label="บัญชีร้านค้า" className="p-2 hover:text-[#D9A441] transition-colors">
            <i className="bi bi-person text-2xl" />
          </Link>
        </nav>
      </div>
    </div>
  );
}

// useSearchParams ต้องอยู่ใน <Suspense> ไม่งั้น npm run build จะพัง
export default function VendorScanPage() {
  return (
    <Suspense fallback={null}>
      <VendorScanContent />
    </Suspense>
  );
}