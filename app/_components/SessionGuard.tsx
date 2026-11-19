"use client";

// เด้งออกจากระบบทันทีเมื่อ head-admin ระงับบัญชี / ย้ายไปถังขยะ / ลบถาวร
// เช็กทุก 3 วินาที (SyncStore ดึงข้อมูลจากเครื่องอื่นมาทุก 3 วินาทีเหมือนกัน)

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, isCurrentUserBlocked, logout } from "../_lib/auth";

export default function SessionGuard() {
  const router = useRouter();

  useEffect(() => {
    const check = () => {
      if (!isCurrentUserBlocked()) return;
      const role = getCurrentUser()?.role;
      logout();
      try {
        localStorage.removeItem("staff-auth-v1"); // session ของส่วน staff ด้วย
        sessionStorage.removeItem("next-admin:session"); // session ของส่วน admin ด้วย
      } catch {}
      alert("บัญชีของคุณถูกระงับ กรุณาติดต่อ Admin");
      // admin / head-admin กลับหน้า login ของ admin, คนอื่นกลับหน้าแรก
      router.replace(role === "admin" || role === "head-admin" ? "/admin/login" : "/");
    };
    check();
    const timer = setInterval(check, 3000);
    return () => clearInterval(timer);
  }, [router]);

  return null;
}