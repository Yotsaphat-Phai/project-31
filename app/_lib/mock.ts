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
    name: "Cristiano Ronaldo",
    email: "user@test.com",
    phone: "081-xxx-xxx1",
    password: "123456",
    role: "user",
    active: true,
    createdAt: "2026-11-01T09:00:00+07:00",
  },
  {
    id: "U002",
    name: "Test User 1",
    email: "jj@test.com",
    phone: "081-xxx-xxxx",
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
    phone: "082-xxx-xxxx",
    password: "123456",
    role: "staff",
    active: true,
    createdAt: "2026-10-20T09:00:00+07:00",
  },
  {
    id: "S002",
    name: "Lala (Staff)",
    email: "staff2@test.com",
    phone: "082-xxx-xxxx",
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
    phone: "083-xxx-xxxx",
    password: "123456",
    role: "vendor",
    active: true,
    createdAt: "2026-10-22T09:00:00+07:00",
  },
  {
    id: "V002",
    name: "ร้านขนมหวาน",
    email: "vendor2@test.com",
    phone: "083-xxx-xxxx",
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
    phone: "084-xxx-xxxx",
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
    phone: "085-xxx-xxxx",
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
  image: string;     // รูปปก (อยู่ใน /public)
  dateText: string;  // เช่น "เสาร์ 20 ธ.ค. · 18:00 น."
  venue: string;
  price: number;     // ราคาเริ่มต้นต่อใบ (บาท)
  ticketsLeft: number;
};

export const events: EventItem[] = [
  {
    id: "E001",
    title: "งานเลี้ยงรุ่น SPU 2027",
    image: "/images/event-cover.jpg",
    dateText: "เสาร์ 20 ธ.ค. · 18:00 น.",
    venue: "อาคารเฉลิมพระเกียรติ 50 ปี มหาวิทยาลัยศรีปทุม",
    price: 500,
    ticketsLeft: 500,
  },
];

// ===== ร้านค้า (หน้า /vendor/account) — ผูกกับบัญชี vendor ด้วย vendorId =====
export type Shop = {
  vendorId: string;   // id ของบัญชีใน vendors
  code: string;       // รหัสร้าน เช่น VCK001
  name: string;
  category: string;
  token: number;      // Token คงเหลือ (บาท)
  staffCount: number;
};

export const shops: Shop[] = [
  { vendorId: "V001", code: "VCK001", name: "ร้านน้ำเย็น", category: "เครื่องดื่ม", token: 84000, staffCount: 3 },
  { vendorId: "V002", code: "VCK002", name: "ร้านขนมหวาน", category: "ของหวาน", token: 12500, staffCount: 2 },
];
