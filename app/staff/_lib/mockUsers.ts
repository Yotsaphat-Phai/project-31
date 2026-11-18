"use client";

// แหล่งข้อมูลจำลองเพียงที่เดียวของส่วน Staff
// ทั้งหน้าแรก, หน้าผู้เข้าร่วม, หน้าสแกน, หน้าค้นหา, หน้าเติม TOKEN ใช้ข้อมูลชุดเดียวกันหมด
// ภายหลังเปลี่ยนเป็นเรียก API ของระบบแอดมินในไฟล์นี้ไฟล์เดียว

import { useCallback, useEffect, useState } from "react";

export type AttendeeKind = "VIP" | "ทั่วไป";

export type Customer = {
  id: string;             // เลขตั๋ว เช่น "00428" ใช้เป็น ID หลักในการสแกน/ค้นหา
  initials: string;       // ตัวย่อสองตัวอักษรไทย สำหรับวงกลม avatar
  name: string;           // ชื่อ-นามสกุล
  kind: AttendeeKind;     // ประเภทตั๋ว
  batch: string;          // รุ่น เช่น "20XX"
  table?: string;         // โต๊ะ สำหรับ VIP
  extra?: number;         // ผู้ติดตาม เช่น +1
  tickets: number;
  token: number;
  pending: number;        // TOKEN ที่ Staff เติมแล้ว รอแอดมินอนุมัติ
  checkedIn: boolean;
  checkedInAt?: string;   // เวลาเช็คอินในรูป "14:58"
};

const STORAGE_KEY = "staff-customers-v2";

const seed: Customer[] = [
  { id: "00428", initials: "นภ", name: "นภา สุวรรณ",   kind: "VIP",   batch: "20XX", table: "14", tickets: 1, token: 500, pending: 0, checkedIn: true,  checkedInAt: "14:58" },
  { id: "00427", initials: "ธก", name: "ธนพร วิรัล",   kind: "ทั่วไป", batch: "20XX",             tickets: 1, token: 300, pending: 0, checkedIn: true,  checkedInAt: "14:56" },
  { id: "00426", initials: "สม", name: "สมชาย ใจดี",   kind: "ทั่วไป", batch: "20XX",             tickets: 2, token: 1000, pending: 0, checkedIn: false },
  { id: "00425", initials: "มน", name: "มนัส สมบูรณ์", kind: "VIP",   batch: "19XX", table: "8",  tickets: 1, token: 700, pending: 0, checkedIn: false },
  { id: "00424", initials: "อน", name: "อนันต์ วงศ์",  kind: "ทั่วไป", batch: "21XX",             tickets: 1, token: 150, pending: 0, checkedIn: true,  checkedInAt: "14:50" },
  { id: "00423", initials: "ปร", name: "ปริม จันทรา",  kind: "VIP",   batch: "20XX", table: "3",  extra: 1, tickets: 2, token: 800, pending: 0, checkedIn: true, checkedInAt: "14:48" },
  { id: "00422", initials: "วร", name: "วรา พงษ์",     kind: "ทั่วไป", batch: "20XX",             tickets: 1, token: 250, pending: 0, checkedIn: true,  checkedInAt: "14:45" },
  { id: "00421", initials: "กม", name: "กมล รัตน์",    kind: "ทั่วไป", batch: "22XX",             tickets: 1, token: 0,   pending: 0, checkedIn: false },
];

// ข้อมูลอีเวนต์ (เปลี่ยนแปลงโดย Admin — Staff อ่านอย่างเดียว)
// ไม่จำกัดจำนวนคน — ไม่มีฟิลด์ total อีกต่อไป ยอดทั้งหมดนับจากผู้ลงทะเบียนจริง
export const event = {
  name: "Reunion Class of 20XX",
  venue: "Impact Arena, เมืองทองธานี",
  dateLabel: "16 พ.ย.",
  timeLabel: "15:00-22:00",
  shift: "ประรุ่น 2",
  onDuty: true,
};

// ข้อมูลโปรไฟล์ Staff ที่ล็อกอินอยู่ (เปลี่ยนแปลงโดยระบบแอดมิน)
export const staffProfile = {
  initials: "ลท",
  name: "ลลิตภัทร กันทา",
  role: "Staff — ประจำจุดเช็คอิน",
  employeeId: "ST-00142",
  phone: "093-913-4715",
  email: "stafflemon@test.com",
  shift: "15:00-22:00",
};

// สีพื้นของวงกลมตัวย่อ สลับให้ไม่ซ้ำกัน
export const avatarPalette = [
  "bg-[#f3a9a0]",
  "bg-[#9ec9a7]",
  "bg-[#e8b96a]",
  "bg-[#c9a3d8]",
  "bg-[#2f4a4e]",
  "bg-[#e9a179]",
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
    (id: string) => {
      const needle = id.trim().toUpperCase().replace(/^#/, "");
      return list?.find((c) => c.id.toUpperCase() === needle) ?? null;
    },
    [list]
  );

  const checkIn = useCallback(
    (id: string) =>
      update((l) =>
        l.map((c) =>
          c.id === id
            ? {
                ...c,
                checkedIn: true,
                checkedInAt:
                  c.checkedInAt ??
                  new Date().toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }),
              }
            : c
        )
      ),
    [update]
  );

  const addPending = useCallback(
    (id: string, amount: number) =>
      update((l) =>
        l.map((c) => (c.id === id ? { ...c, pending: c.pending + amount } : c))
      ),
    [update]
  );

  return { list: list ?? [], loaded: list !== null, find, checkIn, addPending };
}
