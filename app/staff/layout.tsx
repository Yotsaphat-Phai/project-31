"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Noto_Sans_Thai } from "next/font/google";
import "./staff.css";
import { loadSession } from "./_lib/auth";
import { applyStaffFontSize, loadStaffFontSize } from "./_lib/fontSize";

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

const PUBLIC_PATHS = new Set<string>(["/staff/login"]);

export default function StaffLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || "/staff";
  const [ready, setReady] = useState(false);

  // โหลดขนาดตัวอักษรให้มีผลทันทีก่อน render หน้าใด ๆ
  useEffect(() => {
    applyStaffFontSize(loadStaffFontSize());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<"sm" | "md" | "lg">).detail;
      if (detail) applyStaffFontSize(detail);
    };
    window.addEventListener("staff-font-size-change", onChange);
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === "staff-font-size-v1") applyStaffFontSize(loadStaffFontSize());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("staff-font-size-change", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.has(pathname);
    const session = loadSession();
    if (!session && !isPublic) {
      const next = encodeURIComponent(pathname);
      router.replace(`/staff/login?next=${next}`);
      return;
    }
    if (session && isPublic) {
      router.replace("/staff");
      return;
    }
    setReady(true);
  }, [pathname, router]);

  return (
    <div
      data-staff-root
      className={`${notoThai.className} min-h-dvh bg-neutral-200 antialiased`}
    >
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