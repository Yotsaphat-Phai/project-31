"use client";

// เด้งออกจากระบบทันทีเมื่อ head-admin ระงับบัญชี / ย้ายไปถังขยะ / ลบถาวร
// เช็กทุก 3 วินาที (SyncStore ดึงข้อมูลจากเครื่องอื่นมาทุก 3 วินาทีเหมือนกัน)

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isCurrentUserBlocked, logout } from "../_lib/auth";

export default function SessionGuard() {
  const router = useRouter();

  useEffect(() => {
    const check = () => {
      if (!isCurrentUserBlocked()) return;
      logout();
      try {
        localStorage.removeItem("staff-auth-v1"); // session ของส่วน staff ด้วย
      } catch {}
      alert("บัญชีของคุณถูกระงับ กรุณาติดต่อ Admin");
      router.replace("/");
    };
    check();
    const timer = setInterval(check, 3000);
    return () => clearInterval(timer);
  }, [router]);

  return null;
}