"use client";

export type StaffFontSize = "sm" | "md" | "lg";

export const FS_KEY = "staff-font-size-v1";

export const FONT_PX: Record<StaffFontSize, string> = {
  sm: "14px",
  md: "16px",
  lg: "18px",
};

export function loadStaffFontSize(): StaffFontSize {
  if (typeof window === "undefined") return "md";
  const v = localStorage.getItem(FS_KEY);
  return v === "sm" || v === "lg" ? v : "md";
}

export function applyStaffFontSize(size: StaffFontSize) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.staffFont = size;
  document.documentElement.style.setProperty("--staff-root-font", FONT_PX[size]);
}

export function saveStaffFontSize(size: StaffFontSize) {
  try {
    localStorage.setItem(FS_KEY, size);
  } catch {}
  applyStaffFontSize(size);
  // แจ้ง layout และหน้าอื่น ๆ ให้รีเฟรช UI ทันที (ไม่ต้อง reload)
  window.dispatchEvent(new CustomEvent("staff-font-size-change", { detail: size }));
}