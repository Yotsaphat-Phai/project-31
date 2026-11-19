'use client';

import { useEffect, useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import BottomSheet from '../_components/BottomSheet';
import type { SupportTicket } from '../_lib/types';
import { TOPIC_LABEL, TOPIC_COLOR } from '../_lib/utils';

const QUICK_REPLIES = [
  'สร้าง QR ใหม่ให้แล้ว',
  'ปรับยอด TOKEN ให้ถูกต้องแล้ว',
  'โอนคืนให้ทางบัญชีเดิมแล้ว',
  'ติดต่อกลับทางไลน์แล้ว',
];

interface Props {
  ticket: SupportTicket | null;
  onClose: () => void;
  onMarkProgress: (id: string) => void;
  onResolve: (id: string, reply: string) => void;
}

/** แผงดูรายละเอียดเรื่องแจ้งปัญหา + ตอบ / ปิดเรื่อง */
export default function SupportDetailSheet({ ticket, onClose, onMarkProgress, onResolve }: Props) {
  const [reply, setReply] = useState('');

  // ล้างข้อความตอบเมื่อเปิดเรื่องใหม่
  useEffect(() => {
    if (ticket) setReply('');
  }, [ticket?.id]);

  if (!ticket) return null;

  const pick = (text: string) => setReply((cur) => (cur ? `${cur} · ${text}` : text));

  return (
    <BottomSheet open={!!ticket} onClose={onClose}>
      <h2>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 10px',
            marginRight: 8,
            borderRadius: 999,
            background: TOPIC_COLOR[ticket.topic],
            color: '#fff',
            fontSize: 11,
            verticalAlign: 'middle',
          }}
        >
          {TOPIC_LABEL[ticket.topic]}
        </span>
        #{ticket.id}
      </h2>

      <div className="kv"><span>ผู้แจ้ง</span><span>{ticket.user}</span></div>
      <div className="kv"><span>เบอร์โทร</span><span>{ticket.phone}</span></div>
      {ticket.orderRef && (
        <div className="kv"><span>อ้างอิง</span><span>#{ticket.orderRef}</span></div>
      )}
      <div className="kv"><span>แจ้งเมื่อ</span><span>{ticket.submittedAt}</span></div>

      <div className="card" style={{ marginTop: 12, padding: 12, background: 'var(--coral-soft)', borderColor: 'var(--coral-soft)' }}>
        <div className="sub" style={{ marginBottom: 4, fontSize: 11, fontWeight: 700 }}>รายละเอียดที่ผู้แจ้งส่งมา</div>
        <div style={{ fontSize: 13, lineHeight: 1.55 }}>{ticket.detail}</div>
      </div>

      {/* ปุ่มติดต่อผู้แจ้งโดยตรง */}
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <a href={`tel:${ticket.phone}`} className="btn btn-sm btn-outline-coral" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Phone size={16} /> โทรกลับ
        </a>
        <a href={`sms:${ticket.phone}`} className="btn btn-sm btn-outline-coral" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <MessageCircle size={16} /> ส่งข้อความ
        </a>
      </div>

      {ticket.status === 'resolved' ? (
        <>
          <div className="card" style={{ marginTop: 14, padding: 12, background: 'var(--teal-soft)', borderColor: 'var(--teal-soft)' }}>
            <div className="sub" style={{ marginBottom: 4, fontSize: 11, fontWeight: 700 }}>คำตอบของแอดมิน</div>
            <div style={{ fontSize: 13, lineHeight: 1.55 }}>{ticket.reply || '—'}</div>
            {ticket.resolvedAt && <div className="sub" style={{ marginTop: 6 }}>ปิดเรื่องเมื่อ {ticket.resolvedAt}</div>}
          </div>
        </>
      ) : (
        <>
          <div className="chips" style={{ marginTop: 14 }}>
            {QUICK_REPLIES.map((q) => (
              <button key={q} className="chip" onClick={() => pick(q)}>{q}</button>
            ))}
          </div>

          <label className="field">
            คำตอบถึงผู้แจ้ง
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="อธิบายว่าแอดมินดำเนินการอย่างไร"
              rows={3}
            />
          </label>

          <div style={{ display: 'flex', gap: 10 }}>
            {ticket.status === 'open' && (
              <button className="btn btn-sm btn-outline-coral" onClick={() => onMarkProgress(ticket.id)}>
                กำลังตรวจสอบ
              </button>
            )}
            <button
              className="btn btn-sm btn-teal"
              disabled={!reply.trim()}
              style={!reply.trim() ? { opacity: .5, cursor: 'not-allowed' } : undefined}
              onClick={() => onResolve(ticket.id, reply.trim())}
            >
              ปิดเรื่อง
            </button>
          </div>
          <p className="note">ผู้แจ้งจะเห็นคำตอบนี้ในหน้า “ติดต่อแอดมิน”</p>
        </>
      )}
    </BottomSheet>
  );
}
