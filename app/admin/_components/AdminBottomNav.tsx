'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Receipt, UserCheck, Store, ListOrdered } from 'lucide-react';

const TABS = [
  { href: '/admin', label: 'ภาพรวม', icon: LayoutGrid },
  { href: '/admin/slips', label: 'สลิป', icon: Receipt },
  { href: '/admin/attendees', label: 'ผู้เข้าร่วม', icon: UserCheck },
  { href: '/admin/stores', label: 'ร้านค้า', icon: Store },
  { href: '/admin/orders', label: 'คำสั่งซื้อ', icon: ListOrdered },
];

export default function AdminBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/admin'
      ? pathname === '/admin' || pathname === '/admin/settings' // หน้าตั้งค่างานไฮไลต์แท็บภาพรวม
      : pathname.startsWith(href);

  return (
    <nav className="admin-nav">
      <div className="admin-brand">
        Registration &amp; Ticket
        <small>ระบบหลังบ้าน Admin</small>
      </div>
      {TABS.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={isActive(href) ? 'active' : ''}>
          <Icon size={22} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
