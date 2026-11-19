"use client";

// รายการขายของร้านค้า: ร้านสแกน QR ของ user → ตัด TOKEN → บันทึกรายการไว้ที่นี่
// หน้าแรก vendor และหน้าประวัติ vendor อ่านจาก key นี้

import { chargeToken } from "../staff/_lib/mockUsers";

const KEY = "p31-vendor-tx";

export type VendorTx = {
  id: string;           // เช่น T0001
  shopCode: string;     // รหัสร้าน เช่น VCK001
  customerId: string;   // เลข QR ของ user
  customerName: string;
  amount: number;
  at: string;           // ISO time
};

function loadAll(): VendorTx[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

// รายการของร้านนี้ (ใหม่สุดก่อน)
export function getShopTx(shopCode: string): VendorTx[] {
  return loadAll().filter((t) => t.shopCode === shopCode);
}

// ตัด TOKEN + บันทึกรายการ — คืน error ถ้าไม่สำเร็จ
export function payAtShop(shop: { code: string; name: string }, qr: string, amount: number) {
  const res = chargeToken(qr, amount, `ชำระที่${shop.name}`);
  if (!res.ok) return res;
  const all = loadAll();
  const tx: VendorTx = {
    id: `T${String(all.length + 1).padStart(4, "0")}`,
    shopCode: shop.code,
    customerId: res.customer.id,
    customerName: res.customer.name,
    amount,
    at: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([tx, ...all]));
  return { ok: true as const, tx, balance: res.customer.token };
}

export const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false });

export const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });

export const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();
