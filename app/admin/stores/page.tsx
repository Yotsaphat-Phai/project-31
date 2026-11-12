'use client';

import { useState } from 'react';
import AdminHeader from '../_components/AdminHeader';
import Avatar from '../_components/Avatar';
import Toggle from '../_components/Toggle';
import { Trash2 } from 'lucide-react';
import AddStoreSheet from '../_sheets/AddStoreSheet';
import DeleteStoreSheet from '../_sheets/DeleteStoreSheet';
import type { Store } from '../_lib/types';
import { useAdminStore } from '../_lib/AdminStore';
import { fmt } from '../_lib/utils';

/** 4) ร้านค้า (+ แผงเพิ่มร้านค้า) */
export default function Stores() {
  const { stores, setStores } = useAdminStore();
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<Store | null>(null);

  const toggle = (id: string, open: boolean) =>
    setStores((p) => p.map((s) => (s.id === id ? { ...s, open } : s)));

  const remove = (id: string) => {
    setStores((p) => p.filter((s) => s.id !== id));
    setDeleting(null);
  };

  const add = (name: string, owner: string) => {
    const used = new Set(stores.map((s) => s.id));
    let n = 0;
    while (used.has(String.fromCharCode(65 + (n % 26)) + (n >= 26 ? Math.floor(n / 26) : ''))) n++;
    const id = String.fromCharCode(65 + (n % 26)) + (n >= 26 ? Math.floor(n / 26) : ''); // A, B, C, ... Z, A1, B1, ...
    setStores((p) => [...p, { id, name, owner, totalToken: 0, open: true }]);
    setAdding(false);
  };

  return (
    <>
      <AdminHeader title="ร้านค้า" />
      <main className="admin-main">
        <div className="list">
          {stores.map((s, i) => (
            <div key={s.id} className="card row" style={{ cursor: 'default' }}>
              <Avatar name={s.id} index={i} size={44} />
              <div className="grow">
                <div className="title">{s.name}</div>
                <div className="sub">ร้าน {s.id} · ขายได้ {fmt(s.totalToken)} TOKEN</div>
              </div>
              <Toggle checked={s.open} onChange={(v) => toggle(s.id, v)} label={`เปิด/ปิด ${s.name}`} />
              <button
                className="icon-btn"
                style={{ color: 'var(--coral)' }}
                aria-label={`ลบ ${s.name}`}
                onClick={() => setDeleting(s)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <button className="btn btn-blue" style={{ marginTop: 16 }} onClick={() => setAdding(true)}>
          + เพิ่มร้านค้า
        </button>
        <p className="note">ปิดร้านชั่วคราวเพื่อหยุดรับชำระ TOKEN ได้ทันที</p>
      </main>

      <AddStoreSheet open={adding} onClose={() => setAdding(false)} onAdd={add} />
      <DeleteStoreSheet store={deleting} onClose={() => setDeleting(null)} onConfirm={remove} />
    </>
  );
}
