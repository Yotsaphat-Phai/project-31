export type SlipStatus = 'pending' | 'approved' | 'rejected';

export interface Slip {
  id: string;            // เลขบัตร/ออเดอร์ เช่น A0123
  buyer: string;
  batch: string;         // รุ่น
  tickets: number;
  amount: number;        // บาท
  paidAt: string;        // เวลาแนบสลิป
  status: SlipStatus;
  rejectReason?: string;
}

export interface Attendee {
  id: string;
  name: string;
  batch: string;
  tickets: number;
  token: number;
  checkedIn: boolean;
  phone: string;
}

export interface Store {
  id: string;            // A, B, C, D
  name: string;
  owner: string;
  totalToken: number;    // ขายได้ (TOKEN)
  open: boolean;
}

export type OrderType = 'ticket' | 'topup' | 'spend';

export interface Order {
  id: string;            // O-1042
  type: OrderType;
  actor: string;         // ผู้ทำรายการ
  store?: string;        // เฉพาะ spend
  amount: number;        // ticket/topup = บาท, spend = TOKEN
  time: string;
}

export interface EventConfig {
  name: string;
  ticketPrice: number;
  totalTickets: number;
  tokenRate: number;     // 1 บาท = ? TOKEN
  saleOpen: boolean;
  sold: number;
}
