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

export type WithdrawStatus = 'pending' | 'approved' | 'rejected';

export interface WithdrawRequest {
  id: string;            // W-0001
  storeId: string;       // A, B, C, D
  storeName: string;
  owner: string;
  amount: number;        // TOKEN ที่ขอถอน
  bank: string;          // ธนาคารกสิกรไทย
  accountNo: string;     // 123-4-56789-0
  accountName: string;   // ชื่อบัญชี
  requestedAt: string;   // "วันนี้ 13:40 น."
  status: WithdrawStatus;
  rejectReason?: string;
  processedAt?: string;
}

export type TicketTopic = 'qr' | 'token' | 'bank' | 'other';
export type TicketStatus = 'open' | 'progress' | 'resolved';

export interface SupportTicket {
  id: string;            // T001
  topic: TicketTopic;
  orderRef?: string;     // อ้างถึง #A0123 / O-1042 (ถ้ามี)
  user: string;
  phone: string;
  detail: string;        // ข้อความจากผู้แจ้ง
  submittedAt: string;   // "14:20 น."
  status: TicketStatus;
  reply?: string;        // คำตอบของแอดมิน (ตอนปิดเรื่อง)
  resolvedAt?: string;
}

export interface EventConfig {
  name: string;
  ticketPrice: number;
  totalTickets: number;
  tokenRate: number;     // 1 บาท = ? TOKEN
  saleOpen: boolean;
  sold: number;
}
