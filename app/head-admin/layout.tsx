"use client";

import type { ReactNode } from "react";
import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "../_lib/auth";

// กันทุกหน้าใน /head-admin — ต้อง login ด้วยบัญชี role head-admin ก่อน
// ยังไม่ login หรือเป็น role อื่น → กลับหน้า login หลัก (/)
export default function HeadAdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const allowed = useSyncExternalStore(
    () => () => {},
    () => getCurrentUser()?.role === "head-admin",
    () => false
  );

  useEffect(() => {
    if (!allowed) router.replace("/admin/login");
  }, [allowed, router]);

  if (!allowed) return null;
  return <>{children}</>;
}