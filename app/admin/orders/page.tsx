'use client';

import { useMemo, useState } from 'react';
import AdminHeader from '../_components/AdminHeader';
import Avatar from '../_components/Avatar';
import FilterChips from '../_components/FilterChips';
import OrderDetailSheet from '../_sheets/OrderDetailSheet';
import { orders } from '../_lib/mockData';
import type { Order, OrderType } from '../_lib/types';
import { baht, fmt, ORDER_LABEL } from '../_lib/utils';

type Filter = 'all' | OrderType;

/** 5) คำสั่งซื้อ (+ แผงรายละเอียด) */
export default function Orders() {
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Order | null>(null);

  const shown = useMemo(() => orders.filter((o) => filter === 'all' || o.type === filter), [filter]);
  const total = shown.reduce((sum, o) => sum + o.amount, 0);

  return (
    <>
      <AdminHeader title="คำสั่งซื้อ" />
      <main className="admin-main">
        <div className="card" style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', marginBottom: 12 }}>
          <div><div className="sub">รายการ</div><strong style={{ fontSize: 20 }}>{shown.length}</strong></div>
          <div><div className="sub">มูลค่ารวม</div><strong style={{ fontSize: 20 }}>{baht(total)}</strong></div>
        </div>

        <FilterChips<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'ทั้งหมด' },
            { value: 'ticket', label: 'ซื้อบัตร' },
            { value: 'topup', label: 'เติม TOKEN' },
            { value: 'spend', label: 'ใช้จ่าย' },
          ]}
        />

        <div className="list">
          {shown.map((o, i) => (
            <button key={o.id} className="card row" onClick={() => setSelected(o)}>
              <Avatar name={o.actor} index={i} size={40} />
              <div className="grow">
                <div className="title">
                  {o.actor}
                  {o.type === 'spend' && o.store ? ` → ${o.store.split(' · ')[0]}` : ''}
                </div>
                <div className="sub">{o.id} · {ORDER_LABEL[o.type]} · {o.time}</div>
              </div>
              <strong>{o.type === 'spend' ? fmt(o.amount) : `${fmt(o.amount)} ฿`}</strong>
            </button>
          ))}
        </div>
      </main>

      <OrderDetailSheet order={selected} onClose={() => setSelected(null)} />
    </>
  );
}
