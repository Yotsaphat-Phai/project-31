/**
 * localStorage key กลาง — ทั้งฝั่ง admin และ vendor อ่าน/เขียนที่นี่
 * เพื่อให้คำขอถอนจากหน้า vendor โผล่ขึ้นที่หน้า admin ทันที
 */
export const SHARED_WITHDRAW_KEY = 'eventhub:withdrawals';

const isBrowser = () => typeof window !== 'undefined';

export function readShared<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeShared<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode → ข้าม */
  }
}
