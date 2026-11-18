"use client";

// หน้าข้อมูลร้าน (Vendor)
// - เบอร์ติดต่อ: ร้านค้าแก้ไขเองได้
// - บัญชีธนาคาร: ร้านค้าดูได้อย่างเดียว แก้ไขได้เฉพาะแอดมิน
// frontend only — ข้อมูลเก็บใน state (รีเฟรชแล้วกลับเป็นค่าเริ่มต้น)

import { useState } from "react";
import Link from "next/link";

// ===== ข้อมูล mock =====
const INITIAL_PHONE = "0812345678";

const BANK_ACCOUNT = {
  bank: "กสิกรไทย",
  accountName: "นายสมชาย ใจดี",
  accountNo: "1234567890",
};

// 0812345678 → 081-234-5678
function formatPhone(p: string) {
  return p.length === 10 ? `${p.slice(0, 3)}-${p.slice(3, 6)}-${p.slice(6)}` : p;
}

// 1234567890 → xxx-x-x6789-0  (ซ่อนเลขบัญชีบางส่วน)
function maskAccount(n: string) {
  if (n.length < 5) return n;
  return `xxx-x-x${n.slice(-5, -1)}-${n.slice(-1)}`;
}

export default function VendorInfoPage() {
  const [phone, setPhone] = useState(INITIAL_PHONE); // ค่าที่บันทึกแล้ว
  const [draft, setDraft] = useState(INITIAL_PHONE); // ค่าระหว่างแก้ไข
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const startEdit = () => {
    setDraft(phone);
    setError("");
    setSaved(false);
    setEditing(true);
  };

  const cancelEdit = () => {
    setError("");
    setEditing(false);
  };

  const save = () => {
    if (!/^0\d{9}$/.test(draft)) {
      setError("กรอกเบอร์โทร 10 หลัก ขึ้นต้นด้วย 0");
      return;
    }
    setPhone(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-200 flex items-center justify-center p-4">
      {/* Phone Container (แบบเดียวกับหน้า vendor อื่น) */}
      <div className="w-full max-w-sm h-[844px] bg-[#FAF4EC] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-5 pt-8 pb-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/vendor/account"
              aria-label="กลับ"
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-700"
            >
              <i className="bi bi-chevron-left" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">ข้อมูลร้าน</h1>
          </div>

          {/* แจ้งบันทึกแล้ว */}
          {saved && (
            <div className="mb-4 flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-2xl">
              <i className="bi bi-check-circle-fill" />
              บันทึกเบอร์โทรแล้ว
            </div>
          )}

          {/* ===== เบอร์ติดต่อ (ร้านค้าแก้ได้) ===== */}
          <div className="flex items-center justify-between mb-2 ml-1">
            <p className="text-xs text-gray-500">ช่องทางติดต่อ</p>
            {!editing && (
              <button
                type="button"
                onClick={startEdit}
                className="flex items-center gap-1 text-xs font-semibold text-[#E0A537] px-2.5 py-1 rounded-full bg-[#FDF0DD]"
              >
                <i className="bi bi-pencil" />
                แก้ไข
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl p-5 mb-6">
            <div className="flex items-start gap-4">
              <IconBox icon="bi-telephone-fill" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">เบอร์โทรติดต่อ</p>
                {editing ? (
                  <div className="mt-1.5">
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={draft}
                      onChange={(e) => {
                        setDraft(e.target.value.replace(/\D/g, ""));
                        setError("");
                      }}
                      placeholder="0812345678"
                      className={`w-full bg-[#FAF4EC] rounded-xl px-3 py-2.5 text-[15px] text-gray-900 outline-none border ${
                        error ? "border-red-400" : "border-transparent focus:border-[#E0A537]"
                      }`}
                    />
                    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                  </div>
                ) : (
                  <p className="mt-0.5 text-[15px] font-semibold text-gray-900">
                    {formatPhone(phone)}
                  </p>
                )}
              </div>
            </div>

            {editing && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-white border border-gray-300 rounded-xl py-2.5 text-gray-800 active:scale-95 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={save}
                  className="bg-[#E0A537] text-white font-semibold rounded-xl py-2.5 border border-[#C88F25] active:scale-95 transition"
                >
                  บันทึก
                </button>
              </div>
            )}
          </div>

          {/* ===== บัญชีธนาคาร (ดูอย่างเดียว) ===== */}
          <div className="flex items-center justify-between mb-2 ml-1">
            <p className="text-xs text-gray-500">บัญชีรับเงิน (ใช้ตอนถอน TOKEN)</p>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <i className="bi bi-lock-fill" />
              ดูได้อย่างเดียว
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 space-y-4">
            <ReadOnlyRow icon="bi-bank2" label="ธนาคาร" value={BANK_ACCOUNT.bank} />
            <div className="border-t border-gray-100" />
            <ReadOnlyRow icon="bi-person-vcard" label="ชื่อบัญชี" value={BANK_ACCOUNT.accountName} />
            <div className="border-t border-gray-100" />
            <ReadOnlyRow
              icon="bi-credit-card-2-front"
              label="เลขบัญชี"
              value={maskAccount(BANK_ACCOUNT.accountNo)}
            />
          </div>

          {/* แจ้งว่าต้องติดต่อแอดมิน */}
          <div className="mt-3 flex items-start gap-2.5 bg-[#FDF0DD] rounded-2xl px-4 py-3">
            <i className="bi bi-info-circle-fill text-[#E0A537] mt-px" />
            <p className="text-xs text-gray-600 leading-relaxed">
              หากต้องการเปลี่ยนบัญชีรับเงิน กรุณาติดต่อผู้ดูแลระบบ
              <br />
              เพื่อความปลอดภัย ร้านค้าไม่สามารถแก้ไขบัญชีเองได้
            </p>
          </div>
        </div>

        {/* Bottom Navigation — 4 icons (เหมือนหน้า vendor อื่น) */}
        <nav className="bg-[#FAF4EC] px-6 py-4 flex items-center justify-around text-gray-900 border-t border-[#EADFCB]">
          <Link href="/vendor" aria-label="หน้าแรก" className="p-2 hover:text-[#E0A537] transition-colors">
            <i className="bi bi-house text-2xl" />
          </Link>
          <Link href="/vendor/scan" aria-label="สแกน / ขายสินค้า" className="p-2 hover:text-[#E0A537] transition-colors">
            <i className="bi bi-grid text-2xl" />
          </Link>
          <Link href="/vendor/history" aria-label="ประวัติรายการ" className="p-2 hover:text-[#E0A537] transition-colors">
            <i className="bi bi-list text-3xl" />
          </Link>
          <Link href="/vendor/account" aria-label="บัญชีร้านค้า" className="p-2 text-[#E0A537]">
            <i className="bi bi-person-fill text-2xl" />
          </Link>
        </nav>
      </div>
    </div>
  );
}

function IconBox({ icon }: { icon: string }) {
  return (
    <span className="w-9 h-9 shrink-0 rounded-xl bg-[#FDF0DD] flex items-center justify-center text-[#E0A537]">
      <i className={`bi ${icon}`} />
    </span>
  );
}

function ReadOnlyRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <IconBox icon={icon} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-0.5 text-[15px] font-semibold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}
