"use client";

// หน้าติดต่อแอดมิน (Vendor)
// - แจ้งปัญหา: เลือกหัวข้อ + รายละเอียด → ได้เลขที่เรื่อง
// frontend only — ส่งแล้วยังไม่ได้ไปถึงแอดมินจริง (เก็บใน state ของหน้า)

import { useState } from "react";
import Link from "next/link";

const TOPICS = [
  { key: "scan", icon: "bi-qr-code-scan", label: "สแกน QR ไม่ได้" },
  { key: "token", icon: "bi-coin", label: "ยอด TOKEN ไม่ตรง" },
  { key: "withdraw", icon: "bi-cash-stack", label: "ถอนเงิน / บัญชีรับเงิน" },
  { key: "other", icon: "bi-three-dots", label: "เรื่องอื่นๆ" },
] as const;

type TopicKey = (typeof TOPICS)[number]["key"];

type Report = {
  id: string;
  topic: TopicKey;
  time: string;
};

function topicLabel(key: TopicKey) {
  return TOPICS.find((t) => t.key === key)?.label ?? "";
}

export default function VendorContactPage() {
  const [topic, setTopic] = useState<TopicKey | "">("");
  const [txId, setTxId] = useState("");
  const [detail, setDetail] = useState("");
  const [errors, setErrors] = useState<{ topic?: string; detail?: string }>({});
  const [sent, setSent] = useState<Report | null>(null);
  const [history, setHistory] = useState<Report[]>([]);

  const submit = () => {
    const e: typeof errors = {};
    if (!topic) e.topic = "เลือกหัวข้อปัญหา";
    if (detail.trim().length < 5) e.detail = "อธิบายปัญหาอย่างน้อย 5 ตัวอักษร";
    setErrors(e);
    if (Object.keys(e).length > 0 || !topic) return;

    const now = new Date();
    const report: Report = {
      id: `RP-${String(history.length + 1).padStart(3, "0")}`,
      topic,
      time: now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
    };
    setHistory((h) => [report, ...h]);
    setSent(report);
    setTopic("");
    setTxId("");
    setDetail("");
  };

  return (
    <div className="min-h-screen w-screen bg-gray-200 flex items-center justify-center p-4">
      {/* Phone Container (แบบเดียวกับหน้า vendor อื่น) */}
      <div className="w-full max-w-sm h-[844px] bg-[#FAF4EC] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
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
            <h1 className="text-2xl font-bold text-gray-900">ติดต่อแอดมิน</h1>
          </div>

          {/* ===== ส่งเรื่องสำเร็จ ===== */}
          {sent && (
            <div className="mb-6 bg-emerald-50 rounded-3xl p-5">
              <div className="flex items-start gap-3">
                <i className="bi bi-check-circle-fill text-emerald-600 text-xl" />
                <div className="flex-1">
                  <p className="font-semibold text-emerald-800">ส่งเรื่องถึงแอดมินแล้ว</p>
                  <p className="mt-0.5 text-sm text-emerald-700">
                    เลขที่เรื่อง <span className="font-mono font-semibold">{sent.id}</span>
                  </p>
                  <p className="mt-1 text-xs text-emerald-700/80">
                    แอดมินจะติดต่อกลับทางเบอร์โทรของร้าน
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSent(null)}
                className="mt-3 w-full text-sm text-emerald-800 bg-white rounded-xl py-2"
              >
                แจ้งปัญหาเพิ่ม
              </button>
            </div>
          )}

          {/* ===== แจ้งปัญหา ===== */}
          {!sent && (
            <>
              <p className="text-xs text-gray-500 mb-2 ml-1">แจ้งปัญหา</p>
              <div className="bg-white rounded-3xl p-5 mb-6">
                {/* หัวข้อ */}
                <p className="text-sm font-semibold text-gray-900 mb-2">เรื่องอะไร</p>
                <div className="grid grid-cols-2 gap-2">
                  {TOPICS.map((t) => {
                    const active = topic === t.key;
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => {
                          setTopic(t.key);
                          setErrors((e) => ({ ...e, topic: undefined }));
                        }}
                        className={`flex items-center gap-2 px-3 py-3 rounded-xl text-left text-sm border transition ${
                          active
                            ? "bg-[#FDF0DD] border-[#E0A537] text-gray-900 font-semibold"
                            : "bg-white border-gray-200 text-gray-700"
                        }`}
                      >
                        <i className={`bi ${t.icon} ${active ? "text-[#E0A537]" : "text-gray-400"}`} />
                        <span className="leading-tight">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.topic && <p className="mt-1.5 text-xs text-red-500">{errors.topic}</p>}

                {/* เลขที่รายการ (ไม่บังคับ) */}
                {(topic === "scan" || topic === "token") && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-900 mb-1.5">
                      เลขที่รายการ <span className="text-xs font-normal text-gray-400">(ถ้ามี)</span>
                    </p>
                    <input
                      type="text"
                      value={txId}
                      onChange={(e) => setTxId(e.target.value)}
                      placeholder="T001"
                      className="w-full bg-[#FAF4EC] rounded-xl px-3 py-2.5 text-[15px] text-gray-900 outline-none border border-transparent focus:border-[#E0A537]"
                    />
                  </div>
                )}

                {/* รายละเอียด */}
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-900 mb-1.5">รายละเอียด</p>
                  <textarea
                    rows={4}
                    value={detail}
                    onChange={(e) => {
                      setDetail(e.target.value);
                      setErrors((er) => ({ ...er, detail: undefined }));
                    }}
                    placeholder="เช่น ลูกค้าสแกนแล้วขึ้นว่า QR หมดอายุ ทั้งที่เพิ่งกดรีเฟรช"
                    className={`w-full bg-[#FAF4EC] rounded-xl px-3 py-2.5 text-[15px] text-gray-900 outline-none border resize-none ${
                      errors.detail ? "border-red-400" : "border-transparent focus:border-[#E0A537]"
                    }`}
                  />
                  {errors.detail && <p className="mt-1 text-xs text-red-500">{errors.detail}</p>}
                </div>

                <button
                  type="button"
                  onClick={submit}
                  className="mt-4 w-full bg-[#E0A537] text-white font-semibold rounded-xl py-3 border border-[#C88F25] active:scale-95 transition"
                >
                  ส่งเรื่องถึงแอดมิน
                </button>
              </div>
            </>
          )}

          {/* ===== เรื่องที่แจ้งไปแล้ว ===== */}
          {history.length > 0 && (
            <>
              <p className="text-xs text-gray-500 mb-2 ml-1">เรื่องที่แจ้งไปแล้ว</p>
              <div className="bg-white rounded-3xl divide-y divide-gray-100">
                {history.map((r) => (
                  <div key={r.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{topicLabel(r.topic)}</p>
                      <p className="text-xs text-gray-400">
                        {r.id} · {r.time} น.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#B7791F] bg-[#FDF0DD] px-2.5 py-1 rounded-full">
                      รอแอดมินตอบ
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

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