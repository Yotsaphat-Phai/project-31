"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signUp, loadSession } from "../_lib/auth";

type Tab = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = params.get("next") || "/staff";

  const initialTab: Tab = params.get("tab") === "register" ? "register" : "login";
  const [tab, setTab] = useState<Tab>(initialTab);

  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loadSession()) router.replace(nextPath);
  }, [router, nextPath]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const canSubmit = useMemo(() => {
    if (!emailOrPhone.trim() || password.length < 6) return false;
    if (tab === "register") {
      if (!name.trim()) return false;
      if (password !== password2) return false;
    }
    return true;
  }, [tab, name, emailOrPhone, password, password2]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (tab === "login") signIn(emailOrPhone, password);
      else signUp({ name, emailOrPhone, password });
      router.replace(nextPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      setSubmitting(false);
    }
  }

  function switchTab(t: Tab) {
    setTab(t);
    setError(null);
    setPassword("");
    setPassword2("");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-[390px] flex-col bg-[#fdf6ee]">
      {/* breadcrumb เล็ก */}
      <header className="px-4 pt-5">
        <p className="text-[13px] text-[#1f2a2e]">
          {tab === "login" ? "Login" : "Register"} <span className="text-neutral-400">·</span> User
        </p>
      </header>

      {/* top bar: back + role chip */}
      <div className="mx-4 mt-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="ย้อนกลับ"
          onClick={() => router.back()}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#1f2a2e] transition active:bg-black/5"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="rounded-full bg-[#f0705a] px-3 py-1 text-[11px] font-semibold text-white shadow-[0_4px_10px_-4px_rgba(240,112,90,0.6)]">
          User
        </span>
      </div>

      {/* avatar + title */}
      <section className="mx-4 mt-8 flex flex-col items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#f0705a] shadow-[0_18px_28px_-18px_rgba(240,112,90,0.75)]">
          <svg viewBox="0 0 24 24" className="h-12 w-12 fill-white">
            <path d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 2c-3.9 0-8 1.95-8 5.25V21h16v-1.75C20 15.95 15.9 14 12 14z" />
          </svg>
        </div>
        <h1 className="mt-5 text-2xl font-bold text-[#1f2a2e]">Registration &amp; Ticket</h1>
        <p className="mt-1.5 text-center text-[13px] text-[#8a8580]">
          เข้าสู่ระบบเพื่อซื้อบัตรและดูบัตรของคุณ
        </p>
      </section>

      {/* segmented tabs */}
      <div className="mx-4 mt-6 rounded-full bg-[#f5e4d2] p-1">
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={() => switchTab("login")}
            className={`rounded-full py-2.5 text-sm font-semibold transition ${
              tab === "login"
                ? "bg-white text-[#1f2a2e] shadow-[0_2px_8px_-2px_rgba(31,42,46,0.15)]"
                : "text-[#8a8580]"
            }`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            type="button"
            onClick={() => switchTab("register")}
            className={`rounded-full py-2.5 text-sm font-semibold transition ${
              tab === "register"
                ? "bg-white text-[#1f2a2e] shadow-[0_2px_8px_-2px_rgba(31,42,46,0.15)]"
                : "text-[#8a8580]"
            }`}
          >
            สมัครสมาชิก
          </button>
        </div>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit} className="mx-4 mt-5 flex flex-col gap-4" noValidate>
        {tab === "register" && (
          <Field label="ชื่อ-นามสกุล">
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น สมชาย ใจดี"
              className="w-full rounded-2xl border border-[#f3e3d3] bg-white px-4 py-3 text-sm text-[#1f2a2e] outline-none transition focus:border-[#f0705a] focus:ring-2 focus:ring-[#f0705a]/20"
            />
          </Field>
        )}

        <Field label="อีเมล / เบอร์มือถือ">
          <input
            type="text"
            inputMode="email"
            autoComplete="username"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="name@email.com"
            className="w-full rounded-2xl border border-[#f3e3d3] bg-white px-4 py-3 text-sm text-[#1f2a2e] placeholder:text-[#c9bfae] outline-none transition focus:border-[#f0705a] focus:ring-2 focus:ring-[#f0705a]/20"
          />
        </Field>

        <Field label="รหัสผ่าน">
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              autoComplete={tab === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              className="w-full rounded-2xl border border-[#f3e3d3] bg-white px-4 py-3 pr-11 text-sm text-[#1f2a2e] placeholder:text-[#c9bfae] outline-none transition focus:border-[#f0705a] focus:ring-2 focus:ring-[#f0705a]/20"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              className="absolute inset-y-0 right-3 flex items-center text-[#8a8580]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
                {showPw ? (
                  <>
                    <path d="M3 3l18 18" strokeLinecap="round" />
                    <path d="M10.6 6.2A10 10 0 0121 12a10 10 0 01-3.3 4.6M6.3 6.3A10 10 0 003 12a10 10 0 0014 5.7" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                ) : (
                  <>
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </Field>

        {tab === "register" && (
          <Field label="ยืนยันรหัสผ่าน">
            <input
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="พิมพ์รหัสผ่านอีกครั้ง"
              className="w-full rounded-2xl border border-[#f3e3d3] bg-white px-4 py-3 text-sm text-[#1f2a2e] placeholder:text-[#c9bfae] outline-none transition focus:border-[#f0705a] focus:ring-2 focus:ring-[#f0705a]/20"
            />
            {password2 && password !== password2 && (
              <p className="mt-1 text-[11px] text-[#d94e35]">รหัสผ่านไม่ตรงกัน</p>
            )}
          </Field>
        )}

        {tab === "login" && (
          <div className="-mt-1 flex justify-end">
            <button
              type="button"
              onClick={() => setToast("โปรดติดต่อแอดมินเพื่อรีเซ็ตรหัสผ่าน")}
              className="text-[12px] font-medium text-[#f0705a] hover:underline"
            >
              ลืมรหัสผ่าน?
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-[#f3c6bd] bg-[#fbe3dc] px-3 py-2 text-[12px] text-[#c84a30]">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="mt-1 rounded-full bg-[#f0705a] py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(240,112,90,0.75)] transition disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99]"
        >
          {submitting
            ? "กำลังดำเนินการ…"
            : tab === "login"
            ? "เข้าสู่ระบบ"
            : "สมัครสมาชิก"}
        </button>

        {tab === "login" && (
          <p className="text-center text-[11px] text-[#8a8580]">
            บัญชีทดสอบ: <span className="font-medium text-[#1f2a2e]">staff@test.com</span>
            {" / "}
            <span className="font-medium text-[#1f2a2e]">123456</span>
          </p>
        )}
      </form>

      {/* footer switch */}
      <p className="mx-4 mb-6 mt-auto pt-10 text-center text-[12px] text-[#8a8580]">
        {tab === "login" ? (
          <>
            ยังไม่มีบัญชี?{" "}
            <button
              type="button"
              onClick={() => switchTab("register")}
              className="font-semibold text-[#f0705a] hover:underline"
            >
              สมัครสมาชิก
            </button>
          </>
        ) : (
          <>
            มีบัญชีอยู่แล้ว?{" "}
            <button
              type="button"
              onClick={() => switchTab("login")}
              className="font-semibold text-[#f0705a] hover:underline"
            >
              เข้าสู่ระบบ
            </button>
          </>
        )}
      </p>

      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed bottom-10 left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#1f2a2e] px-4 py-2 text-xs font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-[#1f2a2e]">{label}</span>
      {children}
    </label>
  );
}
