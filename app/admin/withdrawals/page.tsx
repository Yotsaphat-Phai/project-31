'use client';

import { useMemo, useState } from 'react';
import { Landmark, Coins } from 'lucide-react';
import AdminHeader from '../_components/AdminHeader';
import WithdrawRejectSheet from '../_sheets/WithdrawRejectSheet';
import { useAdminStore } from '../_lib/AdminStore';
import type { WithdrawRequest, WithdrawStatus } from '../_lib/types';
import { fmt } from '../_lib/utils';

const TAB_LABEL: Record<WithdrawStatus, string> = {
  pending: 'รออนุมัติ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ปฏิเสธ',
};

/** หน้าแอดมิน: อนุมัติการถอน TOKEN ของร้านค้า */
export default function WithdrawalApproval() {
  const { withdrawals: items, setWithdrawals: setItems, setStores } = useAdminStore();
  const [tab, setTab] = useState<WithdrawStatus>('pending');
  const [rejecting, setRejecting] = useState<WithdrawRequest | null>(null);

  const count = (s: WithdrawStatus) => items.filter((w) => w.status === s).length;
  const visible = useMemo(() => items.filter((w) => w.status === tab), [items, tab]);
  const totalPending = items
    .filter((w) => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);

  const now = () =>
    'วันนี้ ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';

  const patch = (id: string, changes: Partial<WithdrawRequest>) =>
    setItems((prev) => prev.map((w) => (w.id === id ? { ...w, ...changes } : w)));

  const approve = (w: WithdrawRequest) => {
    // หัก TOKEN ออกจากยอดสะสมของร้านค้าตามจำนวนที่ถอน
    setStores((prev) =>
      prev.map((s) => (s.id === w.storeId ? { ...s, totalToken: Math.max(0, s.totalToken - w.amount) } : s))
    );
    patch(w.id, { status: 'approved', processedAt: now() });
  };

  return (
    <>
      <AdminHeader title="คำขอถอน TOKEN" back />
      <main className="admin-main">
        {/* การ์ดสรุป */}
        <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="avatar" style={{ width: 40, height: 40, borderRadius: 10, background: '#D99A1F' }}>
            <Coins size={18} />
          </span>
          <div style={{ flex: 1 }}>
            <div className="sub" style={{ fontSize: 11 }}>รวมคำขอรออนุมัติ {count('pending')} รายการ</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{fmt(totalPending)} TOKEN</div>
          </div>
        </div>

        {/* แท็บสถานะ */}
        <div className="chips" style={{ marginTop: 14 }}>
          {(Object.keys(TAB_LABEL) as WithdrawStatus[]).map((s) => (
            <button key={s} className={`chip ${tab === s ? 'on' : ''}`} onClick={() => setTab(s)}>
              {TAB_LABEL[s]}
              {s === 'pending' ? ` ${count(s)}` : ''}
            </button>
          ))}
        </div>

        {/* รายการ */}
        <div className="list">
          {visible.length === 0 && <p className="note">ไม่มีรายการ</p>}
          {visible.map((w) => (
            <article key={w.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="avatar" style={{ width: 40, height: 40, borderRadius: 10, background: '#5E8BC9', fontSize: 14 }}>
                  {w.storeId}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{w.storeName}</div>
                  <div className="sub">#{w.id} · {w.owner}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#D99A1F' }}>{fmt(w.amount)}</div>
                  <div className="sub" style={{ fontSize: 10 }}>TOKEN</div>
                </div>
              </div>

              <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: '#FFF7EE', border: '1px dashed #F0DFCF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700 }}>
                  <Landmark size={14} color="#5E8BC9" />
                  {w.bank}
                </div>
                <div className="sub" style={{ marginTop: 4, fontSize: 12 }}>
                  {w.accountNo} · {w.accountName}
                </div>
                <div className="sub" style={{ marginTop: 4 }}>ส่งคำขอเมื่อ {w.requestedAt}</div>
              </div>

              {w.status === 'rejected' && w.rejectReason && (
                <div className="status coral" style={{ marginTop: 10 }}>
                  ปฏิเสธ · {w.rejectReason}
                </div>
              )}
              {w.status === 'approved' && w.processedAt && (
                <div className="status teal" style={{ marginTop: 10 }}>
                  อนุมัติเมื่อ {w.processedAt}
                </div>
              )}

              {w.status === 'pending' && (
                <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                  <button className="btn btn-sm btn-outline-coral" onClick={() => setRejecting(w)}>
                    ปฏิเสธ
                  </button>
                  <button className="btn btn-sm btn-teal" onClick={() => approve(w)}>
                    อนุมัติการถอน
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </main>

      <WithdrawRejectSheet
        open={!!rejecting}
        requestId={rejecting?.id ?? ''}
        onClose={() => setRejecting(null)}
        onConfirm={(reason) => {
          if (rejecting) patch(rejecting.id, { status: 'rejected', rejectReason: reason, processedAt: now() });
          setRejecting(null);
        }}
      />
    </>
  );
}
