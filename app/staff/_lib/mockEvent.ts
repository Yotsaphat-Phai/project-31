"use client";

// ไฟล์นี้เหลือไว้เพื่อรองรับการ import เดิม ปัจจุบันแหล่งข้อมูลจริงอยู่ที่ mockUsers.ts
// ทุกอย่างถูก re-export จากไฟล์เดียวให้สัมพันธ์กันทั้งแอป

export { event, avatarPalette, useCustomers } from "./mockUsers";
export type { Customer, AttendeeKind } from "./mockUsers";
