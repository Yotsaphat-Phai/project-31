"use client";

// TOKEN ของ user: ผูกบัญชี user กับเลข 5 หลักในรายชื่อฝั่ง staff (staff-customers-v2)
// QR หน้า /token = เลขนี้ → staff สแกนที่ /staff/topup-scan แล้วเติม/หักได้

import { getCurrentUser } from "./auth";
import { addCustomer, getCustomer, getTokenLog } from "../staff/_lib/mockUsers";

const LINK_KEY = "p31-token-link"; // { [userId]: customerId }

function readLinks(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(LINK_KEY) ?? "{}");
  } catch {
    return {};
  }
}

// คืนเลข 5 หลักของ user ที่ login อยู่ — ยังไม่มีจะสร้างให้ (token เริ่ม 0)
export function getMyTokenId(): string | null {
  const u = getCurrentUser();
  if (!u) return null;
  const links = readLinks();
  if (links[u.id] && getCustomer(links[u.id])) return links[u.id];
  const c = addCustomer({ name: u.name, tickets: 0 });
  links[u.id] = c.id;
  localStorage.setItem(LINK_KEY, JSON.stringify(links));
  return c.id;
}

// ยอดคงเหลือปัจจุบัน
export function getMyTokenBalance(): number {
  const id = getMyTokenId();
  return id ? getCustomer(id)?.token ?? 0 : 0;
}

export function getMyTokenHistory() {
  const id = getMyTokenId();
  return id ? getTokenLog(id) : [];
}
