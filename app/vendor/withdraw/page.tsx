"use client";

// หน้าถอน TOKEN (Vendor)
// 1) กรอกจำนวน → 2) ยืนยัน → 3) ส่งคำขอสำเร็จ (รอแอดมินโอนเงิน)
// frontend only — ยอดคงเหลือจาก mock, ส่งคำขอแล้วยังไม่ได้ตัดยอดจริง

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { getCurrentUser } from "../../_lib/auth";
import { shops, type Shop } from "../../_lib/mock";
import { getShopBalance } from "../../_lib/vendorBalance";

const noopSubscribe = () => () => {};

// ร้านของ vendor ที่ login อยู่ (ยังไม่ login / ไม่พบ → ร้านแรกใน mock)
function useMyShop(): Shop {
  const vendorId = useSyncExternalStore(
    noopSubscribe,
    () => getCurrentUser()?.id ?? "",
    () => ""
  );
  return shops.find((s) => s.vendorId === vendorId) ?? shops[0];
}

// ===== ตั้งค่า (mock) =====
const MIN_WITHDRAW = 100; // ถอนขั้นต่ำ
const FEE: number = 0; // ค่าธรรมเนียม
const RATE = 1; // 1 TOKEN = 1 บาท

// บัญชีรับเงิน (ตรงกับหน้าข้อมูลร้าน — แก้ได้เฉพาะแอดมิน)
const BANK_ACCOUNT = {
  bank: "กสิกรไทย",
  accountName: "นายสมชาย ใจดี",
  accountNo: "1234567890",
};

function maskAccount(n: string) {
  if (n.length < 5) return n;
  return `xxx-x-x${n.slice(-5, -1)}-${n.slice(-1)}`;
}

type Step = "form" | "confirm" | "done";

