import type { ReactNode } from "react";
import { Noto_Sans_Thai } from "next/font/google";
import "./staff.css";

// ฟอนต์และสไตล์เฉพาะส่วน Staff ไม่กระทบหน้าอื่นของโปรเจกต์
const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${notoThai.className} min-h-dvh bg-neutral-200 antialiased`}>{children}</div>
  );
}
