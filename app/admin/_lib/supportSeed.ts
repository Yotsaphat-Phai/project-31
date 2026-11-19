import type { SupportTicket } from './types';

/** ข้อมูลตัวอย่างเรื่องแจ้งปัญหาที่ผู้ใช้ส่งมาจากหน้า "ติดต่อแอดมิน" */
export const SUPPORT_SEED: SupportTicket[] = [
  {
    id: 'T001',
    topic: 'qr',
    orderRef: 'O-1044',
    user: 'อนุชา เก่งกล้า',
    phone: '081-222-3333',
    detail: 'ลูกค้าสแกนแล้วขึ้นว่า QR หมดอายุ ทั้งที่เพิ่งกดสร้าง',
    submittedAt: '14:20 น.',
    status: 'open',
  },
  {
    id: 'T002',
    topic: 'token',
    orderRef: 'O-1043',
    user: 'พิชัย ทองดี',
    phone: '081-444-5555',
    detail: 'เติม 500 บาท แต่ TOKEN ขึ้นแค่ 300',
    submittedAt: '13:55 น.',
    status: 'open',
  },
  {
    id: 'T003',
    topic: 'bank',
    user: 'คุณสมศรี (ร้าน A)',
    phone: '081-999-0000',
    detail: 'ขอเปลี่ยนบัญชีรับเงินปลายงานเป็นธนาคารกสิกร',
    submittedAt: '12:10 น.',
    status: 'progress',
  },
  {
    id: 'T004',
    topic: 'other',
    orderRef: 'A0126',
    user: 'รัตนา ใจงาม',
    phone: '081-333-4444',
    detail: 'ยังไม่ได้รับบัตรเข้างานหลังโอนเงินแล้ว',
    submittedAt: 'เมื่อวาน',
    status: 'resolved',
    reply: 'ส่งบัตรใหม่ให้ทางไลน์แล้ว',
    resolvedAt: 'เมื่อวาน 18:40 น.',
  },
];