export default function VendorWithdrawPage() {
  const shop = useMyShop();
  // ยอดคงเหลือเดียวกับหน้าบัญชีร้านค้า (รวมยอดขายจริง)
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const balance = mounted ? getShopBalance(shop) : 0;

  const [step, setStep] = useState<Step>("form");
  const [amountText, setAmountText] = useState("");
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState("");

  const amount = Number(amountText || 0);
  const receive = Math.max(0, amount * RATE - FEE);

  const setAmount = (n: number) => {
    setAmountText(n > 0 ? String(n) : "");
    setError("");
  };

  const goConfirm = () => {
    if (!amount) return setError("กรอกจำนวน TOKEN ที่ต้องการถอน");
    if (amount < MIN_WITHDRAW) return setError(`ถอนขั้นต่ำ ${MIN_WITHDRAW.toLocaleString()} TOKEN`);
    if (amount > balance) return setError("ยอด TOKEN คงเหลือไม่พอ");
    setStep("confirm");
  };

  const submit = () => {
    setRequestId(`WD-${String(Date.now()).slice(-6)}`);
    setStep("done");
  };

  return (
    <div className="min-h-screen w-screen bg-gray-200 flex items-center justify-center p-4">
      {/* Phone Container (แบบเดียวกับหน้า vendor อื่น) */}
      <div className="relative w-full max-w-sm h-[844px] bg-[#FAF4EC] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-5 pt-8 pb-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/vendor/account"
              aria-label="กลับ"
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-700"
            >
              <i className="bi bi-chevron-left" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">ถอน TOKEN</h1>
          </div>

          {step === "done" ? (
            /* ===== 3) ส่งคำขอสำเร็จ ===== */
            <div className="bg-white rounded-3xl p-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                <i className="bi bi-check-lg text-3xl text-emerald-600" />
              </div>
              <p className="mt-4 text-lg font-bold text-gray-900">ส่งคำขอถอนแล้ว</p>
              <p className="mt-1 text-sm text-gray-500">
                แอดมินจะโอนเงินเข้าบัญชีของร้านภายใน 1–3 วันทำการ
              </p>

              <div className="mt-5 bg-[#FAF4EC] rounded-2xl p-4 space-y-2 text-sm text-left">
                <Row label="เลขที่คำขอ" value={requestId} mono />
                <Row label="จำนวนที่ถอน" value={`${amount.toLocaleString()} TOKEN`} />
                <Row label="ยอดที่จะได้รับ" value={`฿${receive.toLocaleString()}`} strong />
                <Row label="โอนเข้า" value={`${BANK_ACCOUNT.bank} ${maskAccount(BANK_ACCOUNT.accountNo)}`} />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-500">สถานะ</span>
                  <span className="text-xs font-semibold text-[#B7791F] bg-[#FDF0DD] px-2.5 py-1 rounded-full">
                    รอแอดมินโอนเงิน
                  </span>
                </div>
              </div>

              <Link
                href="/vendor/account"
                className="mt-5 block w-full bg-[#E0A537] text-white font-semibold rounded-xl py-3 border border-[#C88F25] active:scale-95 transition"
              >
                กลับหน้าบัญชีร้านค้า
              </Link>
            </div>
          ) : (
            /* ===== 1) กรอกจำนวน ===== */
            <>
              {/* ยอดคงเหลือ */}
              <div className="bg-white rounded-3xl p-5 mb-6">
                <p className="text-xs text-gray-500">Token คงเหลือ</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {balance.toLocaleString()} <span className="text-sm font-semibold text-[#E0A537]">TOKEN</span>
                </p>
                <p className="mt-1 text-xs text-gray-400">1 TOKEN = {RATE} บาท</p>
              </div>

              {/* จำนวนที่ถอน */}
              <p className="text-xs text-gray-500 mb-2 ml-1">จำนวนที่ต้องการถอน</p>
              <div className="bg-white rounded-3xl p-5 mb-6">
                <div
                  className={`flex items-center bg-[#FAF4EC] rounded-2xl px-4 py-3 border ${
                    error ? "border-red-400" : "border-transparent focus-within:border-[#E0A537]"
                  }`}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amountText ? Number(amountText).toLocaleString() : ""}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                      setAmountText(digits.replace(/^0+/, ""));
                      setError("");
                    }}
                    placeholder="0"
                    className="flex-1 min-w-0 bg-transparent outline-none text-3xl font-bold text-gray-900"
                  />
                  <span className="text-sm font-semibold text-[#E0A537]">TOKEN</span>
                </div>
                {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}

                {/* ปุ่มเลือกจำนวนเร็ว */}
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {[1000, 5000, 10000].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setAmount(Math.min(n, balance))}
                      className="py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-[#E0A537] active:scale-95 transition"
                    >
                      {n.toLocaleString()}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount(balance)}
                    className="py-2 rounded-xl text-sm font-semibold bg-[#FDF0DD] text-[#B7791F] active:scale-95 transition"
                  >
                    ทั้งหมด
                  </button>
                </div>

                <p className="mt-3 text-xs text-gray-400">ถอนขั้นต่ำ {MIN_WITHDRAW.toLocaleString()} TOKEN</p>
              </div>

              {/* บัญชีปลายทาง */}
              <p className="text-xs text-gray-500 mb-2 ml-1">โอนเข้าบัญชี</p>
              <div className="bg-white rounded-3xl p-5 mb-6">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-[#FDF0DD] flex items-center justify-center text-[#E0A537]">
                    <i className="bi bi-bank2" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-gray-900">{BANK_ACCOUNT.bank}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {maskAccount(BANK_ACCOUNT.accountNo)} · {BANK_ACCOUNT.accountName}
                    </p>
                  </div>
                </div>
                <Link
                  href="/vendor/contact"
                  className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#E0A537]"
                >
                  <i className="bi bi-info-circle" />
                  ต้องการเปลี่ยนบัญชี? ติดต่อแอดมิน
                </Link>
              </div>

              {/* สรุป */}
              <div className="bg-white rounded-3xl p-5 space-y-2 text-sm">
                <Row label="จำนวนที่ถอน" value={`${amount.toLocaleString()} TOKEN`} />
                <Row label="ค่าธรรมเนียม" value={FEE === 0 ? "ฟรี" : `฿${FEE.toLocaleString()}`} />
                <div className="border-t border-dashed border-gray-200 pt-2">
                  <Row label="ยอดที่จะได้รับ" value={`฿${receive.toLocaleString()}`} strong />
                </div>
              </div>

              <button
                type="button"
                onClick={goConfirm}
                className="mt-6 w-full bg-[#E0A537] text-white font-semibold rounded-xl py-3.5 border border-[#C88F25] active:scale-95 transition"
              >
                ถอน TOKEN
              </button>
            </>
          )}
        </div>

        {/* ===== 2) หน้าต่างยืนยัน ===== */}
        {step === "confirm" && (
          <div className="absolute inset-0 z-20 bg-black/40 flex items-end" onClick={() => setStep("form")}>
            <div className="w-full bg-white rounded-t-[32px] px-6 pt-4 pb-8" onClick={(e) => e.stopPropagation()}>
              <div className="mx-auto w-10 h-1 rounded-full bg-gray-300" />
              <p className="mt-4 text-lg font-bold text-gray-900">ยืนยันการถอน</p>

              <div className="mt-4 bg-[#FAF4EC] rounded-2xl p-4 space-y-2 text-sm">
                <Row label="จำนวนที่ถอน" value={`${amount.toLocaleString()} TOKEN`} />
                <Row label="ยอดที่จะได้รับ" value={`฿${receive.toLocaleString()}`} strong />
                <Row label="โอนเข้า" value={BANK_ACCOUNT.bank} />
                <Row label="เลขบัญชี" value={maskAccount(BANK_ACCOUNT.accountNo)} />
                <Row label="ชื่อบัญชี" value={BANK_ACCOUNT.accountName} />
              </div>

              <p className="mt-3 text-xs text-gray-500">
                ตรวจสอบบัญชีให้ถูกต้อง เมื่อส่งคำขอแล้วจะยกเลิกไม่ได้
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="bg-white border border-gray-300 rounded-xl py-3 text-gray-800 active:scale-95 transition"
                >
                  แก้ไข
                </button>
                <button
                  type="button"
                  onClick={submit}
                  className="bg-[#E0A537] text-white font-semibold rounded-xl py-3 border border-[#C88F25] active:scale-95 transition"
                >
                  ยืนยันถอน
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation — 4 icons (เหมือนหน้า vendor อื่น) */}
        <nav className="bg-[#FAF4EC] px-6 py-4 flex items-center justify-around text-gray-900 border-t border-[#EADFCB]">
          <Link href="/vendor" aria-label="หน้าแรก" className="p-2 hover:text-[#D9A441] transition-colors">
            <i className="bi bi-house text-2xl" />
          </Link>
          <Link href="/vendor/scan" aria-label="สแกน / ขายสินค้า" className="p-2 hover:text-[#D9A441] transition-colors">
            <i className="bi bi-grid text-2xl" />
          </Link>
          <Link href="/vendor/history" aria-label="ประวัติรายการ" className="p-2 hover:text-[#D9A441] transition-colors">
            <i className="bi bi-list text-3xl" />
          </Link>
          <Link href="/vendor/account" aria-label="บัญชีร้านค้า" className="p-2 text-[#D9A441]">
            <i className="bi bi-person-fill text-2xl" />
          </Link>
        </nav>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  mono,
}: {
  label: string;
  value: string;
  strong?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span
        className={`text-right ${mono ? "font-mono" : ""} ${
          strong ? "text-base font-bold text-[#E0A537]" : "font-medium text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}