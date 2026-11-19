'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSession } from '../_lib/auth';

/**
 * ตรวจ session ฝั่งเบราว์เซอร์: ถ้ายังไม่ login จะเด้งไปหน้า /admin/login
 * หน้า /admin/login เองไม่บังคับ
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const atLogin = pathname === '/admin/login';
    const session = getSession();

    if (!session && !atLogin) {
      router.replace('/admin/login');
      return;
    }
    if (session && atLogin) {
      router.replace('/admin');
      return;
    }
    setReady(true);
  }, [pathname, router]);

  // ซ่อนเนื้อหาจนกว่าจะเช็ค session เสร็จ เพื่อไม่ให้เห็นหน้าใน /admin กระพริบก่อน redirect
  if (!ready) return null;
  return <>{children}</>;
}
