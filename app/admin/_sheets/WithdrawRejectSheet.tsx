'use client';

import { useState } from 'react';
import BottomSheet from '../_components/BottomSheet';

const REASONS = [
  'ข้อมูลบัญชีไม่ตรง',
  'ยอด TOKEN ไม่ตรง',
  'ขอเอกสารเพิ่มเติม',
  'ยังไม่ถึงรอบจ่าย',
];

interface Props {
  open: boolean;
  requestId: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

/** แผง "เหตุผลที่ปฏิเสธการถอน #W-xxxx" */
export default function WithdrawRejectSheet({ open, requestId, onClose, onConfirm }: Props) {
  const [picked, setPicked] = useState(REASONS[0]);
  const [extra, setExtra] = useState('');

  const submit = () => {
    onConfirm(extra.trim() ? `${picked} · ${extra.trim()}` : picked);
    setExtra('');
    setPicked(REASONS[0]);
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      <h2>ปฏิเสธคำขอถอน #{requestId}</h2>

      <div className="chips">
        {REASONS.map((r) => (
          <button
            key={r}
            className={`chip ${picked === r ? 'on coral' : ''}`}
            onClick={() => setPicked(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <label className="field">
        เหตุผลเพิ่มเติม
        <input
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder="หรือพิมพ์เหตุผลอื่น"
        />
      </label>

      <button className="btn btn-outline-coral" onClick={submit}>
        ยืนยันปฏิเสธ
      </button>
      <p className="note">ร้านค้าจะเห็นเหตุผลและส่งคำขอใหม่ได้</p>
    </BottomSheet>
  );
}
