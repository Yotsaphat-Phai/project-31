"use client";

// ข้อมูลจำลอง เก็บใน localStorage — ภายหลังเปลี่ยนเป็นเรียก API ของระบบแอดมินในไฟล์นี้ไฟล์เดียว

import { useCallback, useEffect, useState } from "react";

export type Customer = {
  id: string;
  name: string;
  batch: string;
  tickets: number;
  token: number;
  pending: number; // TOKEN ที่ Staff เติมแล้ว รอแอดมินอนุมัติ
  checkedIn: boolean;
};

const STORAGE_KEY = "staff-customers-v1";

const seed: Customer[] = [
  { id: "A0101", name: "มาลี งามตา", batch: "20XX", tickets: 1, token: 350, pending: 0, checkedIn: true },
  { id: "A0102", name: "อนุชา เก่งกล้า", batch: "20XX", tickets: 2, token: 700, pending: 0, checkedIn: true },
  { id: "A0103", name: "กิตติ สุดสวย", batch: "19XX", tickets: 1, token: 120, pending: 0, checkedIn: false },
  { id: "A0104", name: "รัตนา ใจงาม", batch: "21XX", tickets: 2, token: 0, pending: 0, checkedIn: false },
  { id: "A0105", name: "พิชัย ทองดี", batch: "20XX", tickets: 1, token: 500, pending: 0, checkedIn: true },
  { id: "A0123", name: "สมชาย ใจดี", batch: "20XX", tickets: 2, token: 1000, pending: 0, checkedIn: true },
  { id: "A0106", name: "นภา สุขใจ", batch: "20XX", tickets: 1, token: 300, pending: 0, checkedIn: false },
];

function load(): Customer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Customer[];
  } catch {}
  return seed;
}

function save(list: Customer[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export function useCustomers() {
  const [list, setList] = useState<Customer[] | null>(null);

  useEffect(() => {
    setList(load());
  }, []);

  const update = useCallback((fn: (prev: Customer[]) => Customer[]) => {
    setList((prev) => {
      const next = fn(prev ?? load());
      save(next);
      return next;
    });
  }, []);

  const find = useCallback(
    (id: string) => list?.find((c) => c.id === id.trim().toUpperCase()) ?? null,
    [list]
  );

  const checkIn = useCallback(
    (id: string) => update((l) => l.map((c) => (c.id === id ? { ...c, checkedIn: true } : c))),
    [update]
  );

  const addPending = useCallback(
    (id: string, amount: number) =>
      update((l) => l.map((c) => (c.id === id ? { ...c, pending: c.pending + amount } : c))),
    [update]
  );

  return { list: list ?? [], loaded: list !== null, find, checkIn, addPending };
}
