/**
 * ระบบ session แอดมินแบบง่าย (client-side เท่านั้น ใช้ sessionStorage)
 * ไม่ใช่ auth จริงระดับโปรดักชัน — เหมาะสำหรับเดโม่ / prototyping
 */

import { logout } from '../../_lib/auth';

const SESSION_KEY = 'next-admin:session';
const MAIN_SESSION_KEY = 'p31-current-user'; // session ของหน้า login หลัก (/)
const ADMIN_ROLES = ['admin']; // head-admin มีหน้าหลักแยกที่ /head-admin

export interface AdminSession {
  email: string;
  loggedInAt: string; // ISO string
}

const isBrowser = () => typeof window !== 'undefined';

export function getSession(): AdminSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as AdminSession;
    // login จากหน้าหลัก (/) ด้วยบัญชี admin → เข้าส่วน admin ได้เลย
    const main = sessionStorage.getItem(MAIN_SESSION_KEY);
    if (!main) return null;
    const u = JSON.parse(main) as { email: string; role: string };
    return ADMIN_ROLES.includes(u.role) ? { email: u.email, loggedInAt: new Date().toISOString() } : null;
  } catch {
    return null;
  }
}

export function setSession(email: string): AdminSession {
  const s: AdminSession = { email, loggedInAt: new Date().toISOString() };
  if (isBrowser()) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    } catch {
      /* โหมดส่วนตัว → ข้าม */
    }
  }
  return s;
}

export function clearSession() {
  if (!isBrowser()) return;
  try {
    sessionStorage.removeItem(SESSION_KEY);
    logout(); // ออกจากระบบหลักด้วย + บันทึก Audit Log
  } catch {
    /* ignore */
  }
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}