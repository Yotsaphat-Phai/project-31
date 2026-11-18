// จำนวนบัตรที่ขายไปแล้ว (จำลองด้วย localStorage)
// บัตรคงเหลือ = ticketsLeft ใน mock.ts − จำนวนที่ขายไปแล้ว
// ภายหลังถ้ามี backend จริง เปลี่ยนแค่ไฟล์นี้

import { useSyncExternalStore } from "react";
import { events } from "./mock";
import { getCurrentUser } from "./auth";
import { addCustomer } from "../staff/_lib/mockUsers";

const MY_ORDERS_KEY = "p31-my-orders";
const PENDING_KEY = "p31-pending-participants"; // sessionStorage: ข้อมูลผู้เข้าร่วมระหว่างหน้า participants → payment

export type ParticipantInfo = { name: string; studentId: string; faculty: string; major: string; class: string; phone: string };

// บัตร 1 ใบ = ผู้เข้าร่วม 1 คน; code คือเลขตั๋วใน QR (staff สแกนแล้วค้นด้วยเลขนี้)
export type OrderTicket = { code: string } & ParticipantInfo;

export type Order = {
  orderId: string;
  eventId: string;
  userId: string;
  total: number;
  createdAt: string;
  tickets: OrderTicket[];
  slip?: string; // รูปสลิป (data URL ย่อขนาดแล้ว)
};

export function savePendingParticipants(list: ParticipantInfo[]) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(list));
  } catch {}
}

function takePendingParticipants(): ParticipantInfo[] {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    sessionStorage.removeItem(PENDING_KEY);
    if (raw) return JSON.parse(raw) as ParticipantInfo[];
  } catch {}
  return [];
}

const SOLD_KEY = "p31-tickets-sold";
const CHANGE_EVENT = "p31-tickets-sold-change";

function readSold(): Record<string, number> {
  try {
    const raw = localStorage.getItem(SOLD_KEY);
    if (raw) return JSON.parse(raw) as Record<string, number>;
  } catch {}
  return {};
}

export function getTicketsLeft(eventId: string): number {
  const ev = events.find((e) => e.id === eventId);
  if (!ev) return 0;
  return Math.max(0, ev.ticketsLeft - (readSold()[eventId] ?? 0));
}

// เรียกตอนชำระเงินสำเร็จ — ตัดบัตรคงเหลือ + ออกบัตร 1 ใบ/คน (QR แยกกัน) ; ซื้อเกินจำนวนที่เหลือจะ throw Error
export function recordPurchase(eventId: string, qty: number, total: number, slip?: string): Order {
  if (qty > getTicketsLeft(eventId)) throw new Error("บัตรคงเหลือไม่พอ");
  const sold = readSold();
  sold[eventId] = (sold[eventId] ?? 0) + qty;
  try {
    localStorage.setItem(SOLD_KEY, JSON.stringify(sold));
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));

  const me = getCurrentUser();
  const pending = takePendingParticipants();
  const blank: ParticipantInfo = { name: "", studentId: "", faculty: "", major: "", class: "", phone: "" };
  const tickets: OrderTicket[] = Array.from({ length: qty }, (_, i) => {
    const p = { ...blank, ...pending[i] };
    if (!p.name) p.name = i === 0 ? me?.name ?? "" : `ผู้เข้าร่วมคนที่ ${i + 1}`;
    const customer = addCustomer({ name: p.name, tickets: 1, batch: p.class || undefined });
    return { code: customer.id, ...p, name: customer.name };
  });

  const all = readAllOrders();
  const order: Order = {
    orderId: `ORD-${new Date().getFullYear()}-${String(all.length + 1).padStart(4, "0")}`,
    eventId,
    userId: me?.id ?? "",
    total,
    createdAt: new Date().toISOString(),
    tickets,
    slip,
  };
  try {
    localStorage.setItem(MY_ORDERS_KEY, JSON.stringify([order, ...all]));
  } catch {}
  return order;
}

function readAllOrders(): Order[] {
  try {
    const raw = localStorage.getItem(MY_ORDERS_KEY);
    if (raw) return JSON.parse(raw) as Order[];
  } catch {}
  return [];
}

// คำสั่งซื้อของ user ที่ login อยู่ (ใหม่สุดก่อน)
export function getMyOrders(): Order[] {
  const me = getCurrentUser();
  return readAllOrders().filter((o) => o.userId === (me?.id ?? ""));
}

function subscribe(cb: () => void) {
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener("storage", cb); // อัปเดตข้ามแท็บ
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

// บัตรคงเหลือแบบ live (ฝั่ง server ใช้ค่าตั้งต้นจาก mock)
export function useTicketsLeft(eventId: string): number {
  const initial = events.find((e) => e.id === eventId)?.ticketsLeft ?? 0;
  return useSyncExternalStore(subscribe, () => getTicketsLeft(eventId), () => initial);
}
