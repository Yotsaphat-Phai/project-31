import type { Attendee, EventConfig, Order, Slip, Store } from './types';

export const initialSlips: Slip[] = [
  { id: 'A0123', buyer: 'สมชาย ใจดี', batch: '20XX', tickets: 2, amount: 1000, paidAt: '14:32 น.', status: 'pending' },
  { id: 'A0124', buyer: 'สมหญิง รักเรียน', batch: '20XX', tickets: 1, amount: 500, paidAt: '14:32 น.', status: 'pending' },
  { id: 'A0125', buyer: 'มาลี งามตา', batch: '20XX', tickets: 1, amount: 500, paidAt: '11:05 น.', status: 'approved' },
  { id: 'A0126', buyer: 'รัตนา ใจงาม', batch: '21XX', tickets: 2, amount: 1000, paidAt: '10:40 น.', status: 'rejected', rejectReason: 'สลิปไม่ชัด' },
];

export const attendees: Attendee[] = [
  { id: 'U1', name: 'มาลี งามตา', batch: '20XX', tickets: 1, token: 350, checkedIn: true, phone: '081-111-2222' },
  { id: 'U2', name: 'อนุชา เก่งกล้า', batch: '20XX', tickets: 2, token: 700, checkedIn: true, phone: '081-222-3333' },
  { id: 'U3', name: 'กิตติ สุดสวย', batch: '19XX', tickets: 1, token: 120, checkedIn: false, phone: '081-234-5678' },
  { id: 'U4', name: 'รัตนา ใจงาม', batch: '21XX', tickets: 2, token: 0, checkedIn: false, phone: '081-333-4444' },
  { id: 'U5', name: 'พิชัย ทองดี', batch: '20XX', tickets: 1, token: 500, checkedIn: true, phone: '081-444-5555' },
  { id: 'U6', name: 'สมชาย ใจดี', batch: '20XX', tickets: 2, token: 1000, checkedIn: true, phone: '081-555-6666' },
  { id: 'U7', name: 'นภา สุขใจ', batch: '20XX', tickets: 1, token: 300, checkedIn: false, phone: '081-666-7777' },
];

export const initialStores: Store[] = [
  { id: 'A', name: 'ร้านน้ำเย็น', owner: 'คุณสมศรี', totalToken: 5400, open: true },
  { id: 'B', name: 'ครัวบ้านรุ่น', owner: 'คุณประสิทธิ์', totalToken: 4600, open: true },
  { id: 'C', name: 'ขนมหวานป้าน้อย', owner: 'ป้าน้อย', totalToken: 3100, open: true },
  { id: 'D', name: 'บาร์น้ำปั่น', owner: 'คุณวิชัย', totalToken: 5000, open: false },
];

export const orders: Order[] = [
  { id: 'O-1042', type: 'ticket', actor: 'มาลี งามตา', amount: 500, time: '11:05' },
  { id: 'O-1043', type: 'topup', actor: 'อนุชา เก่งกล้า', amount: 700, time: '12:55' },
  { id: 'O-1044', type: 'spend', actor: 'อนุชา เก่งกล้า', store: 'ร้าน A · ร้านน้ำเย็น', amount: 120, time: '13:02' },
  { id: 'O-1046', type: 'spend', actor: 'พิชัย ทองดี', store: 'ร้าน B · ครัวบ้านรุ่น', amount: 200, time: '13:30' },
  { id: 'O-1047', type: 'topup', actor: 'พิชัย ทองดี', amount: 500, time: '13:12' },
  { id: 'O-1045', type: 'ticket', actor: 'อนุชา เก่งกล้า', amount: 1000, time: '12:40' },
];

export const initialEvent: EventConfig = {
  name: 'งานเลี้ยงรุ่น Class of 20XX',
  ticketPrice: 500,
  totalTickets: 200,
  tokenRate: 1,
  saleOpen: true,
  sold: 128,
};

export const dashboardStats = {
  attendees: 128,
  ticketSales: 64000,
  tokenUsed: 18450,
  pendingSlips: 7,
};
