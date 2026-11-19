// ระบบ login จำลองด้วย localStorage
// - บัญชีจาก mock.ts (ทุก role) อ่านจากไฟล์ตรงๆ ทุกครั้ง → แก้ mock.ts แล้วมีผลทันที
// - "p31-registered-users" : เก็บเฉพาะบัญชีที่สมัครเอง (role user เท่านั้น)
// - "p31-current-user"     : บัญชีที่ login อยู่ (ไม่เก็บรหัสผ่าน)
// role อื่น (staff / vendor / admin / head-admin) login ได้อย่างเดียว ไม่มีการสมัคร
// ภายหลังถ้ามี backend จริง เปลี่ยนแค่ไฟล์นี้ไฟล์เดียว

import { logAudit, roleLabel } from "./audit";
import { mockAccounts, ROLE_HOME, type Account, type Role } from "./mock";

const REGISTERED_KEY = "p31-registered-users";
const SESSION_KEY = "p31-current-user";
const OVERRIDES_KEY = "p31-account-overrides"; // แก้ข้อมูล/รหัสผ่าน/สถานะของบัญชี mock (แก้ไฟล์ไม่ได้)
const CREATED_KEY = "p31-created-accounts"; // บัญชี admin/staff/vendor ที่ head-admin เพิ่มเอง
const TRASH_KEY = "p31-trash-accounts"; // id บัญชีที่ head-admin ย้ายไปถังขยะ
const PURGED_KEY = "p31-purged-accounts"; // id บัญชี mock ที่ head-admin ลบถาวร

type Overrides = Record<string, Partial<Pick<Account, "name" | "email" | "phone" | "password" | "active">>>;

function readList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T[];
  } catch {}
  return [];
}

function writeList<T>(key: string, list: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

function readOverrides(): Overrides {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    if (raw) return JSON.parse(raw) as Overrides;
  } catch {}
  return {};
}

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
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {}
}

// บัญชีทั้งหมด = mock (ทุก role) + คนที่สมัครเอง + บัญชีที่ head-admin เพิ่ม (ไม่รวมที่ลบถาวร)
export function getAccounts(): Account[] {
  const ov = readOverrides();
  const purged = readList<string>(PURGED_KEY);
  return [...mockAccounts, ...readRegistered(), ...readList<Account>(CREATED_KEY)]
    .filter((a) => !purged.includes(a.id))
    .map((a) => (ov[a.id] ? { ...a, ...ov[a.id] } : a));
}

// login ด้วยอีเมลหรือเบอร์โทร — ผิดจะ throw Error พร้อมข้อความภาษาไทย
// Admin / Head Admin เข้าที่หน้านี้ไม่ได้ ต้องเข้าที่ /admin/login (loginAdminArea)
export function login(emailOrPhone: string, password: string): SessionUser {
  return doLogin(emailOrPhone, password, false);
}

// ใช้ในหน้า /admin/login เท่านั้น — รับเฉพาะบัญชี admin และ head-admin
export function loginAdminArea(email: string, password: string): SessionUser {
  return doLogin(email, password, true);
}

