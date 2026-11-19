import type { ReactNode } from 'react';
import AdminBottomNav from './_components/AdminBottomNav';
import AuthGate from './_components/AuthGate';
import { AdminStoreProvider } from './_lib/AdminStore';
import './admin.css';

/**
 * มือถือ/แท็บเล็ต: เนื้อหา + เมนูล่าง
 * คอมพิวเตอร์ (>=1024px): เมนูด้านข้าง + เนื้อหา (สลับด้วย CSS)
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminStoreProvider>
      <div className="admin-shell">
        <AuthGate>
          <AdminBottomNav />
          <div className="admin-content">{children}</div>
        </AuthGate>
      </div>
    </AdminStoreProvider>
  );
}
