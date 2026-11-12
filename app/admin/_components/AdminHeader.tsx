'use client';

import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  title: string;
  /** แสดงปุ่มย้อนกลับ */
  back?: boolean;
  /** ช่องด้านขวา (เช่น ไอคอนตั้งค่า) ก่อนป้าย Admin */
  right?: ReactNode;
}

export default function AdminHeader({ title, back, right }: Props) {
  const router = useRouter();
  return (
    <header className="admin-header">
      {back && (
        <button className="icon-btn" aria-label="ย้อนกลับ" onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>
      )}
      <h1>{title}</h1>
      {right}
      <span className="role-badge">Admin</span>
    </header>
  );
}
