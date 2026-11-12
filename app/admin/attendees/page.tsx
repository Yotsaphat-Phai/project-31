'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import AdminHeader from '../_components/AdminHeader';
import Avatar from '../_components/Avatar';
import FilterChips from '../_components/FilterChips';
import AttendeeDetailSheet from '../_sheets/AttendeeDetailSheet';
import { useAdminStore } from '../_lib/AdminStore';
import type { Attendee } from '../_lib/types';

type Filter = 'all' | 'in' | 'out';

/** 3) ผู้เข้าร่วม (+ แผงรายละเอียด / เช็กอินให้) */
export default function Attendees() {
  const { attendees: list, setAttendees: setList } = useAdminStore();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Attendee | null>(null);

  const shown = useMemo(
    () =>
      list.filter(
        (a) =>
          (`${a.name} ${a.batch}`.toLowerCase().includes(q.toLowerCase())) &&
          (filter === 'all' || (filter === 'in' ? a.checkedIn : !a.checkedIn)),
      ),
    [list, q, filter],
  );

  const checkIn = (id: string) => setList((p) => p.map((a) => (a.id === id ? { ...a, checkedIn: true } : a)));

  return (
    <>
      <AdminHeader title="ผู้เข้าร่วม" />
      <main className="admin-main">
        <label className="card" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', marginBottom: 12 }}>
          <Search size={18} color="#8A8A9A" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาชื่อ / รุ่น"
            style={{ flex: 1, border: 0, outline: 0, background: 'none', font: 'inherit', fontSize: 14 }}
          />
        </label>

        <FilterChips<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'ทั้งหมด' },
            { value: 'in', label: 'เช็กอินแล้ว' },
            { value: 'out', label: 'ยังไม่เช็กอิน' },
          ]}
        />

        <div className="list">
          {shown.map((a) => {
            const idx = list.indexOf(a);
            return (
              <button key={a.id} className="card row" onClick={() => setSelected(a)}>
                <Avatar name={a.name} index={idx} size={42} />
                <div className="grow">
                  <div className="title">{a.name}</div>
                  <div className="sub">รุ่น {a.batch} · {a.tickets} ใบ · {a.token} TOKEN</div>
                </div>
                <span className={`status ${a.checkedIn ? 'teal' : 'gold'}`}>
                  {a.checkedIn ? 'เช็กอินแล้ว' : 'ยังไม่มา'}
                </span>
              </button>
            );
          })}
        </div>
      </main>

      <AttendeeDetailSheet
        attendee={selected}
        avatarIndex={selected ? list.findIndex((a) => a.id === selected.id) : 0}
        onClose={() => setSelected(null)}
        onCheckIn={checkIn}
      />
    </>
  );
}
