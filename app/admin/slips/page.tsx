'use client';

import { useMemo, useState } from 'react';
import AdminHeader from '../_components/AdminHeader';
import RejectReasonSheet from '../_sheets/RejectReasonSheet';
import { initialSlips } from '../_lib/mockData';
import type { Slip, SlipStatus } from '../_lib/types';
import { baht } from '../_lib/utils';

const TAB_LABEL: Record<SlipStatus, string> = {
  pending: 'รอตรวจสอบ',
  approved: 'อนุมัติ',
  rejected: 'ไม่อนุมัติ',
};

/** 2) ตรวจสลิป (+ แผงเหตุผลที่ปฏิเสธ) */
export default function SlipReview() {
  const [slips, setSlips] = useState<Slip[]>(initialSlips);
  const [tab, setTab] = useState<SlipStatus>('pending');
  const [rejecting, setRejecting] = useState<Slip | null>(null);

  const count = (s: SlipStatus) => slips.filter((x) => x.status === s).length;
  const visible = useMemo(() => slips.filter((s) => s.status === tab), [slips, tab]);

  const update = (id: string, patch: Partial<Slip>) =>
    setSlips((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <>
      <AdminHeader title="ตรวจสลิป" back />
      <main className="admin-main">
        <div className="chips">
          {(Object.keys(TAB_LABEL) as SlipStatus[]).map((s) => (
            <button key={s} className={`chip ${tab === s ? 'on' : ''}`} onClick={() => setTab(s)}>
              {TAB_LABEL[s]}
              {s === 'pending' ? ` ${count(s)}` : ''}
            </button>
          ))}
        </div>

        <div className="list">
          {visible.length === 0 && <p className="note">ไม่มีรายการ</p>}
          {visible.map((s) => (
            <article key={s.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', gap: 14 }}>
                {/* รูปสลิป (placeholder) */}
                <div style={{ width: 80, height: 110, flex: 'none', borderRadius: 8, background: '#E4E0EE' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>#{s.id}</div>
                  <div style={{ fontSize: 12 }}>{s.buyer} · รุ่น {s.batch}</div>
                  <div style={{ margin: '4px 0', color: '#F07060', fontSize: 13, fontWeight: 700 }}>
                    {s.tickets} ใบ · {baht(s.amount)}
                  </div>
                  <div className="sub">แนบเมื่อ {s.paidAt}</div>
                  <span
                    className={`status ${s.status === 'pending' ? 'gold' : s.status === 'approved' ? 'teal' : 'coral'}`}
                    style={{ marginTop: 6 }}
                  >
                    {s.status === 'rejected' && s.rejectReason ? `ไม่อนุมัติ · ${s.rejectReason}` : TAB_LABEL[s.status]}
                  </span>
                </div>
              </div>

              {s.status === 'pending' && (
                <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                  <button className="btn btn-sm btn-outline-coral" onClick={() => setRejecting(s)}>ปฏิเสธ</button>
                  <button className="btn btn-sm btn-teal" onClick={() => update(s.id, { status: 'approved' })}>อนุมัติ</button>
                </div>
              )}
            </article>
          ))}
        </div>
      </main>

      <RejectReasonSheet
        open={!!rejecting}
        slipId={rejecting?.id ?? ''}
        onClose={() => setRejecting(null)}
        onConfirm={(reason) => {
          if (rejecting) update(rejecting.id, { status: 'rejected', rejectReason: reason });
          setRejecting(null);
        }}
      />
    </>
  );
}
