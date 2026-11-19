"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { getAccounts, getTrashIds } from "../../_lib/auth";
import { AUDIT_KEY, parseAuditLog, type AuditKind } from "../../_lib/audit";

// รายงานของ Head Admin: บัญชีและความปลอดภัย (ข้อมูลจริง อัปเดตเองทุก 2 วินาที)
// ส่วนยอดขาย / TOKEN อยู่ในหน้า Dashboard ของ Admin
const WATCH_KEYS = [
  AUDIT_KEY,
  "p31-account-overrides",
  "p31-created-accounts",
  "p31-trash-accounts",
  "p31-purged-accounts",
];

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 2000);
  window.addEventListener("storage", onChange);
  return () => {
    clearInterval(timer);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot() {
  return [new Date().toDateString(), ...WATCH_KEYS.map((k) => localStorage.getItem(k) ?? "")].join("\u0001");
}

const RECENT_STYLE: Partial<Record<AuditKind, { label: string; icon: string; color: string }>> = {
  add: { label: "เพิ่มบัญชี", icon: "bi-plus-lg", color: "bg-[#2D9D8F]" },
  suspend: { label: "ระงับบัญชี", icon: "bi-slash-circle", color: "bg-gray-400" },
  unsuspend: { label: "เปิดใช้งานบัญชี", icon: "bi-check-lg", color: "bg-[#2D9D8F]" },
  trash: { label: "ย้ายไปถังขยะ บัญชี", icon: "bi-trash", color: "bg-red-400" },
  restore: { label: "กู้คืนบัญชี", icon: "bi-arrow-counterclockwise", color: "bg-blue-500" },
  purge: { label: "ลบถาวร บัญชี", icon: "bi-x-lg", color: "bg-red-600" },
};

const dayKey = (d: Date) => d.toDateString();
const timeOf = (at: number) =>
  new Date(at).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

export default function ReportPage() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, () => "");
  if (!snap) return null;

  const parts = snap.split("\u0001");
  const today = parts[0];
  const audit = parseAuditLog(parts[1]);

  // ===== บัญชี =====
  const trash = getTrashIds();
  const live = getAccounts().filter(
    (a) => ["admin", "staff", "vendor"].includes(a.role) && !trash.includes(a.id)
  );
  const countRole = (r: string) => live.filter((a) => a.role === r).length;
  const suspended = live.filter((a) => !a.active).length;

  // ===== การเข้าสู่ระบบ =====
  const loginsToday = audit.filter((e) => e.kind === "login" && dayKey(new Date(e.at)) === today).length;
  const blockedToday = audit.filter((e) => e.kind === "login_blocked" && dayKey(new Date(e.at)) === today).length;

  const todayDate = new Date(today);
  const perDay = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - (6 - i));
    const logs = audit.filter((e) => dayKey(new Date(e.at)) === dayKey(d));
    return {
      label: i === 6 ? "วันนี้" : d.toLocaleDateString("th-TH", { day: "numeric", month: "short" }),
      isToday: i === 6,
      ok: logs.filter((e) => e.kind === "login").length,
      blocked: logs.filter((e) => e.kind === "login_blocked").length,
    };
  });
  const maxDay = Math.max(1, ...perDay.map((d) => Math.max(d.ok, d.blocked)));

  // ===== การเปลี่ยนแปลงล่าสุด (ไม่รวมการเข้าสู่ระบบ) =====
  const recent = audit.filter((e) => RECENT_STYLE[e.kind]).slice(0, 3);

  return (
    <div className="h-screen w-screen bg-[#FDF5EC] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-gray-800">รายงาน</h1>
            <span className="bg-[#9E4B8E] text-white text-xs font-semibold px-3 py-1 rounded-full">
              Head Admin
            </span>
          </div>

          {/* บัญชีในระบบ */}
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-3">บัญชีในระบบ</h2>
            <div className="grid grid-cols-3 gap-2 mb-3 text-center">
              <div className="rounded-xl bg-blue-50 py-2">
                <p className="text-lg font-bold text-blue-600">{countRole("admin")}</p>
                <p className="text-[11px] text-gray-600">Admin</p>
              </div>
              <div className="rounded-xl bg-teal-50 py-2">
                <p className="text-lg font-bold text-teal-700">{countRole("staff")}</p>
                <p className="text-[11px] text-gray-600">Staff</p>
              </div>
              <div className="rounded-xl bg-orange-50 py-2">
                <p className="text-lg font-bold text-orange-500">{countRole("vendor")}</p>
                <p className="text-[11px] text-gray-600">Vendor</p>
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>ถูกระงับ</span>
                <span className="font-semibold">{suspended}</span>
              </div>
              <div className="flex justify-between">
                <span>อยู่ในถังขยะ</span>
                <span className="font-semibold">{trash.length}</span>
              </div>
            </div>
          </div>

          {/* การเข้าสู่ระบบ */}
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-3">การเข้าสู่ระบบ</h2>
            <div className="space-y-1.5 text-sm text-gray-700 mb-3">
              <div className="flex justify-between">
                <span>เข้าสู่ระบบวันนี้</span>
                <span className="font-semibold">{loginsToday} ครั้ง</span>
              </div>
              <div className="flex justify-between">
                <span>ถูกปฏิเสธวันนี้</span>
                <span className="font-semibold text-orange-500">{blockedToday} ครั้ง</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-2">7 วันล่าสุด</p>
            <div className="flex items-end justify-between gap-1">
              {perDay.map((d, i) => (
                <div
                  key={i}
                  className={`flex-1 flex flex-col items-center rounded-lg py-1 ${d.isToday ? "bg-[#F5EAFE]" : ""}`}
                >
                  <div className="flex items-end justify-center gap-1 h-24 w-full">
                    {/* เข้าได้ (ม่วง) */}
                    <div className="flex flex-col items-center justify-end h-full">
                      {d.ok > 0 && <span className="text-[11px] font-semibold text-[#9E4B8E] mb-0.5">{d.ok}</span>}
                      <div
                        className="w-3 rounded-t bg-[#C58BBA]"
                        style={{ height: `${(d.ok / maxDay) * 72}px`, minHeight: d.ok ? 4 : 0 }}
                      />
                    </div>
                    {/* ถูกปฏิเสธ (ส้ม) — แสดงเฉพาะวันที่มี แท่งจะได้อยู่กลาง */}
                    {d.blocked > 0 && (
                      <div className="flex flex-col items-center justify-end h-full">
                        <span className="text-[11px] font-semibold text-orange-500 mb-0.5">{d.blocked}</span>
                        <div
                          className="w-3 rounded-t bg-orange-300"
                          style={{ height: `${(d.blocked / maxDay) * 72}px`, minHeight: 4 }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-full border-t border-gray-200" />
                  <span
                    className={`text-[10px] mt-1 ${d.isToday ? "font-semibold text-[#9E4B8E]" : "text-gray-500"}`}
                  >
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-3 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#C58BBA]" /> เข้าได้
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-orange-300" /> ถูกปฏิเสธ
              </span>
            </div>
          </div>

          {/* การเปลี่ยนแปลงล่าสุด */}
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-3">การเปลี่ยนแปลงล่าสุด</h2>
            {recent.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-2">ยังไม่มีการเปลี่ยนแปลง</p>
            ) : (
              <div className="space-y-2">
                {recent.map((e) => {
                  const s = RECENT_STYLE[e.kind]!;
                  return (
                    <div key={e.id} className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 rounded-full ${s.color} text-white flex items-center justify-center flex-shrink-0`}
                      >
                        <i className={`bi ${s.icon}`} />
                      </span>
                      <p className="flex-1 min-w-0 text-sm text-gray-700 truncate">
                        {s.label} {e.role} · {e.user}
                      </p>
                      <span className="text-[11px] text-gray-500 flex-shrink-0">{timeOf(e.at)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/head-admin/audit"
            className="block text-center w-full bg-white border-2 border-[#9E4B8E] text-[#9E4B8E] text-sm font-semibold py-3.5 rounded-xl active:scale-95 transition"
          >
            ดู Audit Log ทั้งหมด
          </Link>
        </div>
      </div>

      <nav className="bg-white border-t border-gray-200 px-2 py-2 flex items-center justify-around">
        <Link href="/head-admin/report" className="flex flex-col items-center text-[#9E4B8E] py-1">
          <i className="bi bi-bar-chart-fill text-2xl leading-none" />
          <span className="text-[10px] mt-0.5 font-semibold">รายงาน</span>
        </Link>
        <Link href="/head-admin" className="flex flex-col items-center text-gray-400 py-1">
          <i className="bi bi-people-fill text-2xl leading-none" />
          <span className="text-[10px] mt-0.5">บัญชี</span>
        </Link>
        <Link href="/head-admin/audit" className="flex flex-col items-center text-gray-400 py-1">
          <i className="bi bi-journal-text text-2xl leading-none" />
          <span className="text-[10px] mt-0.5">Audit Log</span>
        </Link>
      </nav>
    </div>
  );
}