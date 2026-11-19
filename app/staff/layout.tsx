"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Noto_Sans_Thai } from "next/font/google";
import "./staff.css";
import { loadSession } from "./_lib/auth";

// ฟอนต์และสไตล์เฉพาะส่วน Staff ไม่กระทบหน้าอื่นของโปรเจกต์
const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

// เส้นทางภายใต้ /staff ที่ไม่ต้องล็อกอิน
const PUBLIC_PATHS = new Set<string>(["/staff/login"]);

export default function StaffLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || "/staff";
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.has(pathname);
    const session = loadSession();
    if (!session && !isPublic) {
      const next = encodeURIComponent(pathname);
      router.replace(`/staff/login?next=${next}`);
      return;
    }
    if (session && isPublic) {
      // ล็อกอินอยู่แล้วแต่กดเข้าหน้า login — พาไปหน้าหลัก
      router.replace("/staff");
      return;
    }
    setReady(true);
  }, [pathname, router]);

  return (
    <div className={`${notoThai.className} min-h-dvh bg-neutral-200 antialiased`}>
      {ready ? children : <SplashScreen />}
    </div>
  );
}

function SplashScreen() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[390px] items-center justify-center bg-[#fdf6ee]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#f0705a] border-t-transparent" />
        <p className="text-[12px] text-[#8a8580]">กำลังเตรียมหน้าจอ…</p>
      </div>
    </div>
  );
}
