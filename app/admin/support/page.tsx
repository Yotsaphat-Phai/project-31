'use client';

import { useMemo, useState } from 'react';
import AdminHeader from '../_components/AdminHeader';
import SupportDetailSheet from '../_sheets/SupportDetailSheet';
import { useAdminStore } from '../_lib/AdminStore';
import type { SupportTicket, TicketStatus } from '../_lib/types';
import { TOPIC_LABEL, TOPIC_COLOR } from '../_lib/utils';

const TAB_LABEL: Record<TicketStatus, string> = {
  open: 'รอดำเนินการ',
  progress: 'กำลังตรวจสอบ',
  resolved: 'ปิดแล้ว',
};

/** หน้าแอดมิน: กล่องเรื่องแจ้งปัญหา (รับจากหน้า "ติดต่อแอดมิน") */
export default function SupportInbox() {
  const { tickets, setTickets } = useAdminStore();
  const [tab, setTab] = useState<TicketStatus>('open');
  const [active, setActive] = useState<SupportTicket | null>(null);

  const count = (s: TicketStatus) => tickets.filter((t) => t.status === s).length;
  const visible = useMemo(() => tickets.filter((t) => t.status === tab), [tickets, tab]);

  const patch = (id: string, changes: Partial<SupportTicket>) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
    setActive((cur) => (cur && cur.id === id ? { ...cur, ...changes } : cur));
  };

  return (
    <>
      <AdminHeader title="เรื่องแจ้งปัญหา" back />
      <main className="admin-main">
        <div className="chips">
          {(Object.keys(TAB_LABEL) as TicketStatus[]).map((s) => (
            <button key={s} className={`chip ${tab === s ? 'on' : ''}`} onClick={() => setTab(s)}>
              {TAB_LABEL[s]}
              {s !== 'resolved' ? ` ${count(s)}` : ''}
            </button>
          ))}
        </div>

        <div className="list">
          {visible.length === 0 && <p className="note">ไม่มีเรื่องในกลุ่มนี้</p>}
          {visible.map((t) => (
            <button key={t.id} className="card row" onClick={() => setActive(t)} style={{ padding: 14 }}>
              <span
                className="avatar"
                style={{ width: 40, height: 40, borderRadius: 10, background: TOPIC_COLOR[t.topic], fontSize: 11 }}
              >
                #{t.id.replace(/^T/, '')}
              </span>
              <div className="grow">
                <div className="title">{TOPIC_LABEL[t.topic]}</div>
                <div className="sub" style={{ marginTop: 2 }}>
                  {t.user}{t.orderRef ? ` · อ้างอิง #${t.orderRef}` : ''}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    color: '#2B2D42',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {t.detail}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                  <span
                    className={`status ${
                      t.status === 'open' ? 'gold' : t.status === 'progress' ? 'coral' : 'teal'
                    }`}
                  >
                    {TAB_LABEL[t.status]}
                  </span>
                  <span className="sub">{t.submittedAt}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      <SupportDetailSheet
        ticket={active}
        onClose={() => setActive(null)}
        onMarkProgress={(id) => patch(id, { status: 'progress' })}
        onResolve={(id, reply) =>
          patch(id, {
            status: 'resolved',
            reply,
            resolvedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
          })
        }
      />
    </>
  );
}
