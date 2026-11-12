'use client';

import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

/** แผงเลื่อนขึ้นจากด้านล่าง (ใช้ใน Reject / Attendee / Add Store / Order detail) */
export default function BottomSheet({ open, onClose, children }: Props) {
  if (!open) return null;
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        {children}
      </div>
    </div>
  );
}
