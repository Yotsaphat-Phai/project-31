// ยอด TOKEN คงเหลือของร้าน = ยอดขายทั้งหมด (vendorTx) − คำขอถอนที่แอดมิน "อนุมัติแล้ว"
// ใช้ฟังก์ชันนี้ทุกหน้าที่แสดงยอดคงเหลือ ตัวเลขจะได้ตรงกัน
// เรียกเฉพาะฝั่ง browser (หลัง mount) เพราะอ่านข้อมูลจาก localStorage
//
// คำขอถอนเก็บที่ key กลาง eventhub:withdrawals — หน้า /admin/withdrawals อ่าน/อนุมัติจาก key เดียวกัน

import type { Shop } from "./mock";
import { getShopTx } from "./vendorTx";
import { readShared, writeShared, SHARED_WITHDRAW_KEY } from "../admin/_lib/sharedStorage";
import type { WithdrawRequest } from "../admin/_lib/types";

function allWithdrawals(): WithdrawRequest[] {
  const list = readShared<WithdrawRequest[] | null>(SHARED_WITHDRAW_KEY, null);
  return Array.isArray(list) ? list : [];
}

// คำขอถอนของร้านนี้ (ผูกด้วยรหัสร้าน เช่น VCK001)
export function getShopWithdrawals(shop: Shop): WithdrawRequest[] {
  return allWithdrawals().filter((w) => w.storeId === shop.code);
}

const sumBy = (list: WithdrawRequest[], status: WithdrawRequest["status"]) =>
  list.filter((w) => w.status === status).reduce((sum, w) => sum + w.amount, 0);

// ยอดคงเหลือ: ตัดเฉพาะที่แอดมินอนุมัติแล้ว
export function getShopBalance(shop: Shop): number {
  const sales = getShopTx(shop.code).reduce((sum, t) => sum + t.amount, 0);
  return sales - sumBy(getShopWithdrawals(shop), "approved");
}

// ยอดที่ขอถอนไว้แล้ว รอแอดมินอนุมัติ — กันขอถอนซ้ำเกินยอดที่มี
export function getShopPendingWithdraw(shop: Shop): number {
  return sumBy(getShopWithdrawals(shop), "pending");
}

// ร้านส่งคำขอถอน → ไปโผล่ที่หน้าคำขอถอนของแอดมิน (สถานะ pending)
export function requestWithdraw(input: {
  id: string;
  shop: Shop;
  owner: string;
  amount: number;
  bank: string;
  accountNo: string;
  accountName: string;
}): WithdrawRequest {
  const now = new Date();
  const req: WithdrawRequest = {
    id: input.id,
    storeId: input.shop.code,
    storeName: input.shop.name,
    owner: input.owner,
    amount: input.amount,
    bank: input.bank,
    accountNo: input.accountNo,
    accountName: input.accountName,
    requestedAt: `วันนี้ ${now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false })} น.`,
    status: "pending",
  };
  writeShared(SHARED_WITHDRAW_KEY, [req, ...allWithdrawals()]);
  return req;
}