function doLogin(emailOrPhone: string, password: string, adminArea: boolean): SessionUser {
  const key = emailOrPhone.trim().toLowerCase();
  const account = getAccounts().find(
    (a) => a.email.toLowerCase() === key || (a.phone !== "" && a.phone === key)
  );
  if (!account || account.password !== password) {
    throw new Error("อีเมล/เบอร์โทร หรือรหัสผ่านไม่ถูกต้อง");
  }
  const isAdminRole = account.role === "admin" || account.role === "head-admin";
  if (isAdminRole && !adminArea) {
    throw new Error("Admin / Head Admin กรุณาเข้าสู่ระบบที่หน้า Admin (/admin/login)");
  }
  if (!isAdminRole && adminArea) {
    throw new Error("บัญชีนี้ไม่ใช่ Admin หรือ Head Admin");
  }
  const blocked = !account.active || getTrashIds().includes(account.id);
  // บันทึกลง Audit Log ทั้งเข้าได้และถูกปฏิเสธ (บัญชีถูกระงับ)
  logAudit({
    kind: blocked ? "login_blocked" : "login",
    role: roleLabel(account.role),
    user: account.name,
    email: account.email,
    by: account.name,
  });
  if (blocked) {
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

// ออกจากระบบ → บันทึกลง Audit Log ด้วย (ถ้ามีคน login อยู่)
export function logout() {
  const user = getCurrentUser();
  if (user) {
    logAudit({ kind: "logout", role: roleLabel(user.role), user: user.name, email: user.email, by: user.name });
  }
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

export function getCurrentUser(): SessionUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function homeFor(role: Role): string {
  return ROLE_HOME[role];
}

// แก้ไขข้อมูลบัญชีที่ login อยู่ (ชื่อ / อีเมล / เบอร์โทร)
export function updateProfile(input: { name: string; email: string; phone: string }): SessionUser {
  const me = getCurrentUser();
  if (!me) throw new Error("กรุณาเข้าสู่ระบบใหม่");
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  if (!name || !email) throw new Error("กรุณากรอกชื่อและอีเมล");
  const others = getAccounts().filter((a) => a.id !== me.id);
  if (others.some((a) => a.email.toLowerCase() === email)) throw new Error("อีเมลนี้มีบัญชีอยู่แล้ว");
  if (phone && others.some((a) => a.phone === phone)) throw new Error("เบอร์โทรนี้มีบัญชีอยู่แล้ว");
  writeOverride(me.id, { name, email, phone });
  const user = { ...me, name, email, phone };
  saveSession(user);
  return user;
}

// เปลี่ยนรหัสผ่านของบัญชีที่ login อยู่
export function changePassword(current: string, next: string) {
  const me = getCurrentUser();
  if (!me) throw new Error("กรุณาเข้าสู่ระบบใหม่");
  const account = getAccounts().find((a) => a.id === me.id);
  if (!account || account.password !== current) throw new Error("รหัสผ่านปัจจุบันไม่ถูกต้อง");
  if (next.length < 6) throw new Error("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
  writeOverride(me.id, { password: next });
}

function writeOverride(id: string, patch: Overrides[string]) {
  const ov = readOverrides();
  ov[id] = { ...ov[id], ...patch };
  try {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(ov));
  } catch {}
}

// ===== ใช้ในหน้า head-admin (จัดการบัญชี) =====

// เปิด/ระงับบัญชี — ระงับแล้ว login ไม่ได้
export function setAccountActive(id: string, active: boolean) {
  writeOverride(id, { active });
}

export function getTrashIds(): string[] {
  return readList<string>(TRASH_KEY);
}

// ย้ายไปถังขยะ / กู้คืน — อยู่ในถังขยะ login ไม่ได้
export function setAccountTrashed(id: string, trashed: boolean) {
  const ids = getTrashIds().filter((x) => x !== id);
  writeList(TRASH_KEY, trashed ? [...ids, id] : ids);
}

// ลบถาวร — บัญชีที่เพิ่มเองลบออกจากรายการ, บัญชี mock ซ่อนไว้ (แก้ไฟล์ไม่ได้)
export function purgeAccount(id: string) {
  setAccountTrashed(id, false);
  const created = readList<Account>(CREATED_KEY);
  if (created.some((a) => a.id === id)) {
    writeList(CREATED_KEY, created.filter((a) => a.id !== id));
  } else {
    writeList(PURGED_KEY, [...readList<string>(PURGED_KEY), id]);
  }
}

// head-admin เพิ่มบัญชี admin / staff / vendor
export function createAccount(input: {
  name: string;
  email: string;
  password: string;
  role: "admin" | "staff" | "vendor";
}): Account {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (!name || !email) throw new Error("กรุณากรอกชื่อและอีเมล");
  if (input.password.length < 6) throw new Error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
  if (getAccounts().some((a) => a.email.toLowerCase() === email)) {
    throw new Error("อีเมลนี้มีบัญชีอยู่แล้ว");
  }
  const account: Account = {
    id: input.role[0].toUpperCase() + Date.now(),
    name,
    email,
    phone: "",
    password: input.password,
    role: input.role,
    active: true,
    createdAt: new Date().toISOString(),
  };
  writeList(CREATED_KEY, [...readList<Account>(CREATED_KEY), account]);
  return account;
}

// บัญชีที่ login อยู่ถูกระงับ / อยู่ในถังขยะ / ถูกลบถาวร หรือไม่ (ใช้เด้งออกทันที)
export function isCurrentUserBlocked(): boolean {
  const me = getCurrentUser();
  if (!me) return false;
  const account = getAccounts().find((a) => a.id === me.id);
  return !account || !account.active || getTrashIds().includes(me.id);
}