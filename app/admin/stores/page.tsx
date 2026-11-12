'use client';

import { useState } from 'react';
import AdminHeader from '../_components/AdminHeader';
import Avatar from '../_components/Avatar';
import Toggle from '../_components/Toggle';
import AddStoreSheet from '../_sheets/AddStoreSheet';
import { initialStores } from '../_lib/mockData';
import type { Store } from '../_lib/types';
import { fmt } from '../_lib/utils';

/** 4) ร้านค้า (+ แผงเพิ่มร้านค้า) */
export default function Stores() {
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [adding, setAdding] = useState(false);

  const toggle = (id: string, open: boolean) =>
    setStores((p) => p.map((s) => (s.id === id ? { ...s, open } : s)));

  const add = (name: string, owner: string) => {
    const id = String.fromCharCode(65 + stores.length); // A, B, C, ...
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
            </div>
          ))}
        </div>

        <button className="btn btn-blue" style={{ marginTop: 16 }} onClick={() => setAdding(true)}>
          + เพิ่มร้านค้า
        </button>
        <p className="note">ปิดร้านชั่วคราวเพื่อหยุดรับชำระ TOKEN ได้ทันที</p>
      </main>

      <AddStoreSheet open={adding} onClose={() => setAdding(false)} onAdd={add} />
    </>
  );
}
