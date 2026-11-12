'use client';

import BottomSheet from '../_components/BottomSheet';
import type { Store } from '../_lib/types';
import { fmt } from '../_lib/utils';

interface Props {
  store: Store | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

/** แผงยืนยัน "ลบร้านค้า" */
export default function DeleteStoreSheet({ store, onClose, onConfirm }: Props) {
  return (
    <BottomSheet open={!!store} onClose={onClose}>
      <h2>ลบร้านค้า</h2>
      {store && (
        <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.6 }}>
          ต้องการลบ <strong>{store.name}</strong> (ร้าน {store.id}) ใช่ไหม?
          {store.totalToken > 0 && <> ร้านนี้มียอดขาย {fmt(store.totalToken)} TOKEN ซึ่งจะถูกลบไปด้วย</>}
        </p>
      )}
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-sm btn-outline-coral" style={{ background: '#fff' }} onClick={onClose}>
          ยกเลิก
        </button>
        <button
          className="btn btn-sm"
          style={{ background: 'var(--coral)', color: '#fff', borderColor: 'var(--coral)' }}
          onClick={() => store && onConfirm(store.id)}
        >
          ลบร้านค้า
        </button>
      </div>
      <p className="note">การลบไม่สามารถย้อนกลับได้</p>
    </BottomSheet>
  );
}
