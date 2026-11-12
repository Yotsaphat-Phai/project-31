'use client';

import { useState } from 'react';
import BottomSheet from '../_components/BottomSheet';

const REASONS = ['ยอดเงินไม่ตรง', 'สลิปไม่ชัด', 'สลิปซ้ำ', 'โอนผิดบัญชี'];

interface Props {
  open: boolean;
  slipId: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

/** แผง "เหตุผลที่ปฏิเสธ #A0123" */
export default function RejectReasonSheet({ open, slipId, onClose, onConfirm }: Props) {
  const [picked, setPicked] = useState(REASONS[0]);
  const [extra, setExtra] = useState('');

  const submit = () => {
    onConfirm(extra.trim() ? `${picked} · ${extra.trim()}` : picked);
    setExtra('');
    setPicked(REASONS[0]);
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      <h2>เหตุผลที่ปฏิเสธ #{slipId}</h2>

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
      <p className="note">ผู้ซื้อจะได้รับแจ้งเหตุผลและส่งสลิปใหม่ได้</p>
    </BottomSheet>
  );
}
