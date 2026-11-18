"use client";

import { useState } from "react";
import SubPage, { inputCls, primaryBtnCls } from "../_components/SubPage";
import { changePassword } from "../../_lib/auth";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.next !== form.confirm) {
      setMsg({ ok: false, text: "รหัสผ่านใหม่ไม่ตรงกัน" });
      return;
    }
    try {
      changePassword(form.current, form.next);
      setForm({ current: "", next: "", confirm: "" });
      setMsg({ ok: true, text: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" });
    } catch (err) {
      setMsg({ ok: false, text: (err as Error).message });
    }
  };

  const field = (key: keyof typeof form, label: string) => (
    <label className="block">
      <span className="block mb-1.5 text-sm text-gray-600">{label}</span>
      <input
        type="password"
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className={inputCls}
        required
      />
    </label>
  );

  return (
    <SubPage title="เปลี่ยนรหัสผ่าน">
      <form onSubmit={onSubmit} className="space-y-4">
        {field("current", "รหัสผ่านปัจจุบัน")}
        {field("next", "รหัสผ่านใหม่ (อย่างน้อย 6 ตัว)")}
        {field("confirm", "ยืนยันรหัสผ่านใหม่")}
        {msg && <p className={`text-sm ${msg.ok ? "text-[#4E9C8F]" : "text-red-500"}`}>{msg.text}</p>}
        <button type="submit" className={primaryBtnCls}>เปลี่ยนรหัสผ่าน</button>
      </form>
    </SubPage>
  );
}
