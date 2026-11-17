// ระบบ login จำลองด้วย localStorage
// - บัญชีจาก mock.ts (ทุก role) อ่านจากไฟล์ตรงๆ ทุกครั้ง → แก้ mock.ts แล้วมีผลทันที
// - "p31-registered-users" : เก็บเฉพาะบัญชีที่สมัครเอง (role user เท่านั้น)
// - "p31-current-user"     : บัญชีที่ login อยู่ (ไม่เก็บรหัสผ่าน)
// role อื่น (staff / vendor / admin / head-admin) login ได้อย่างเดียว ไม่มีการสมัคร
// ภายหลังถ้ามี backend จริง เปลี่ยนแค่ไฟล์นี้ไฟล์เดียว

import { mockAccounts, ROLE_HOME, type Account, type Role } from "./mock";

const REGISTERED_KEY = "p31-registered-users";
const SESSION_KEY = "p31-current-user";

export type SessionUser = Omit<Account, "password">;

function readRegistered(): Account[] {
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    if (raw) return JSON.parse(raw) as Account[];
  } catch {}
  return [];
}

function writeRegistered(list: Account[]) {
  try {
    localStorage.setItem(REGISTERED_KEY, JSON.stringify(list));
  } catch {}
}

// ตัดรหัสผ่านออกก่อนเก็บเป็น session
function toSession(account: Account): SessionUser {
  const user: Partial<Account> = { ...account };
  delete user.password;
  return user as SessionUser;
}

function saveSession(user: SessionUser) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {}
}

// บัญชีทั้งหมด = mock (ทุก role) + คนที่สมัครเอง
export function getAccounts(): Account[] {
  return [...mockAccounts, ...readRegistered()];
}

// login ด้วยอีเมลหรือเบอร์โทร — ผิดจะ throw Error พร้อมข้อความภาษาไทย
export function login(emailOrPhone: string, password: string): SessionUser {
  const key = emailOrPhone.trim().toLowerCase();
  const account = getAccounts().find(
    (a) => a.email.toLowerCase() === key || (a.phone !== "" && a.phone === key)
  );
  if (!account || account.password !== password) {
    throw new Error("อีเมล/เบอร์โทร หรือรหัสผ่านไม่ถูกต้อง");
  }
  if (!account.active) {
    throw new Error("บัญชีนี้ถูกระงับ กรุณาติดต่อ Admin");
  }
  const user = toSession(account);
  saveSession(user);
  return user;
}

// สมัครสมาชิก → ได้ role "user" เสมอ, บันทึกลง localStorage แล้ว login ให้ทันที
export function register(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): SessionUser {
  const email = input.email.trim().toLowerCase();
  const phone = input.phone?.trim() ?? "";
  const all = getAccounts();
  if (all.some((a) => a.email.toLowerCase() === email)) {
    throw new Error("อีเมลนี้มีบัญชีอยู่แล้ว");
  }
  if (phone && all.some((a) => a.phone === phone)) {
    throw new Error("เบอร์โทรนี้มีบัญชีอยู่แล้ว");
  }
  const account: Account = {
    id: "U" + Date.now(),
    name: input.name.trim(),
    email,
    phone,
    password: input.password,
    role: "user",
    active: true,
    createdAt: new Date().toISOString(),
  };
  writeRegistered([...readRegistered(), account]);
  const user = toSession(account);
  saveSession(user);
  return user;
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

export function getCurrentUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function homeFor(role: Role): string {
  return ROLE_HOME[role];
}
