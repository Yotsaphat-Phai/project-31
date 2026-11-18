"use client";

// ข้อมูลผู้เข้าร่วม (ขั้นที่ 1/3): กรอกชื่อ รุ่น เบอร์โทร ของผู้เข้าร่วมทุกคน → ไปหน้าชำระเงิน

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { savePendingParticipants } from "../../_lib/tickets";

type Participant = { name: string; studentId: string; faculty: string; major: string; class: string; phone: string };
const empty: Participant = { name: "", studentId: "", faculty: "", major: "", class: "", phone: "" };

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
              <span
                className={`absolute top-5 right-1/2 w-full h-0.5 -z-0 ${i <= current ? "bg-[#E07A68]" : "bg-[#EEE6E6]"}`}
              />
            )}
            <span
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                active ? "bg-[#E07A68] text-white" : "bg-white border border-[#EEE6E6] text-gray-400"
              }`}
            >
              <i className={`bi ${s.icon}`} />
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

const inputCls =
  "w-full px-4 py-3 text-[15px] bg-white border rounded-xl outline-none text-[#2F2F45] placeholder:text-gray-300 focus:border-[#E07A68]";

function ParticipantsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qty = Math.max(1, parseInt(searchParams.get("qty") || "1"));
  const total = parseInt(searchParams.get("total") || "0");
  const eventId = searchParams.get("id") || "E001";

  const [participants, setParticipants] = useState<Participant[]>(() =>
    Array.from({ length: qty }, () => ({ ...empty }))
  );
  const [submitted, setSubmitted] = useState(false);

  const update = (idx: number, field: keyof Participant, value: string) =>
    setParticipants((list) => list.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));

  const isMissing = (p: Participant, f: keyof Participant) => submitted && !p[f].trim();
  const allFilled = participants.every((p) =>
    (Object.keys(empty) as (keyof Participant)[]).every((f) => p[f].trim())
  );

  const handleNext = () => {
    setSubmitted(true);
    if (!allFilled) return;
    savePendingParticipants(participants);
    router.push(`/event/payment?id=${eventId}&qty=${qty}&total=${total}`);
  };

  const field = (
    idx: number,
    f: keyof Participant,
    label: string,
    placeholder: string,
    type = "text",
    mode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  ) => {
    const p = participants[idx];
    const missing = isMissing(p, f);
    return (
      <label className="block">
        <span className="block mb-1.5 text-sm text-gray-600">{label}</span>
        <input
          type={type}
          inputMode={mode ?? (type === "tel" ? "tel" : undefined)}
          value={p[f]}
          onChange={(e) => update(idx, f, e.target.value)}
          placeholder={placeholder}
          className={`${inputCls} ${missing ? "border-red-300" : "border-[#EEE6E6]"}`}
        />
        {missing && <span className="block mt-1 text-xs text-red-500">กรุณากรอก{label}</span>}
      </label>
    );
  };

  return (
    <main className="min-h-screen bg-[#FDF5EC] pb-32">
      <div className="max-w-md mx-auto px-5 pt-5 space-y-6">
        {/* หัวหน้า */}
        <div className="relative flex items-center justify-center h-10">
          <Link
            href={`/event?id=${eventId}`}
            aria-label="ย้อนกลับ"
            className="absolute left-0 w-10 h-10 rounded-full bg-white border border-[#EEE6E6] flex items-center justify-center"
          >
            <i className="bi bi-chevron-left text-lg text-[#2F2F45]" />
          </Link>
          <h1 className="text-lg font-bold text-[#2F2F45]">ข้อมูลผู้เข้าร่วม</h1>
        </div>

        <Stepper current={0} />

        {/* ฟอร์มผู้เข้าร่วม */}
        <div className="space-y-4">
          {participants.map((_, idx) => (
            <section key={idx} className="bg-white rounded-3xl border border-[#EEE6E6] p-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-[#FBEAE5] flex items-center justify-center">
                  <i className="bi bi-person-fill text-[#E07A68]" />
                </span>
                <p className="font-bold text-[#2F2F45]">
                  ผู้เข้าร่วมคนที่ {idx + 1}
                  <span className="font-normal text-gray-400"> / {qty}</span>
                </p>
              </div>
              {field(idx, "name", "ชื่อ-นามสกุล", "ชื่อ นามสกุล")}
              {field(idx, "studentId", "รหัสนักศึกษา", "เช่น 64012345", "text", "numeric")}
              <div className="grid grid-cols-2 gap-3">
                {field(idx, "faculty", "คณะ", "เช่น วิศวกรรมศาสตร์")}
                {field(idx, "major", "สาขา", "เช่น คอมพิวเตอร์")}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field(idx, "class", "รุ่น", "เช่น 2567")}
                {field(idx, "phone", "เบอร์โทร", "0xx-xxx-xxxx", "tel")}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* แถบล่าง: ยอดรวม + ไปชำระเงิน */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[#EEE6E6]">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500">ราคารวม ({qty} ใบ)</p>
            <p className="text-2xl font-bold text-[#2F2F45]">฿{total.toLocaleString()}</p>
          </div>
          <button
            onClick={handleNext}
            className="bg-[#E07A68] text-white font-semibold px-7 py-3.5 rounded-2xl flex items-center gap-2 active:scale-95"
          >
            ไปชำระเงิน <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ParticipantsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDF5EC]" />}>
      <ParticipantsContent />
    </Suspense>
  );
}
