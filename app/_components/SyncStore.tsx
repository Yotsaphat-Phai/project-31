"use client";

// ซิงก์ localStorage กับที่เก็บกลาง /api/store → user ซื้อบนเครื่องหนึ่ง staff/ร้านค้าสแกนจากอีกเครื่องได้
// - โค้ดหน้าอื่นใช้ localStorage เหมือนเดิม ไม่ต้องแก้
// - ตอนเปิดเว็บ: ดึงข้อมูลกลางมาใส่ localStorage ก่อนแสดงหน้า
// - ทุกครั้งที่เขียน localStorage: ส่งไปที่เก็บกลางด้วย
// - ทุก 3 วินาที: ดึงข้อมูลล่าสุดจากเครื่องอื่น
// session (ใครล็อกอินอยู่) ไม่ซิงก์ — แต่ละเครื่องล็อกอินคนละบัญชีได้

import { useEffect, useState, type ReactNode } from "react";

const NO_SYNC = new Set(["p31-current-user", "staff-auth-v1"]);
const shouldSync = (key: string) => !NO_SYNC.has(key) && !key.startsWith("staff-notif-prefs");

let installed = false;
let rawSet: (k: string, v: string) => void;

function push(key: string, value: string | null) {
  fetch("/api/store", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  }).catch(() => {});
}

// ครอบ setItem/removeItem ให้ส่งค่าขึ้นที่เก็บกลางด้วย
function install() {
  if (installed) return;
  installed = true;
  // ต้องแก้ที่ Storage.prototype — ถ้า assign ที่ localStorage ตรง ๆ จะกลายเป็นการเก็บ key ชื่อ "setItem"
  const origSet = Storage.prototype.setItem;
  const origRemove = Storage.prototype.removeItem;
  rawSet = (k, v) => origSet.call(localStorage, k, v);
  Storage.prototype.setItem = function (k: string, v: string) {
    origSet.call(this, k, v);
    if (this === localStorage && shouldSync(k)) push(k, v);
  };
  Storage.prototype.removeItem = function (k: string) {
    origRemove.call(this, k);
    if (this === localStorage && shouldSync(k)) push(k, null);
  };
}

// ดึงข้อมูลกลาง: key ที่ที่เก็บกลางมี → ใช้ค่ากลาง ; key ที่มีแค่เครื่องนี้ → ส่งขึ้นไป (ครั้งแรก)
async function pull(first: boolean) {
  const res = await fetch("/api/store", { cache: "no-store" });
  const remote = (await res.json()) as Record<string, string>;
  for (const [k, v] of Object.entries(remote)) {
    if (shouldSync(k) && localStorage.getItem(k) !== v) rawSet(k, v);
  }
  if (first) {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (shouldSync(k) && !(k in remote)) push(k, localStorage.getItem(k)!);
    }
  }
}

export default function SyncStore({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    install();
    let alive = true;
    const done = () => alive && setReady(true);
    const fallback = setTimeout(done, 2000); // ที่เก็บกลางไม่ตอบ → แสดงหน้าด้วยข้อมูลในเครื่อง
    pull(true).catch(() => {}).finally(() => {
      clearTimeout(fallback);
      done();
    });
    const timer = setInterval(() => pull(false).catch(() => {}), 3000);
    return () => {
      alive = false;
      clearTimeout(fallback);
      clearInterval(timer);
    };
  }, []);

  return ready ? <>{children}</> : null;
}
