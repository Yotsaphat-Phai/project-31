'use client';

import Link from 'next/link';
import { Settings, Users, Ticket, Coins, FileText } from 'lucide-react';
import AdminHeader from './_components/AdminHeader';
import { dashboardStats, initialStores } from './_lib/mockData';
import { fmt } from './_lib/utils';

const BAR_COLORS = ['#F07060', '#2A9D8F', '#D99A1F', '#5E8BC9'];

/** 1) Admin Dashboard (ภาพรวม) */
export default function AdminDashboard() {
  const stats = [
    { label: 'ผู้เข้าร่วม', value: fmt(dashboardStats.attendees), icon: Users, color: '#F07060' },
    { label: 'ยอดขายบัตร', value: `${fmt(dashboardStats.ticketSales)} ฿`, icon: Ticket, color: '#2A9D8F' },
    { label: 'TOKEN ที่ใช้', value: fmt(dashboardStats.tokenUsed), icon: Coins, color: '#D99A1F' },
    { label: 'รอตรวจสลิป', value: String(dashboardStats.pendingSlips), icon: FileText, color: '#5E8BC9' },
  ];
  const max = Math.max(...initialStores.map((s) => s.totalToken));

  return (
    <>
      <AdminHeader
        title="Admin Dashboard"
        right={
          <Link href="/admin/settings" className="icon-btn" aria-label="ตั้งค่างาน">
            <Settings size={20} />
          </Link>
        }
      />
      <main className="admin-main">
        {/* การ์ดสถิติ 2x2 */}
        <div className="dash-stats">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card">
              <span className="avatar" style={{ width: 28, height: 28, borderRadius: 8, background: color }}>
                <Icon size={15} />
              </span>
              <div className="sub" style={{ marginTop: 6, color: '#6B6B80', fontSize: 11 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
            </div>
          ))}
        </div>

        <div className="dash-lower">
        {/* กราฟแท่ง: ยอดขายแต่ละร้าน (TOKEN) */}
        <section className="card" style={{ marginTop: 14, padding: 16 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14 }}>ยอดขายแต่ละร้าน (TOKEN)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 150 }}>
            {initialStores.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div
                  title={`${fmt(s.totalToken)} TOKEN`}
                  style={{ width: 36, height: (s.totalToken / max) * 125, borderRadius: 6, background: BAR_COLORS[i % 4] }}
                />
                <span style={{ fontSize: 11, color: '#6B6B80' }}>ร้าน {s.id}</span>
              </div>
            ))}
          </div>
        </section>

        {/* แบนเนอร์สลิปรอตรวจ */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, background: '#FBE6DF', borderColor: '#FBE6DF' }}>
          <strong style={{ fontSize: 13 }}>มีสลิปรอตรวจสอบ {dashboardStats.pendingSlips} รายการ</strong>
          <Link href="/admin/slips" className="status coral" style={{ background: '#F07060', color: '#fff', textDecoration: 'none' }}>
            ดูทั้งหมด
          </Link>
        </div>
        </div>
      </main>
    </>
  );
}
