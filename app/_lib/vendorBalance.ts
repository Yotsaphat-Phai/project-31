// ยอด TOKEN คงเหลือของร้าน = ยอดขายทั้งหมดที่บันทึกไว้ (vendorTx)
// เริ่มจาก 0 แล้วเพิ่มตามยอดขายจริง — ใช้ฟังก์ชันนี้ทุกหน้าที่แสดงยอดคงเหลือ ตัวเลขจะได้ตรงกัน
// เรียกเฉพาะฝั่ง browser (หลัง mount) เพราะ getShopTx อ่านข้อมูลจากเครื่อง

import type { Shop } from "./mock";
import { getShopTx } from "./vendorTx";

export function getShopBalance(shop: Shop): number {
  return getShopTx(shop.code).reduce((sum, t) => sum + t.amount, 0);
}
