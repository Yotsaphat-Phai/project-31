import type { OrderType, TicketTopic } from './types';

export const fmt = (n: number) => n.toLocaleString('en-US');
export const baht = (n: number) => `฿${fmt(n)}`;

export const initial = (name: string) => name.trim().charAt(0);

const AVATAR_COLORS = ['#F2705F', '#2A9D8F', '#DB9A1F', '#5E8BC9'];
export const avatarColor = (i: number) => AVATAR_COLORS[i % AVATAR_COLORS.length];

export const ORDER_LABEL: Record<OrderType, string> = {
  ticket: 'ซื้อบัตร',
  topup: 'เติม TOKEN',
  spend: 'ใช้จ่าย',
};

export const TOPIC_LABEL: Record<TicketTopic, string> = {
  qr: 'สแกน QR ไม่ได้',
  token: 'ยอด TOKEN ไม่ตรง',
  bank: 'ถอนเงิน / บัญชีรับเงิน',
  other: 'เรื่องอื่นๆ',
};

export const TOPIC_COLOR: Record<TicketTopic, string> = {
  qr: '#D99A1F',
  token: '#F07060',
  bank: '#5E8BC9',
  other: '#2A9D8F',
};
