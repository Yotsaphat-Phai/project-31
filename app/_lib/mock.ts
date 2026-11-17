// ข้อมูลจำลอง (Mock) รูปแบบ JSON แยกตาม role
// ไม่ได้เรียก API ภายนอก — auth.ts อ่านบัญชีจากไฟล์นี้ตรงๆ (คนที่สมัครเองเก็บแยกใน localStorage)
// รหัสผ่านทุกบัญชีเป็นค่าทดสอบ ห้ามใช้กับระบบจริง

export type Role = "user" | "staff" | "vendor" | "admin" | "head-admin";

export type Account = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  active: boolean;
  createdAt: string;
};

// role → หน้าแรกหลัง login
export const ROLE_HOME: Record<Role, string> = {
  user: "/events",
  staff: "/staff",
  vendor: "/vendor",
  admin: "/admin",
  "head-admin": "/head-admin",
};

export const users: Account[] = [
  {
    id: "U001",
    name: "สมชาย ใจดี",
    email: "user@test.com",
    phone: "0810000001",
    password: "123456",
    role: "user",
    active: true,
    createdAt: "2026-11-01T09:00:00+07:00",
  },
  {
    id: "U002",
    name: "ยศพัทธ์ ไพสาลี",
    email: "jj@test.com",
    phone: "0810000002",
    password: "000000",
    role: "user",
    active: true,
    createdAt: "2026-11-02T10:30:00+07:00",
  },
];

export const staff: Account[] = [
  {
    id: "S001",
    name: "ลลิตภัทร กันทา",
    email: "stafflemon@test.com",
    phone: "0820000001",
    password: "123456",
    role: "staff",
    active: true,
    createdAt: "2026-10-20T09:00:00+07:00",
  },
  {
    id: "S002",
    name: "สมชาย ใจดี (Staff)",
    email: "staff2@test.com",
    phone: "0820000002",
    password: "123456",
    role: "staff",
    active: false,
    createdAt: "2026-10-21T09:00:00+07:00",
  },
];

export const vendors: Account[] = [
  {
    id: "V001",
    name: "ฐาปกรณ์ ภิรมย์บูรณ์",
    email: "vendor@test.com",
    phone: "0830000001",
    password: "123456",
    role: "vendor",
    active: true,
    createdAt: "2026-10-22T09:00:00+07:00",
  },
  {
    id: "V002",
    name: "ร้านขนมหวาน",
    email: "vendor2@test.com",
    phone: "0830000002",
    password: "123456",
    role: "vendor",
    active: true,
    createdAt: "2026-10-22T09:30:00+07:00",
  },
];

export const admins: Account[] = [
  {
    id: "A001",
    name: "จัตติเทพ ชาติพหล",
    email: "admin@test.com",
    phone: "0840000001",
    password: "123456",
    role: "admin",
    active: true,
    createdAt: "2026-10-15T09:00:00+07:00",
  },
];

export const headAdmins: Account[] = [
  {
    id: "H001",
    name: "ณัฐพงศ์ พรมมาตร",
    email: "head@test.com",
    phone: "0850000001",
    password: "123456",
    role: "head-admin",
    active: true,
    createdAt: "2026-10-01T09:00:00+07:00",
  },
];

// รวมทุก role ไว้ที่เดียว (auth.ts ใช้ตอน login)
export const mockAccounts: Account[] = [
  ...users,
  ...staff,
  ...vendors,
  ...admins,
  ...headAdmins,
];

// ===== อีเวนต์ (หน้า /events ของ user) =====
export type EventItem = {
  id: string;
  title: string;
  badge: string;     // ข้อความบนป้ายในรูปปก
  dateText: string;  // เช่น "เสาร์ 20 ธ.ค. · 18:00 น."
  venue: string;
  price: number;     // ราคาเริ่มต้นต่อใบ (บาท)
  ticketsLeft: number;
};

export const events: EventItem[] = [
  {
    id: "E001",
    title: "งานเลี้ยงรุ่น Class of 20XX",
    badge: "Class of 20XX",
    dateText: "เสาร์ 20 ธ.ค. · 18:00 น.",
    venue: "ชื่อสถานที่จัดงาน",
    price: 500,
    ticketsLeft: 126,
  },
];
