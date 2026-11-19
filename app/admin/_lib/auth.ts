/**
 * ระบบ session แอดมินแบบง่าย (client-side เท่านั้น ใช้ sessionStorage)
 * ไม่ใช่ auth จริงระดับโปรดักชัน — เหมาะสำหรับเดโม่ / prototyping
 */

const SESSION_KEY = 'next-admin:session';

export interface AdminSession {
  email: string;
  loggedInAt: string; // ISO string
}

const isBrowser = () => typeof window !== 'undefined';

export function getSession(): AdminSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
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
  } catch {
    /* ignore */
  }
}

export function isLoggedIn(): boolean {
  return getSession() !== null;
}
