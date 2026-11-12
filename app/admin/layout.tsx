import type { ReactNode } from 'react';
import AdminBottomNav from './_components/AdminBottomNav';
import './admin.css';

/**
 * มือถือ/แท็บเล็ต: เนื้อหา + เมนูล่าง
 * คอมพิวเตอร์ (>=1024px): เมนูด้านข้าง + เนื้อหา (สลับด้วย CSS)
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <AdminBottomNav />
      <div className="admin-content">{children}</div>
    </div>
  );
}
