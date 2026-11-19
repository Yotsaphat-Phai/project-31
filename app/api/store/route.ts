// ที่เก็บข้อมูลกลาง (mock backend) — ทุกเครื่องที่เปิดเว็บจาก dev server เดียวกันใช้ข้อมูลชุดนี้ร่วมกัน
// เก็บเป็นไฟล์ JSON ที่ .data/store.json (ไม่ขึ้น git) รูปแบบ { [key]: string } เหมือน localStorage
// GET  /api/store            → ข้อมูลทั้งหมด
// POST /api/store {key,value} → ตั้งค่า (value = null คือลบ)

import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), ".data", "store.json");

let cache: Record<string, string> | null = null;

async function read(): Promise<Record<string, string>> {
  if (cache) return cache;
  try {
    cache = JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    cache = {};
  }
  return cache!;
}

async function write(data: Record<string, string>) {
  cache = data;
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data));
}

export async function GET() {
  return Response.json(await read(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { key?: unknown; value?: unknown };
  if (typeof body.key !== "string" || !body.key) {
    return Response.json({ error: "key required" }, { status: 400 });
  }
  const data = { ...(await read()) };
  if (typeof body.value === "string") data[body.key] = body.value;
  else delete data[body.key];
  await write(data);
  return Response.json({ ok: true });
}
