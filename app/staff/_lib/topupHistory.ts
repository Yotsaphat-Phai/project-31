"use client";

// บันทึกประวัติการเติม TOKEN ของ Staff
// เก็บใน localStorage เพื่อให้หน้า /staff/topup-history อ่านได้จริง

import { useCallback, useEffect, useState } from "react";

export type TopupRecord = {
  id: string;               // uid (timestamp-random)
  customerId: string;       // เลขตั๋ว เช่น "00428"
  customerName: string;
  customerInitials: string;
  customerKind: "VIP" | "ทั่วไป";
  amount: number;           // จำนวน TOKEN ที่เติม
  at: number;               // epoch ms
  staffName: string;        // ชื่อ Staff ที่เป็นผู้เติม
};

const KEY = "staff-topup-history-v1";

function load(): TopupRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as TopupRecord[];
  } catch {}
  return [];
}

function save(list: TopupRecord[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export function appendTopup(r: Omit<TopupRecord, "id" | "at">) {
  const rec: TopupRecord = {
    ...r,
    id: `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    at: Date.now(),
  };
  const list = load();
  list.unshift(rec); // ใหม่สุดอยู่บน
  save(list);
  return rec;
}

export function clearTopupHistory() {
  save([]);
}

export function useTopupHistory() {
  const [list, setList] = useState<TopupRecord[] | null>(null);

  useEffect(() => {
    setList(load());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setList(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const refresh = useCallback(() => setList(load()), []);
  const clear = useCallback(() => {
    clearTopupHistory();
    setList([]);
  }, []);

  return { list: list ?? [], loaded: list !== null, refresh, clear };
}
