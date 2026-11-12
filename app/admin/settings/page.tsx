'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '../_components/AdminHeader';
import Toggle from '../_components/Toggle';
import { useAdminStore } from '../_lib/AdminStore';
import type { EventConfig } from '../_lib/types';

/** 6) ตั้งค่างาน */
export default function EventSettings() {
  const { event, setEvent } = useAdminStore();
  const [cfg, setCfg] = useState<EventConfig>(event);
  const [saved, setSaved] = useState(false);

  // ค่าที่จำไว้โหลดเสร็จทีหลัง → ซิงก์เข้าฟอร์ม
  useEffect(() => setCfg(event), [event]);

  const set = <K extends keyof EventConfig>(k: K, v: EventConfig[K]) => {
    setCfg((p) => ({ ...p, [k]: v }));
    setSaved(false);
  };
  const pct = Math.min(100, (cfg.sold / cfg.totalTickets) * 100);

  return (
    <>
      <AdminHeader title="ตั้งค่างาน" back />
      <main className="admin-main narrow">
        <section className="card" style={{ padding: 16 }}>
          <label className="field">
            ชื่องาน
            <input value={cfg.name} onChange={(e) => set('name', e.target.value)} />
          </label>
          <label className="field">
            ราคาบัตร (บาท/ใบ)
            <input type="number" min={0} value={cfg.ticketPrice} onChange={(e) => set('ticketPrice', +e.target.value)} />
          </label>
          <label className="field">
            จำนวนบัตรทั้งหมด
            <input type="number" min={0} value={cfg.totalTickets} onChange={(e) => set('totalTickets', +e.target.value)} />
          </label>
          <label className="field">
            อัตราแลก TOKEN (1 บาท = ? TOKEN)
            <input type="number" min={0} value={cfg.tokenRate} onChange={(e) => set('tokenRate', +e.target.value)} />
          </label>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
            <div>
              <strong style={{ fontSize: 14 }}>เปิดขายบัตร</strong>
              <div className="sub">ปิดเพื่อหยุดรับสมัครชั่วคราว</div>
            </div>
            <Toggle checked={cfg.saleOpen} onChange={(v) => set('saleOpen', v)} label="เปิดขายบัตร" />
          </div>

          <hr style={{ margin: '16px 0', border: 0, borderTop: '1px solid #F0DFCF' }} />

          <strong style={{ fontSize: 13 }}>ขายแล้ว {cfg.sold} / {cfg.totalTickets} ใบ</strong>
          <div style={{ height: 10, marginTop: 8, borderRadius: 999, background: '#F0DFCF', overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: '#2A9D8F' }} />
          </div>
        </section>

        <button className="btn btn-blue" style={{ marginTop: 16 }} onClick={() => {
            setEvent(cfg);
            setSaved(true);
          }}>
          บันทึกการตั้งค่า
        </button>
        {saved && <p className="note" style={{ color: '#2A9D8F' }}>บันทึกเรียบร้อยแล้ว</p>}
      </main>
    </>
  );
}
