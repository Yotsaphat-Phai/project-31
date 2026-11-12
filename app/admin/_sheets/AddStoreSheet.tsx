'use client';

import { useState } from 'react';
import BottomSheet from '../_components/BottomSheet';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, owner: string) => void;
}

/** แผง "เพิ่มร้านค้า" */
export default function AddStoreSheet({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const valid = name.trim() !== '' && owner.trim() !== '';

  const submit = () => {
    if (!valid) return;
    onAdd(name.trim(), owner.trim());
    setName('');
    setOwner('');
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      <h2>เพิ่มร้านค้า</h2>

      <label className="field">
        ชื่อร้าน
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น ร้านน้ำเย็น" />
      </label>
      <label className="field">
        เจ้าของร้าน
        <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="ชื่อเจ้าของร้าน" />
      </label>

      <button className="btn btn-blue" style={{ marginTop: 8, opacity: valid ? 1 : 0.5 }} disabled={!valid} onClick={submit}>
        เพิ่มร้านค้า
      </button>
      <p className="note">ระบบจะสร้าง QR Code สำหรับรับชำระให้อัตโนมัติ</p>
    </BottomSheet>
  );
}
