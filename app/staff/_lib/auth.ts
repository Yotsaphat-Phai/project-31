"use client";

// ระบบล็อกอินแบบ mock (เก็บใน localStorage)
// ภายหลังเปลี่ยนเป็นเรียก API จริงในไฟล์นี้ไฟล์เดียว

import { useCallback, useEffect, useState } from "react";

const AUTH_KEY = "staff-auth-v1";
const USERS_KEY = "staff-users-v1";
const MAIN_SESSION_KEY = "p31-current-user"; // session ของหน้า login หลัก (/)

export type Account = {
  id: string;            // uuid-lite
  email: string;         // อีเมลหรือเบอร์มือถือ (ใช้เป็น username)
  password: string;      // เก็บแบบ plaintext ใน mock เท่านั้น
  name: string;
  createdAt: number;
};

export type Session = {
  id: string;
  email: string;
  name: string;
  loginAt: number;
};

// บัญชีตัวอย่าง — ใช้ล็อกอินได้ทันที
const seedAccounts: Account[] = [
  {
    id: "u-staff-001",
    email: "staff@test.com",
    password: "123456",
    name: "ลลิตภัทร กันทา",
    createdAt: 0,
  },
  {
    id: "u-staff-002",
    email: "0939134715",
    password: "123456",
    name: "ลลิตภัทร กันทา",
    createdAt: 0,
  },
];

function loadUsers(): Account[] {
  if (typeof window === "undefined") return seedAccounts;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Account[];
      // merge seed accounts ถ้าถูกลบไปโดยไม่ตั้งใจ
      const ids = new Set(parsed.map((u) => u.email.toLowerCase()));
      const merged = [...parsed];
      for (const s of seedAccounts) {
        if (!ids.has(s.email.toLowerCase())) merged.push(s);
      }
      return merged;
    }
  } catch {}
  return seedAccounts;
}

function saveUsers(list: Account[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  } catch {}
}

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw) as Session;
    // login จากหน้าหลัก (/) ด้วยบัญชี role staff → ถือว่าเข้าระบบ staff แล้ว
    const main = localStorage.getItem(MAIN_SESSION_KEY);
    if (!main) return null;
    const u = JSON.parse(main) as { id: string; email: string; name: string; role: string };
    if (u.role !== "staff") return null;
    return { id: u.id, email: u.email, name: u.name, loginAt: Date.now() };
  } catch {
    return null;
  }
}

export function saveSession(s: Session | null) {
  try {
    if (s) localStorage.setItem(AUTH_KEY, JSON.stringify(s));
    else localStorage.removeItem(AUTH_KEY);
  } catch {}
}

function normalizeId(v: string) {
  return v.trim().toLowerCase();
}

export function signIn(emailOrPhone: string, password: string): Session {
  const users = loadUsers();
  const needle = normalizeId(emailOrPhone);
  const u = users.find((x) => normalizeId(x.email) === needle);
  if (!u) throw new Error("ไม่พบบัญชีนี้ในระบบ");
  if (u.password !== password) throw new Error("รหัสผ่านไม่ถูกต้อง");
  const s: Session = { id: u.id, email: u.email, name: u.name, loginAt: Date.now() };
  saveSession(s);
  return s;
}

export function signUp(input: {
  name: string;
  emailOrPhone: string;
  password: string;
}): Session {
  const users = loadUsers();
  const needle = normalizeId(input.emailOrPhone);
  if (users.some((x) => normalizeId(x.email) === needle)) {
    throw new Error("อีเมล/เบอร์นี้ถูกใช้แล้ว");
  }
  const u: Account = {
    id: `u-${Date.now().toString(36)}`,
    email: input.emailOrPhone.trim(),
    password: input.password,
    name: input.name.trim() || "ผู้ใช้ใหม่",
    createdAt: Date.now(),
  };
  saveUsers([u, ...users]);
  const s: Session = { id: u.id, email: u.email, name: u.name, loginAt: Date.now() };
  saveSession(s);
  return s;
}

export function signOut() {
  saveSession(null);
  try {
    localStorage.removeItem(MAIN_SESSION_KEY); // ออกจากระบบหลักด้วย
  } catch {}
}

// Hook สำหรับหน้าที่ต้องรู้สถานะล็อกอิน
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === AUTH_KEY) setSession(loadSession());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const refresh = useCallback(() => setSession(loadSession()), []);
  return { session, ready, refresh };
}
