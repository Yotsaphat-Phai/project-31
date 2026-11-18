"use client";

// ชำระเงิน (ขั้นที่ 2/3): แสดง QR ชำระเงิน + แนบรูปสลิป → ยืนยันแล้วออกบัตรทันที
// ตอนนี้ QR เป็นข้อความอ้างอิงการชำระเงิน (สแกนอ่านได้ แต่ยังไม่ใช่ PromptPay)
// และรับรูปอะไรก็ได้เป็นสลิป (ยังไม่ตรวจสอบ) — ภายหลังเปลี่ยนที่ paymentPayload / ขั้นตอนตรวจสลิป

import { useMemo, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { recordPurchase } from "../../_lib/tickets";

// ข้อความใน QR — เปลี่ยนเป็น PromptPay payload ได้ที่ฟังก์ชันนี้ที่เดียว
function paymentPayload(eventId: string, qty: number, total: number) {
  return `PAY-${eventId}-${qty}-${total}-${Date.now()}`;
}

// ย่อรูปให้ด้านยาวไม่เกิน 800px แล้วแปลงเป็น JPEG (ให้พอเก็บใน localStorage ได้)
function compressImage(file: File, maxSize = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("อ่านไฟล์รูปไม่ได้"));
    };
    img.src = url;
  });
}

const steps = [
  { label: "ข้อมูล", icon: "bi-person-lines-fill" },
  { label: "ชำระเงิน", icon: "bi-credit-card" },
  { label: "รับ QR", icon: "bi-qr-code" },
];

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-start">
      {steps.map((s, i) => {
        const active = i <= current;
        return (
          <div key={s.label} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <span className={`absolute top-5 right-1/2 w-full h-0.5 ${i <= current ? "bg-[#E07A68]" : "bg-[#EEE6E6]"}`} />
            )}
            <span
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                active ? "bg-[#E07A68] text-white" : "bg-white border border-[#EEE6E6] text-gray-400"
              }`}
            >
              <i className={`bi ${i < current ? "bi-check-lg" : s.icon}`} />
            </span>
            <span className={`mt-1.5 text-xs ${i === current ? "font-semibold text-[#E07A68]" : "text-gray-400"}`}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const total = parseInt(searchParams.get("total") || "0");
  const eventId = searchParams.get("id") || "E001";
  const qty = parseInt(searchParams.get("qty") || "1");

  const payload = useMemo(() => paymentPayload(eventId, qty, total), [eventId, qty, total]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [slip, setSlip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // ให้เลือกไฟล์เดิมซ้ำได้
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("กรุณาเลือกไฟล์รูปภาพ");
      return;
    }
    setError("");
    setLoading(true);
    try {
      setSlip(await compressImage(file));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!slip) {
      setError("กรุณาแนบสลิปการโอนเงินก่อน");
      return;
    }
    try {
      recordPurchase(eventId, qty, total, slip);
    } catch (err) {
      setError((err as Error).message);
      return;
    }
    router.push("/event/ticket");
  };

  return (
    <main className="min-h-screen bg-[#FDF5EC] pb-32">
      <div className="max-w-md mx-auto px-5 pt-5 space-y-6">
        {/* หัวหน้า */}
        <div className="relative flex items-center justify-center h-10">
          <Link
            href={`/event/participants?id=${eventId}&qty=${qty}&total=${total}`}
            aria-label="ย้อนกลับ"
            className="absolute left-0 w-10 h-10 rounded-full bg-white border border-[#EEE6E6] flex items-center justify-center"
          >
            <i className="bi bi-chevron-left text-lg text-[#2F2F45]" />
          </Link>
          <h1 className="text-lg font-bold text-[#2F2F45]">ชำระเงิน</h1>
        </div>

        <Stepper current={1} />

        {/* QR ชำระเงิน */}
        <section className="bg-white rounded-3xl border border-[#EEE6E6] overflow-hidden">
          <div className="bg-[#2F2F45] text-white text-center py-3">
            <p className="text-xs text-[#B9B9C6]">ยอดชำระ ({qty} ใบ)</p>
            <p className="text-3xl font-bold">฿{total.toLocaleString()}</p>
          </div>
          <div className="p-5 flex flex-col items-center">
            <div className="p-3 rounded-2xl border border-[#EEE6E6]">
              <QRCodeSVG value={payload} size={200} level="M" />
            </div>
            <p className="mt-3 text-sm text-gray-500 text-center">สแกน QR เพื่อชำระเงิน แล้วแนบสลิปด้านล่าง</p>
          </div>
        </section>

        {/* แนบสลิป */}
        <section className="bg-white rounded-3xl border border-[#EEE6E6] p-5 space-y-3">
          <p className="font-semibold text-[#2F2F45]">
            <i className="bi bi-receipt me-2 text-[#E07A68]" />แนบสลิปการโอนเงิน
          </p>
          <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />

          {slip ? (
            <div className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- data URL จากเครื่องผู้ใช้ */}
              <img src={slip} alt="สลิปที่แนบ" className="w-full max-h-80 object-contain rounded-2xl bg-[#FDF5EC]" />
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="py-2.5 rounded-xl border border-[#EEE6E6] text-sm font-semibold text-[#2F2F45]"
                >
                  <i className="bi bi-arrow-repeat me-1" />เปลี่ยนรูป
                </button>
                <button
                  onClick={() => setSlip(null)}
                  className="py-2.5 rounded-xl border border-[#F3C9C1] text-sm font-semibold text-[#E07A68]"
                >
                  <i className="bi bi-trash me-1" />ลบ
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              className="w-full border-2 border-dashed border-[#F3C9C1] rounded-2xl py-8 flex flex-col items-center gap-1 text-[#E07A68] disabled:opacity-60"
            >
              <i className={`bi ${loading ? "bi-hourglass-split" : "bi-cloud-arrow-up"} text-3xl`} />
              <span className="font-semibold">{loading ? "กำลังโหลดรูป…" : "แตะเพื่อเลือกรูปสลิป"}</span>
              <span className="text-xs text-gray-400">รองรับไฟล์รูปภาพ (JPG, PNG)</span>
            </button>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </section>
      </div>

      {/* แถบล่าง */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[#EEE6E6]">
        <div className="max-w-md mx-auto px-5 py-4">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`w-full font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95 ${
              slip ? "bg-[#E07A68] text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            ยืนยันการชำระเงิน <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDF5EC]" />}>
      <PaymentContent />
    </Suspense>
  );
}
