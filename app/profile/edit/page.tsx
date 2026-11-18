"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SubPage, { useMounted, inputCls, primaryBtnCls } from "../_components/SubPage";
import { getCurrentUser, updateProfile } from "../../_lib/auth";

export default function EditProfilePage() {
  const mounted = useMounted();
  return mounted ? <Content /> : <SubPage title="แก้ไขข้อมูลส่วนตัว">{null}</SubPage>;
}

function Content() {
  const router = useRouter();
  // lazy init: อ่าน localStorage ตอน render ครั้งแรกบน client
  const [form, setForm] = useState(() => {
    const u = getCurrentUser();
    return { name: u?.name ?? "", email: u?.email ?? "", phone: u?.phone ?? "" };
  });
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateProfile(form);
      router.push("/profile");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const field = (key: keyof typeof form, label: string, type = "text") => (
    <label className="block">
      <span className="block mb-1.5 text-sm text-gray-600">{label}</span>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className={inputCls}
      />
    </label>
  );

  return (
    <SubPage title="แก้ไขข้อมูลส่วนตัว">
      <form onSubmit={onSubmit} className="space-y-4">
        {field("name", "ชื่อ - นามสกุล")}
        {field("email", "อีเมล", "email")}
        {field("phone", "เบอร์โทร", "tel")}
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className={primaryBtnCls}>บันทึก</button>
      </form>
    </SubPage>
  );
}
