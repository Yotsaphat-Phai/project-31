// Audit Log จริง — บันทึกทุกครั้งที่ head-admin เพิ่ม / ระงับ / เปิด / ลบ / กู้คืนบัญชี
// + บันทึกการเข้าสู่ระบบ / ออกจากระบบของทุกบัญชี (auth.ts → login / logout)
// เก็บใน localStorage key "p31-audit-log" (SyncStore ซิงก์ให้ทุกเครื่องเห็นเหมือนกัน)

export type AuditKind =
  | "add"
  | "suspend"
  | "unsuspend"
  | "trash"
  | "restore"
  | "purge"
  | "login"
  | "login_blocked"
  | "logout";

export type AuditEntry = {
  id: string;
  kind: AuditKind;
  role: string; // Admin / Staff / Vendor / User / Head Admin
  user: string; // ชื่อบัญชีที่ถูกจัดการ
  email: string;
  by: string; // ชื่อคนที่ทำ
  at: number; // เวลา (ms)
};

export const AUDIT_KEY = "p31-audit-log";

// role ในระบบ → ชื่อที่แสดง
export function roleLabel(role: string): string {
  const map: Record<string, string> = {
    user: "User",
    staff: "Staff",
    vendor: "Vendor",
    admin: "Admin",
    "head-admin": "Head Admin",
  };
  return map[role] ?? role;
}

// ชื่อคนที่ login อยู่ (อ่านตรงจาก session — ไม่ import auth.ts เพื่อไม่ให้ import วนกัน)
function currentUserName(): string {
  try {
    const raw = sessionStorage.getItem("p31-current-user");
    return raw ? (JSON.parse(raw) as { name: string }).name : "Head Admin";
  } catch {
    return "Head Admin";
  }
}

export function parseAuditLog(raw: string | null): AuditEntry[] {
  try {
    return raw ? (JSON.parse(raw) as AuditEntry[]) : [];
  } catch {
    return [];
  }
}

// by ไม่ส่งมา → ใช้ชื่อคนที่ login อยู่
export function logAudit(entry: Omit<AuditEntry, "id" | "by" | "at"> & { by?: string }) {
  try {
    const list = parseAuditLog(localStorage.getItem(AUDIT_KEY));
    const at = Date.now();
    const item: AuditEntry = {
      ...entry,
      id: String(at) + Math.random().toString(36).slice(2, 6),
      by: entry.by ?? currentUserName(),
      at,
    };
    localStorage.setItem(AUDIT_KEY, JSON.stringify([item, ...list].slice(0, 200)));
  } catch {}
}